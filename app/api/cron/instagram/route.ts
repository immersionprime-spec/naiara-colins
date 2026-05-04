import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type IgMedia = {
  id: string;
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
};

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    return NextResponse.json(
      { error: "Instagram não configurado." },
      { status: 500 }
    );
  }

  try {
    const url = new URL(
      `https://graph.instagram.com/${userId}/media`
    );
    url.searchParams.set(
      "fields",
      "id,media_url,thumbnail_url,caption"
    );
    url.searchParams.set("access_token", token);
    url.searchParams.set("limit", "12");

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Falha ao contactar o Instagram." },
        { status: 502 }
      );
    }

    const json = await res.json();
    const items: IgMedia[] = json.data ?? [];
    const supabase = createServiceRoleClient();

    let count = 0;
    for (const item of items) {
      if (!item.id || !item.media_url) continue;
      const { error } = await supabase.from("instagram_cache").upsert(
        {
          post_id: item.id,
          media_url: item.media_url,
          thumbnail_url: item.thumbnail_url ?? null,
          caption: item.caption ?? null,
          cached_at: new Date().toISOString(),
        },
        { onConflict: "post_id" }
      );
      if (!error) count += 1;
    }

    return NextResponse.json({ success: true, count });
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
