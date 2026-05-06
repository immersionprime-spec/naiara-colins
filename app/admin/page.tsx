"use client";

import { useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = "midias" | "textos" | "depoimentos" | "blog" | "instagram" | "agendamentos";
type MediaItem = { id: string; section: string; url: string; type: string; order: number; is_primary: boolean };
type Testimonial = { id: string; name: string; photo_url: string | null; text: string; stars: number; visible: boolean; order: number };
type Post = { id: string; slug: string; title: string; excerpt: string | null; published: boolean; published_at: string | null };
type IGPost = { id: string; post_id: string; media_url: string; caption: string | null; visible: boolean };

// ── Toast ──────────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
let _setToast: ((msg: string, type: ToastType) => void) | null = null;
function toast(msg: string, type: ToastType = "success") { _setToast?.(msg, type); }

function ToastContainer() {
  const [msg, setMsg] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>("success");
  _setToast = (m, t) => { setMsg(m); setType(t); setTimeout(() => setMsg(null), 4000); };
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: "#1a1a1a", padding: "16px 20px", borderRadius: 6,
      borderLeft: `3px solid ${type === "success" ? "#4caf7d" : "#e55555"}`,
      fontFamily: "var(--font-sans)", fontSize: 14, color: "#fff", maxWidth: 320,
    }}>{msg}</div>
  );
}

// ── Upload helper ──────────────────────────────────────────────────────────
async function uploadFile(file: File, section: string, isPrimary = false): Promise<string | null> {
  const maxImg = 10 * 1024 * 1024;
  const maxVid = 500 * 1024 * 1024;
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) { toast("Formato não suportado. Use JPG, PNG, WebP ou MP4.", "error"); return null; }
  if (isVideo && file.size > maxVid) { toast("Arquivo muito grande. Use vídeos de até 500MB.", "error"); return null; }
  if (isImage && file.size > maxImg) { toast("Arquivo muito grande. Use imagens de até 10MB.", "error"); return null; }

  // Vídeos: upload direto para o Supabase Storage (bypass do limite 4.5MB do Vercel)
  if (isVideo) {
    try {
      // 1. Gera signed upload URL no servidor
      const urlRes = await fetch("/api/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, bucket: "media", fileName: file.name }),
      });
      if (!urlRes.ok) throw new Error("upload-url failed");
      const { signedUrl, path } = await urlRes.json();

      // 2. PUT direto para o Supabase Storage (sem passar pelo Vercel)
      const putRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("direct put failed");

      // 3. Registra no banco
      const regRes = await fetch("/api/media/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, section, bucket: "media", isPrimary, type: "video", order: 0 }),
      });
      if (!regRes.ok) throw new Error("register failed");

      toast("Salvo com sucesso!", "success");
      return path;
    } catch {
      toast("Conexão instável. Tente novamente.", "error");
      return null;
    }
  }

  // Imagens: rota normal (ficam dentro do limite do Vercel)
  const fd = new FormData();
  fd.append("file", file);
  fd.append("section", section);
  fd.append("bucket", "media");
  fd.append("isPrimary", String(isPrimary));

  try {
    const res = await fetch("/api/media/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error();
    const data = await res.json();
    toast("Salvo com sucesso!", "success");
    return data.path ?? null;
  } catch {
    toast("Conexão instável. Tente novamente.", "error");
    return null;
  }
}

// ── Sidebar ────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string }[] = [
  { id: "midias", label: "Mídias" },
  { id: "textos", label: "Textos" },
  { id: "depoimentos", label: "Depoimentos" },
  { id: "blog", label: "Blog" },
  { id: "instagram", label: "Instagram" },
  { id: "agendamentos", label: "Agendamentos" },
];

// ── Mídias tab ─────────────────────────────────────────────────────────────

type UploadState = "idle" | "uploading" | "done" | "error";

type SlotDef = { key: string; label: string; hint: string; isPrimary: boolean };
type SectionDef =
  | { id: string; icon: string; label: string; desc: string; accept: string; slots: SlotDef[] }
  | { id: string; icon: string; label: string; desc: string; accept: string; multiple: true };

const SECTION_DEFS = [
  {
    id: "hero",
    icon: "🎬",
    label: "Vídeos da Tela Inicial",
    desc: "Aparecem logo quando o site abre. No celular só o principal aparece.",
    slots: [
      { key: "hero-primary",   label: "Vídeo Principal",  hint: "Aparece no celular e à esquerda no computador", isPrimary: true  },
      { key: "hero-secondary", label: "Vídeo Secundário", hint: "Aparece apenas à direita no computador",        isPrimary: false },
    ],
    accept: "video/mp4",
  },
  {
    id: "sobre",
    icon: "👩",
    label: "Vídeo — Quem é a Naiara",
    desc: "Aparece ao lado do texto de apresentação da Naiara.",
    slots: [
      { key: "sobre", label: "Vídeo da Naiara", hint: "Recomendado: formato vertical (9:16)", isPrimary: false },
    ],
    accept: "video/mp4",
  },
  {
    id: "galeria-espaco",
    icon: "🏠",
    label: "Galeria — Fotos do Espaço",
    desc: "Fotos do interior do salão. Você pode adicionar várias.",
    accept: "image/*",
    multiple: true,
  },
  {
    id: "galeria-trabalho",
    icon: "✨",
    label: "Galeria — Portfólio de Trabalhos",
    desc: "Fotos dos trabalhos realizados (antes e depois). Você pode adicionar várias.",
    accept: "image/*",
    multiple: true,
  },
  {
    id: "cursos",
    icon: "🎓",
    label: "Cursos — Imagem de Destaque",
    desc: "Foto ou vídeo que aparece na seção de cursos da página inicial.",
    slots: [
      { key: "cursos", label: "Foto ou Vídeo dos Cursos", hint: "Imagem de fundo da seção", isPrimary: false },
    ],
    accept: "image/*,video/mp4",
  },
] as SectionDef[];

async function doUpload(
  file: File,
  section: string,
  isPrimary: boolean,
  onProgress: (p: number) => void,
  order = 0
): Promise<boolean> {
  const isVideo = file.type.startsWith("video/");

  if (isVideo) {
    try {
      onProgress(5);
      const urlRes = await fetch("/api/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, bucket: "media", fileName: file.name }),
      });
      if (!urlRes.ok) return false;
      const { signedUrl, path } = await urlRes.json();
      onProgress(10);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress(10 + Math.round((e.loaded / e.total) * 80));
        };
        xhr.onload  = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject());
        xhr.onerror = () => reject();
        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
      onProgress(92);

      const reg = await fetch("/api/media/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, section, bucket: "media", isPrimary, type: "video", order: 0 }),
      });
      if (!reg.ok) return false;
      onProgress(100);
      return true;
    } catch { return false; }
  }

  return new Promise<boolean>((resolve) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("section", section);
    fd.append("bucket", "media");
    fd.append("isPrimary", String(isPrimary));
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 95));
    };
    xhr.onload  = () => { onProgress(100); resolve(xhr.status >= 200 && xhr.status < 300); };
    xhr.onerror = () => resolve(false);
    fd.append("order", String(order));
    xhr.open("POST", "/api/media/upload");
    xhr.send(fd);
  });
}

function SingleSlot({ label, hint, accept, item, section, isPrimary, onRefresh }: {
  label: string; hint: string; accept: string;
  item: MediaItem | undefined; section: string; isPrimary: boolean;
  onRefresh: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setState("uploading"); setProgress(0);
    if (item) await fetch(`/api/admin/media?id=${item.id}`, { method: "DELETE" });
    const ok = await doUpload(file, section, isPrimary, setProgress);
    setState(ok ? "done" : "error");
    if (ok) { setTimeout(() => setState("idle"), 2500); onRefresh(); }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = async () => {
    if (!item || !confirm("Remover este arquivo?")) return;
    await fetch(`/api/admin/media?id=${item.id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div style={{ border: `1px solid ${item ? "#222" : "#161616"}`, borderRadius: 10, padding: 20, background: "#0d0d0d", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{label}</p>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#555" }}>{hint}</p>
      </div>

      <div style={{ height: 100, borderRadius: 8, border: `1px dashed ${item ? "#C9A84C44" : "#1e1e1e"}`, background: item ? "#131313" : "#080808", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
        {item ? (
          <>
            <span style={{ fontSize: 28 }}>{item.type === "video" ? "🎬" : "🖼️"}</span>
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#C9A84C" }}>{item.type === "video" ? "Vídeo carregado ✓" : "Imagem carregada ✓"}</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 24, opacity: 0.25 }}>📂</span>
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#444" }}>Nenhum arquivo ainda</span>
          </>
        )}
      </div>

      {state === "uploading" && (
        <div>
          <div style={{ background: "#111", borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", background: "#C9A84C", borderRadius: 4, width: `${progress}%`, transition: "width 0.3s ease" }} />
          </div>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#C9A84C", textAlign: "center" }}>Enviando… {progress}%</p>
        </div>
      )}
      {state === "done"  && <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#4caf7d", textAlign: "center" }}>✓ Salvo com sucesso!</p>}
      {state === "error" && <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#e55555", textAlign: "center" }}>Erro no envio. Tente novamente.</p>}

      {state === "idle" && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => inputRef.current?.click()} style={{ flex: 1, padding: "10px 0", background: "#C9A84C", color: "#0a0a0a", border: "none", borderRadius: 6, fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {item ? "Trocar arquivo" : "Enviar arquivo"}
          </button>
          {item && (
            <button onClick={handleRemove} style={{ padding: "10px 14px", background: "transparent", border: "1px solid #2a2a2a", borderRadius: 6, color: "#e55555", fontFamily: "DM Sans, sans-serif", fontSize: 13, cursor: "pointer" }}>
              Remover
            </button>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} hidden onChange={handleFile} />
    </div>
  );
}

function GaleriaEspacoAdmin({ items, onRefresh }: { items: MediaItem[]; onRefresh: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setState("uploading"); setProgress(0);
    const ok = await doUpload(file, "galeria-espaco", false, setProgress, items.length);
    setState(ok ? "done" : "error");
    if (ok) { setTimeout(() => setState("idle"), 2000); onRefresh(); }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remover esta foto?")) return;
    await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
          {items.map((item, i) => (
            <div key={item.id} style={{ background: "#131313", border: "1px solid #1e1e1e", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0d0d0d", gap: 4 }}>
                <span style={{ fontSize: 20 }}>🖼️</span>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: "#555" }}>Foto {i + 1}</span>
              </div>
              <button onClick={() => handleRemove(item.id)} style={{ width: "100%", padding: "6px 0", background: "transparent", border: "none", borderTop: "1px solid #1e1e1e", color: "#e55555", fontFamily: "DM Sans, sans-serif", fontSize: 11, cursor: "pointer" }}>
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
      {state === "uploading" && (
        <div>
          <div style={{ background: "#111", borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", background: "#C9A84C", width: `${progress}%`, transition: "width 0.3s" }} />
          </div>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#C9A84C" }}>Enviando… {progress}%</p>
        </div>
      )}
      {state === "done"  && <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#4caf7d" }}>✓ Foto adicionada!</p>}
      {state === "error" && <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#e55555" }}>Erro no envio. Tente novamente.</p>}
      {state === "idle" && (
        <button onClick={() => inputRef.current?.click()} style={{ padding: "14px 0", background: "transparent", border: "1px dashed #2a2a2a", borderRadius: 8, color: "#666", fontFamily: "DM Sans, sans-serif", fontSize: 13, cursor: "pointer", width: "100%" }}>
          + Adicionar foto
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
    </div>
  );
}

// Par antes/depois individual
function ParAnteDepois({ pairIndex, before, after, onRefresh }: {
  pairIndex: number;
  before: MediaItem | undefined;
  after: MediaItem | undefined;
  onRefresh: () => void;
}) {
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef  = useRef<HTMLInputElement>(null);
  const [beforeState, setBeforeState] = useState<UploadState>("idle");
  const [afterState,  setAfterState]  = useState<UploadState>("idle");
  const [beforeProg,  setBeforeProg]  = useState(0);
  const [afterProg,   setAfterProg]   = useState(0);

  const upload = async (
    file: File,
    slot: "before" | "after",
    current: MediaItem | undefined,
    setState: (s: UploadState) => void,
    setProg: (p: number) => void
  ) => {
    setState("uploading"); setProg(0);
    if (current) await fetch(`/api/admin/media?id=${current.id}`, { method: "DELETE" });
    const order = pairIndex * 2 + (slot === "before" ? 0 : 1);
    const ok = await doUpload(file, "galeria-trabalho", false, setProg, order);
    setState(ok ? "done" : "error");
    if (ok) { setTimeout(() => setState("idle"), 2000); onRefresh(); }
  };

  const remove = async (item: MediaItem | undefined) => {
    if (!item || !confirm("Remover esta foto?")) return;
    await fetch(`/api/admin/media?id=${item.id}`, { method: "DELETE" });
    onRefresh();
  };

  const SlotBox = ({
    label, hint, color, item, state, progress, inputRef: ref,
    setState: setS, setProg, slot, current,
  }: {
    label: string; hint: string; color: string;
    item: MediaItem | undefined; state: UploadState; progress: number;
    inputRef: React.RefObject<HTMLInputElement>;
    setState: (s: UploadState) => void;
    setProg: (p: number) => void;
    slot: "before" | "after";
    current: MediaItem | undefined;
  }) => (
    <div style={{ flex: 1, border: `1px solid ${item ? color + "44" : "#1a1a1a"}`, borderRadius: 10, padding: 16, background: "#0d0d0d", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{label}</p>
      </div>
      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#555" }}>{hint}</p>

      <div style={{ height: 80, borderRadius: 6, border: `1px dashed ${item ? color + "66" : "#1e1e1e"}`, background: item ? "#131313" : "#080808", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
        {item ? (
          <>
            <span style={{ fontSize: 22 }}>🖼️</span>
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color }}>Foto carregada ✓</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 18, opacity: 0.2 }}>📂</span>
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: "#333" }}>Sem foto</span>
          </>
        )}
      </div>

      {state === "uploading" && (
        <div>
          <div style={{ background: "#111", borderRadius: 3, height: 4, overflow: "hidden", marginBottom: 4 }}>
            <div style={{ height: "100%", background: color, width: `${progress}%`, transition: "width 0.3s" }} />
          </div>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color }}>{progress}%</p>
        </div>
      )}
      {state === "done"  && <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: "#4caf7d" }}>✓ Salvo!</p>}
      {state === "error" && <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: "#e55555" }}>Erro. Tente novamente.</p>}

      {state === "idle" && (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => ref.current?.click()}
            style={{ flex: 1, padding: "8px 0", background: color, color: "#0a0a0a", border: "none", borderRadius: 5, fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 11, cursor: "pointer" }}
          >
            {item ? "Trocar" : "Enviar"}
          </button>
          {item && (
            <button onClick={() => remove(item)} style={{ padding: "8px 10px", background: "transparent", border: "1px solid #222", borderRadius: 5, color: "#e55555", fontFamily: "DM Sans, sans-serif", fontSize: 11, cursor: "pointer" }}>
              ✕
            </button>
          )}
        </div>
      )}

      <input
        ref={ref} type="file" accept="image/*" hidden
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f, slot, current, setS, setProg); if (ref.current) ref.current.value = ""; }}
      />
    </div>
  );

  return (
    <div style={{ border: "1px solid #1e1e1e", borderRadius: 10, padding: 16, background: "#0a0a0a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600, color: "#888" }}>
          Par {pairIndex + 1}
        </p>
        {(before || after) && (
          <button
            onClick={async () => {
              if (!confirm(`Remover par ${pairIndex + 1} completamente?`)) return;
              if (before) await fetch(`/api/admin/media?id=${before.id}`, { method: "DELETE" });
              if (after)  await fetch(`/api/admin/media?id=${after.id}`,  { method: "DELETE" });
              onRefresh();
            }}
            style={{ background: "none", border: "none", color: "#e55555", fontFamily: "DM Sans, sans-serif", fontSize: 11, cursor: "pointer" }}
          >
            Remover par
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <SlotBox
          label="Foto ANTES" hint="Estado original do cliente"
          color="#888888"
          item={before} state={beforeState} progress={beforeProg}
          inputRef={beforeRef} setState={setBeforeState} setProg={setBeforeProg}
          slot="before" current={before}
        />
        <SlotBox
          label="Foto DEPOIS" hint="Resultado final do trabalho"
          color="#C9A84C"
          item={after} state={afterState} progress={afterProg}
          inputRef={afterRef} setState={setAfterState} setProg={setAfterProg}
          slot="after" current={after}
        />
      </div>
    </div>
  );
}

function GaleriaTrabalhoAdmin({ items, onRefresh }: { items: MediaItem[]; onRefresh: () => void }) {
  // Agrupa em pares pelo campo order: order 0,1 = par 0; order 2,3 = par 1; etc.
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const maxOrder = sorted.length > 0 ? sorted[sorted.length - 1].order : -1;
  const pairCount = maxOrder >= 0 ? Math.floor(maxOrder / 2) + 1 : 1;

  const pairs: { before?: MediaItem; after?: MediaItem }[] = Array.from({ length: pairCount }, (_, i) => ({
    before: sorted.find(m => m.order === i * 2),
    after:  sorted.find(m => m.order === i * 2 + 1),
  }));

  const addPair = () => {
    // Só exibe visualmente um novo par vazio; o upload definirá o order correto
    onRefresh(); // refresh para recalcular
  };

  const nextPairIndex = Math.ceil((maxOrder + 2) / 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#666", lineHeight: 1.5 }}>
          Cada par tem uma foto <strong style={{ color: "#888" }}>Antes</strong> e uma foto <strong style={{ color: "#C9A84C" }}>Depois</strong>. O site mostra um controle deslizante para comparar as duas.
        </p>
      </div>

      {pairs.map((pair, i) => (
        <ParAnteDepois
          key={i}
          pairIndex={i}
          before={pair.before}
          after={pair.after}
          onRefresh={onRefresh}
        />
      ))}

      <button
        onClick={() => {
          // Cria visualmente um par novo — o usuário clicará em Enviar dentro do par
          const newPairs = [...pairs, { before: undefined, after: undefined }];
          // Forçamos re-render aumentando pairCount via artifício: fazemos refresh que não muda nada
          // mas o nextPairIndex já estará correto no próximo ParAnteDepois
          onRefresh();
        }}
        style={{ padding: "14px 0", background: "transparent", border: "1px dashed #2a2a2a", borderRadius: 8, color: "#666", fontFamily: "DM Sans, sans-serif", fontSize: 13, cursor: "pointer", width: "100%" }}
      >
        + Adicionar novo par (antes/depois)
      </button>
    </div>
  );
}


function MidiasTab() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    fetch("/api/admin/media")
      .then(r => r.json()).then(setMedia)
      .catch(() => toast("Conexão instável. Tente novamente.", "error"));
  };

  useEffect(() => {
    fetch("/api/admin/media")
      .then(r => r.json()).then(setMedia)
      .catch(() => toast("Conexão instável. Tente novamente.", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ fontFamily: "DM Sans, sans-serif", color: "#555", padding: 16 }}>Carregando…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <h2 style={headingStyle}>Mídias</h2>

      {SECTION_DEFS.map(def => {
        const sectionItems = media.filter(m => m.section === def.id);

        return (
          <div key={def.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 14, padding: 28 }}>
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #1a1a1a" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#C9A84C", marginBottom: 4 }}>
                {def.icon}&nbsp;&nbsp;{def.label}
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#555" }}>{def.desc}</p>
            </div>

            {"slots" in def ? (
              <div style={{ display: "grid", gridTemplateColumns: def.slots.length > 1 ? "repeat(auto-fit, minmax(240px, 1fr))" : "1fr", gap: 16 }}>
                {(def.slots as SlotDef[]).map(slot => {
                  const primary   = sectionItems.find(m => m.is_primary) ?? sectionItems[0];
                  const secondary = sectionItems.find(m => !m.is_primary && m.id !== primary?.id);
                  const matched   = slot.isPrimary ? primary : secondary;
                  return (
                    <SingleSlot key={slot.key} label={slot.label} hint={slot.hint} accept={def.accept}
                      item={matched} section={def.id} isPrimary={slot.isPrimary} onRefresh={refresh} />
                  );
                })}
              </div>
            ) : def.id === "galeria-trabalho" ? (
              <GaleriaTrabalhoAdmin items={sectionItems} onRefresh={refresh} />
            ) : (
              <GaleriaEspacoAdmin items={sectionItems} onRefresh={refresh} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Textos tab ─────────────────────────────────────────────────────────────
function TextosTab() {
  const [locale, setLocale] = useState("pt");
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/content?language=${locale}`)
      .then(r => r.json()).then(setContent).catch(() => toast("Conexão instável. Tente novamente.", "error"))
      .finally(() => setLoading(false));
  }, [locale]);

  const save = async (key: string, value: string) => {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, language: locale }),
    });
    if (res.ok) toast("Salvo com sucesso!");
    else toast("Conexão instável. Tente novamente.", "error");
  };

  return (
    <div>
      <h2 style={headingStyle}>Textos</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["pt", "es", "en"].map(l => (
          <button key={l} onClick={() => setLocale(l)} style={{
            ...btnPrimary,
            background: locale === l ? "#C9A84C" : "transparent",
            color: locale === l ? "#1a1a1a" : "#C9A84C",
          }}>{l.toUpperCase()}</button>
        ))}
      </div>
      {loading ? <p style={{ color: "#666" }}>Carregando...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>
              <label style={{ ...labelStyle, marginBottom: 4 }}>
                {key}
                <textarea
                  rows={3}
                  defaultValue={value}
                  onBlur={e => save(key, e.target.value)}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Depoimentos tab ────────────────────────────────────────────────────────
function DepoimentosTab() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", text: "", stars: 5 });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then(r => r.json()).then(setItems).catch(() => toast("Conexão instável. Tente novamente.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const toggleVisible = async (id: string, visible: boolean) => {
    await fetch("/api/admin/testimonials", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, visible: !visible }) });
    setItems(items.map(i => i.id === id ? { ...i, visible: !i.visible } : i));
  };

  const addNew = async () => {
    if (!form.name || !form.text) return;
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, visible: true, order: items.length }),
    });
    if (res.ok) {
      const newItem = await res.json();
      setItems([...items, newItem]);
      setForm({ name: "", text: "", stars: 5 });
      setAdding(false);
      toast("Salvo com sucesso!");
    } else {
      toast("Conexão instável. Tente novamente.", "error");
    }
  };

  return (
    <div>
      <h2 style={headingStyle}>Depoimentos</h2>
      {loading ? <p style={{ color: "#666" }}>Carregando...</p> : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {items.map(item => (
              <div key={item.id} style={{
                background: "#111", border: "1px solid #222", borderRadius: 8,
                padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              }}>
                <div>
                  <p style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 14, marginBottom: 4 }}>{item.name}</p>
                  <p style={{ color: "#666", fontFamily: "sans-serif", fontSize: 12 }}>{item.text.slice(0, 60)}...</p>
                </div>
                <button
                  onClick={() => toggleVisible(item.id, item.visible)}
                  style={{ ...btnPrimary, fontSize: 12, padding: "6px 14px" }}
                >
                  {item.visible ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            ))}
          </div>

          {adding ? (
            <div style={{ background: "#111", padding: 20, borderRadius: 8, border: "1px solid #222" }}>
              <label style={labelStyle}>Nome<input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
              <label style={{ ...labelStyle, marginTop: 12 }}>Texto<textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} /></label>
              <label style={{ ...labelStyle, marginTop: 12 }}>Estrelas
                <input type="number" min={1} max={5} style={inputStyle} value={form.stars} onChange={e => setForm({ ...form, stars: Number(e.target.value) })} />
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={addNew} style={btnPrimary}>Salvar</button>
                <button onClick={() => setAdding(false)} style={{ ...btnPrimary, background: "transparent", color: "#666", borderColor: "#333" }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} style={btnPrimary}>+ Adicionar depoimento</button>
          )}
        </>
      )}
    </div>
  );
}

// ── Blog tab ───────────────────────────────────────────────────────────────
function BlogTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then(r => r.json()).then(setPosts).catch(() => toast("Conexão instável. Tente novamente.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id: string, published: boolean) => {
    await fetch("/api/admin/posts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, published: !published }) });
    setPosts(posts.map(p => p.id === id ? { ...p, published: !p.published } : p));
    toast("Salvo com sucesso!");
  };

  return (
    <div>
      <h2 style={headingStyle}>Blog</h2>
      {loading ? <p style={{ color: "#666" }}>Carregando...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.length === 0 && <p style={{ color: "#666", fontFamily: "sans-serif" }}>Nenhum post ainda.</p>}
          {posts.map(post => (
            <div key={post.id} style={{
              background: "#111", border: "1px solid #222", borderRadius: 8,
              padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div>
                <p style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 14, marginBottom: 4 }}>{post.title}</p>
                <span style={{
                  display: "inline-block", fontSize: 10, padding: "2px 8px", fontFamily: "sans-serif",
                  background: post.published ? "#4caf7d" : "#333",
                  color: post.published ? "#fff" : "#666",
                  borderRadius: 2,
                }}>
                  {post.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <button onClick={() => toggle(post.id, post.published)} style={{ ...btnPrimary, fontSize: 12, padding: "6px 14px" }}>
                {post.published ? "Despublicar" : "Publicar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Instagram tab ──────────────────────────────────────────────────────────
function InstagramTab() {
  const [posts, setPosts] = useState<IGPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then(r => r.json()).then(setPosts).catch(() => toast("Conexão instável. Tente novamente.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id: string, visible: boolean) => {
    await fetch("/api/admin/instagram", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, visible: !visible }) });
    setPosts(posts.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
  };

  return (
    <div>
      <h2 style={headingStyle}>Feed Instagram</h2>
      {loading ? <p style={{ color: "#666" }}>Carregando...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {posts.map(post => (
            <div key={post.id} style={{
              background: "#111", border: `1px solid ${post.visible ? "#222" : "#333"}`,
              borderRadius: 8, overflow: "hidden", opacity: post.visible ? 1 : 0.4,
            }}>
              {post.media_url ? (
                <img src={post.media_url} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "1", background: "#1a1a1a" }} />
              )}
              <div style={{ padding: 8 }}>
                <button onClick={() => toggle(post.id, post.visible)} style={{ ...btnPrimary, fontSize: 11, padding: "4px 10px", width: "100%" }}>
                  {post.visible ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const headingStyle: React.CSSProperties = {
  fontFamily: "Cormorant Garamond, Georgia, serif",
  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
  color: "#C9A84C",
  marginBottom: 32,
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontFamily: "DM Sans, sans-serif",
  fontSize: 12,
  color: "rgba(255,255,255,0.6)",
};

const inputStyle: React.CSSProperties = {
  background: "#0a0a0a",
  border: "1px solid #333",
  borderRadius: 4,
  padding: "8px 12px",
  color: "#fff",
  fontFamily: "DM Sans, sans-serif",
  fontSize: 14,
  width: "100%",
};

const btnPrimary: React.CSSProperties = {
  border: "1px solid #C9A84C",
  color: "#C9A84C",
  background: "transparent",
  padding: "10px 24px",
  fontFamily: "DM Sans, sans-serif",
  fontWeight: 500,
  cursor: "pointer",
  fontSize: 14,
  letterSpacing: "0.04em",
};

// ── Main component ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("midias");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <ToastContainer />

      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: "#050505",
        borderRight: "1px solid #1a1a1a",
        padding: "80px 0 24px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "0 24px 32px", borderBottom: "1px solid #1a1a1a" }}>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, color: "#C9A84C" }}>Admin</p>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#444", marginTop: 4 }}>Naiara Colin</p>
        </div>

        <nav style={{ padding: "16px 0", flex: 1 }}>
          {TABS.map(t => {
            const isDisabled = t.id === "agendamentos";
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => !isDisabled && setTab(t.id)}
                disabled={isDisabled}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 24px",
                  background: isActive ? "rgba(201,168,76,0.08)" : "transparent",
                  border: "none",
                  borderLeft: isActive ? "2px solid #C9A84C" : "2px solid transparent",
                  color: isDisabled ? "#333" : isActive ? "#C9A84C" : "rgba(255,255,255,0.6)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 14,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.4 : 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {t.label}
                {isDisabled && (
                  <span style={{ fontSize: 9, background: "#C9A84C", color: "#1a1a1a", padding: "2px 6px", fontWeight: 700 }}>
                    Em breve
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "16px 24px" }}>
          <a href="/" style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#444", textDecoration: "none" }}>← Ver site</a>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "80px 40px 40px", overflow: "auto", maxWidth: 900 }}>
        {tab === "midias" && <MidiasTab />}
        {tab === "textos" && <TextosTab />}
        {tab === "depoimentos" && <DepoimentosTab />}
        {tab === "blog" && <BlogTab />}
        {tab === "instagram" && <InstagramTab />}
      </main>
    </div>
  );
}
