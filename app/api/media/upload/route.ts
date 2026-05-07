import { getAdminUser } from "@/lib/auth/admin";
import { NextResponse } from "next/server";

const MAX_IMAGE = 10 * 1024 * 1024;
const MAX_VIDEO = 500 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Ficheiro em falta." }, { status: 400 });
  }

  const type = file.type.toLowerCase();
  const isImage = type.startsWith("image/");
  const isVideo = type === "video/mp4";

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Formato não suportado. Use JPG, PNG, WebP ou MP4." },
      { status: 415 }
    );
  }

  const max = isImage ? MAX_IMAGE : MAX_VIDEO;
  if (file.size > max) {
    return NextResponse.json(
      {
        error:
          "Arquivo muito grande. Use imagens de até 10MB ou vídeos de até 500MB.",
      },
      { status: 400 }
    );
  }

  const edgeUrl = `${supabaseUrl.replace(/\/$/, "")}/functions/v1/process-upload`;

  try {
    const outbound = new FormData();
    outbound.append("file", file, file.name);
    for (const key of ["section", "bucket", "isPrimary"]) {
      const v = formData.get(key);
      if (v !== null && v !== undefined) outbound.append(key, String(v));
    }

    const res = await fetch(edgeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: outbound,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg =
        json?.error ||
        json?.message ||
        "Conexão instável. Tente novamente.";
      if (res.status === 400 || res.status === 413) {
        return NextResponse.json(
          {
            error:
              "Arquivo muito grande. Use imagens de até 10MB ou vídeos de até 500MB.",
          },
          { status: 400 }
        );
      }
      if (res.status === 415) {
        return NextResponse.json(
          { error: "Formato não suportado. Use JPG, PNG, WebP ou MP4." },
          { status: 415 }
        );
      }
      return NextResponse.json({ error: String(msg) }, { status: 500 });
    }

    return NextResponse.json(json ?? { success: true });
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
