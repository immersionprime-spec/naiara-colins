import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") || "pt";

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("content")
      .select("key, value")
      .eq("language", language);

    if (error) {
      return NextResponse.json(
        { error: "Conexão instável. Tente novamente." },
        { status: 500 }
      );
    }

    const map: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.key) map[row.key] = row.value ?? "";
    }

    return NextResponse.json(map);
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
