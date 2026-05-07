import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// force-dynamic necessário por usar cookies (service role via env), mas
// o Cache-Control da resposta ainda pode ser usado pelo CDN da Vercel.
export const dynamic = "force-dynamic";

// Cache de 5 minutos na borda (Vercel CDN) — signed URLs têm validade de 1h,
// portanto cachear por 5min é seguro e elimina round-trips desnecessários ao Supabase.
const CACHE_SECONDS = 300;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("media")
      .select("id, section, url, type, order, is_primary")
      .eq("section", section)
      .order("order", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      });
    }

    // createSignedUrls (plural) — uma única chamada ao Storage para N arquivos
    const { data: signedData, error: signedError } = await supabase.storage
      .from("media")
      .createSignedUrls(
        data.map((row) => row.url),
        3600
      );

    const signedMap = new Map<string, string>();
    if (!signedError && signedData) {
      for (const entry of signedData) {
        if (entry.path && entry.signedUrl) {
          signedMap.set(entry.path, entry.signedUrl);
        }
      }
    }

    const withSigned = data.map((row) => ({
      ...row,
      signedUrl: signedMap.get(row.url) ?? "",
    }));

    return NextResponse.json(withSigned, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=60`,
      },
    });
  } catch {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  }
}
