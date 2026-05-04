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
    return data.url ?? null;
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
function MidiasTab() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadSection, setUploadSection] = useState("hero");
  const [uploadPrimary, setUploadPrimary] = useState(false);

  useEffect(() => {
    fetch("/api/admin/media")
      .then(r => r.json()).then(setMedia).catch(() => toast("Conexão instável. Tente novamente.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file, uploadSection, uploadPrimary);
    const res = await fetch("/api/admin/media");
    setMedia(await res.json());
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    setMedia(m => m.filter(x => x.id !== id));
    toast("Removido com sucesso!", "success");
  };

  const sections = ["hero", "sobre", "galeria-espaco", "galeria-trabalho", "cursos"];

  return (
    <div>
      <h2 style={headingStyle}>Mídias</h2>

      {/* Upload form */}
      <div style={{ background: "#111", padding: 24, borderRadius: 8, marginBottom: 32, border: "1px solid #222" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
          <label style={labelStyle}>
            Seção
            <select value={uploadSection} onChange={e => setUploadSection(e.target.value)} style={inputStyle}>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          {uploadSection === "hero" && (
            <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={uploadPrimary} onChange={e => setUploadPrimary(e.target.checked)} />
              Vídeo principal (mobile)
            </label>
          )}
        </div>
        <button onClick={() => fileRef.current?.click()} style={btnPrimary}>
          Selecionar arquivo
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/mp4" hidden onChange={handleUpload} />
      </div>

      {/* Media grid */}
      {loading ? <p style={{ color: "#666" }}>Carregando...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {media.map(item => (
            <div key={item.id} style={{
              background: "#111", border: `1px solid ${item.is_primary ? "#C9A84C" : "#222"}`,
              borderRadius: 8, overflow: "hidden", position: "relative",
            }}>
              {item.is_primary && (
                <div style={{ background: "#C9A84C", color: "#1a1a1a", fontSize: 10, fontWeight: 700, padding: "2px 8px", fontFamily: "sans-serif" }}>
                  MOBILE
                </div>
              )}
              <div style={{ background: "#1a1a1a", height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#666", fontSize: 12, fontFamily: "sans-serif" }}>
                  {item.type === "video" ? "🎬" : "🖼️"} {item.section}
                </span>
              </div>
              <div style={{ padding: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#666", fontSize: 11, fontFamily: "sans-serif" }}>#{item.order}</span>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{ background: "none", border: "none", color: "#e55555", cursor: "pointer", fontSize: 12 }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
