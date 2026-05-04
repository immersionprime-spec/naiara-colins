import { createSignedUrlForPath } from "@/lib/storage/signed-url";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") || "pt";

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, cover_url, published_at")
      .eq("published", true)
      .eq("language", language)
      .order("published_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Conexão instável. Tente novamente." },
        { status: 500 }
      );
    }

    const rows = (data ?? []) as PostRow[];
    const mapped = await Promise.all(
      rows.map(async (p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        cover_url: p.cover_url
          ? await createSignedUrlForPath("blog-covers", p.cover_url)
          : null,
        published_at: p.published_at,
      }))
    );

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
