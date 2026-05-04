import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, name, photo_url, text, stars, order")
      .eq("visible", true)
      .order("order", { ascending: true });

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
