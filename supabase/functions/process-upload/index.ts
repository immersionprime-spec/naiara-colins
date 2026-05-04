import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import sharp from "npm:sharp@0.33.5";

const MAX_IMAGE = 10 * 1024 * 1024;
const MAX_VIDEO = 500 * 1024 * 1024;

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "Conexão instável. Tente novamente." }, 500);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: "Conexão instável. Tente novamente." }, 500);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return json({ error: "Ficheiro em falta." }, 400);
  }

  const section = String(form.get("section") ?? "misc");
  const bucket = String(form.get("bucket") ?? "media");
  const isPrimary = String(form.get("isPrimary") ?? "false") === "true";

  if (bucket !== "media" && bucket !== "blog-covers") {
    return json({ error: "Bucket inválido." }, 400);
  }

  const type = file.type.toLowerCase();
  const isImage = type.startsWith("image/");
  const isVideo = type === "video/mp4";

  if (!isImage && !isVideo) {
    return json(
      { error: "Formato não suportado. Use JPG, PNG, WebP ou MP4." },
      415
    );
  }

  const max = isImage ? MAX_IMAGE : MAX_VIDEO;
  if (file.size > max) {
    return json({ error: "Arquivo muito grande." }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const buf = new Uint8Array(await file.arrayBuffer());
  let objectPath: string;
  let mediaType: "image" | "video";

  if (isVideo) {
    mediaType = "video";
    objectPath = `${section}/${Date.now()}-${crypto.randomUUID()}.mp4`;
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(objectPath, buf, {
        contentType: "video/mp4",
        upsert: true,
      });
    if (upErr) {
      return json({ error: "Conexão instável. Tente novamente." }, 500);
    }
  } else {
    mediaType = "image";
    objectPath = `${section}/${Date.now()}-${crypto.randomUUID()}.webp`;

    const siteUrl =
      Deno.env.get("PUBLIC_SITE_URL") ??
      Deno.env.get("NEXT_PUBLIC_SITE_URL") ??
      "";
    const logoUrl =
      Deno.env.get("WATERMARK_LOGO_URL") ??
      (siteUrl ? `${siteUrl.replace(/\/$/, "")}/logo-watermark.png` : "");

    let pipeline = sharp(buf).rotate();

    if (logoUrl) {
      try {
        const logoRes = await fetch(logoUrl);
        if (logoRes.ok) {
          const logoBuf = new Uint8Array(await logoRes.arrayBuffer());
          const meta = await sharp(buf).metadata();
          const w = meta.width ?? 800;
          const h = meta.height ?? 800;
          const minDim = Math.min(w, h);
          const wmSize = Math.max(8, Math.floor(minDim * 0.2));
          const resizedLogo = await sharp(logoBuf)
            .resize(wmSize, wmSize, { fit: "inside" })
            .ensureAlpha()
            .png()
            .toBuffer();

          const margin = 16;
          const left = Math.max(0, w - wmSize - margin);
          const top = Math.max(0, h - wmSize - margin);

          pipeline = pipeline.composite([
            {
              input: resizedLogo,
              left,
              top,
              blend: "over",
            },
          ]);
        }
      } catch {
        /* continua sem marca d'água */
      }
    }

    let webp: Uint8Array;
    try {
      webp = await pipeline.webp({ quality: 85 }).toBuffer();
    } catch {
      return json({ error: "Conexão instável. Tente novamente." }, 500);
    }

    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(objectPath, webp, {
        contentType: "image/webp",
        upsert: true,
      });
    if (upErr) {
      return json({ error: "Conexão instável. Tente novamente." }, 500);
    }
  }

  if (bucket === "media") {
    const { error: insErr } = await supabase.from("media").insert({
      section,
      url: objectPath,
      type: mediaType,
      is_primary: isPrimary,
      order: 0,
    });
    if (insErr) {
      return json({ error: "Conexão instável. Tente novamente." }, 500);
    }
  }

  return json({ success: true, path: objectPath });
});
