import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { path, section, bucket, isPrimary, type, order } = await request.json();

    if (!path || !section || !bucket) {
      return NextResponse.json({ error: "Parâmetros em falta." }, { status: 400 });
    }
    if (bucket !== "media" && bucket !== "blog-covers") {
      return NextResponse.json({ error: "Bucket inválido." }, { status: 400 });
    }
    if (bucket !== "media") {
      return NextResponse.json({ success: true, path });
    }

    const mediaType: "image" | "video" = type === "video" ? "video" : "image";
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("media")
      .insert({
        section,
        url: path,
        type: mediaType,
        is_primary: isPrimary === true,
        order: typeof order === "number" ? order : 0,
      })
      .select("id, section, url, type, order, is_primary")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Conexão instável. Tente novamente." }, { status: 500 });
    }

    // Retorna o item completo para atualização local sem round-trip
    return NextResponse.json({ success: true, path, item: data });
  } catch {
    return NextResponse.json({ error: "Conexão instável. Tente novamente." }, { status: 500 });
  }
}
