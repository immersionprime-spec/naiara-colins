import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";

const MAX_IMAGE = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO = 500 * 1024 * 1024;  // 500 MB

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
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "Conexão instável. Tente novamente." }, 500);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: "Conexão instável. Tente novamente." }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return json({ error: "Ficheiro em falta." }, 400);
  }

  const section   = String(form.get("section")   ?? "misc");
  const bucket    = String(form.get("bucket")    ?? "media");
  const isPrimary = String(form.get("isPrimary") ?? "false") === "true";

  if (bucket !== "media" && bucket !== "blog-covers") {
    return json({ error: "Bucket inválido." }, 400);
  }

  const type    = file.type.toLowerCase();
  const isImage = type.startsWith("image/");
  const isVideo = type === "video/mp4";

  if (!isImage && !isVideo) {
    return json({ error: "Formato não suportado. Use JPG, PNG, WebP ou MP4." }, 415);
  }

  const max = isImage ? MAX_IMAGE : MAX_VIDEO;
  if (file.size > max) {
    return json({ error: "Arquivo muito grande." }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const buf = new Uint8Array(await file.arrayBuffer());
  const ext = isVideo ? "mp4" : (type === "image/webp" ? "webp" : type === "image/png" ? "png" : "jpg");
  const objectPath = `${section}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const mediaType: "image" | "video" = isVideo ? "video" : "image";

  const { error: upErr } = await supabase.storage
    .from(bucket)
    .upload(objectPath, buf, {
      contentType: file.type,
      upsert: true,
    });

  if (upErr) {
    console.error("Storage upload error:", upErr.message);
    return json({ error: "Conexão instável. Tente novamente." }, 500);
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
      console.error("DB insert error:", insErr.message);
      return json({ error: "Conexão instável. Tente novamente." }, 500);
    }
  }

  return json({ success: true, path: objectPath });
});
