import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("instagram_cache")
      .select("id, post_id, media_url, thumbnail_url, caption, cached_at")
      .eq("visible", true)
      .order("cached_at", { ascending: false })
      .limit(12);

    if (error) {
      return NextResponse.json(
        { error: "Conexão instável. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
