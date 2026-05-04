import { createSignedUrlForPath } from "@/lib/storage/signed-url";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type Ctx = { params: { slug: string } };

export async function GET(request: Request, { params }: Ctx) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") || "pt";
  const slug = params.slug;

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .eq("language", language)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
    }

    const cover = data.cover_url
      ? await createSignedUrlForPath("blog-covers", data.cover_url as string)
      : null;

    return NextResponse.json({ ...data, cover_url: cover });
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
