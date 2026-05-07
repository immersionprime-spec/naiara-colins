import { getAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Gera uma signed upload URL para o browser fazer PUT direto no Supabase Storage
// Usado para vídeos grandes que ultrapassariam o limite de 4.5MB do Vercel
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const { section, bucket, fileName } = await request.json();

    if (!section || !bucket || !fileName) {
      return NextResponse.json({ error: "Parâmetros em falta." }, { status: 400 });
    }

    if (bucket !== "media" && bucket !== "blog-covers") {
      return NextResponse.json({ error: "Bucket inválido." }, { status: 400 });
    }

    const ext = fileName.split(".").pop()?.toLowerCase() ?? "mp4";
    const objectPath = `${section}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      return NextResponse.json(
        { error: "Não foi possível gerar o link de upload." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: objectPath,
    });
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
