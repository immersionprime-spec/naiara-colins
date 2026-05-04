import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const bucket = searchParams.get("bucket");

  if (!path || !bucket) {
    return NextResponse.json(
      { error: "Parâmetros path e bucket são obrigatórios." },
      { status: 400 }
    );
  }

  if (bucket !== "media" && bucket !== "blog-covers") {
    return NextResponse.json({ error: "Bucket inválido." }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: "Não foi possível gerar o link." },
        { status: 404 }
      );
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
