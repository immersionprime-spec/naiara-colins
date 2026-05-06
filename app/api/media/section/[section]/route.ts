import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Cache desativado — sempre busca dados frescos do Supabase
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    if (error || !data) {
      return NextResponse.json([], { headers: { "Cache-Control": "no-store" } });
    }

    // Gera signed URLs server-side (1 hora de validade)
    const withSigned = await Promise.all(
      data.map(async (row) => {
        const { data: signed } = await supabase.storage
          .from("media")
          .createSignedUrl(row.url, 3600);
        return { ...row, signedUrl: signed?.signedUrl ?? "" };
      })
    );

    return NextResponse.json(withSigned, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch {
    return NextResponse.json([], { headers: { "Cache-Control": "no-store" } });
  }
}
