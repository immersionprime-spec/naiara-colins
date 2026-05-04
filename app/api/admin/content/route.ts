import { getAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: { key?: string; value?: string; language?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const { key, value, language } = body;
  if (!key || value === undefined || !language) {
    return NextResponse.json(
      { error: "Campos key, value e language são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("content").upsert(
      {
        key,
        value,
        language,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key,language" }
    );

    if (error) {
      return NextResponse.json(
        { error: "Conexão instável. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
