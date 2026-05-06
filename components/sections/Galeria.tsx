"use client";

import { useMedia } from "@/hooks/useMedia";

import { revealVariants } from "@/lib/motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

type MediaItem = { id: string; signedUrl?: string; url: string };

const CrownFallback = () => (
  <div style={{ width: "100%", height: "100%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="32" height="22" viewBox="0 0 120 84" fill="#C9A84C" opacity={0.3}>
      <path d="M10 70 L10 54 L30 30 L60 54 L90 18 L110 54 L110 70 Z"/>
      <rect x="8" y="68" width="104" height="10" rx="2"/>
    </svg>
  </div>
);

// ─── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({ items, index, onClose, onNav }: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNav: (d: 1 | -1) => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      role="dialog" aria-modal="true" aria-label="Visualização ampliada"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <button onClick={onClose} aria-label="Fechar" style={{ position: "absolute", top: 24, right: 24, width: 40, height: 40, background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>✕</button>
      <button aria-label="Anterior" onClick={(e) => { e.stopPropagation(); onNav(-1); }} style={{ position: "absolute", left: 24, background: "none", border: "none", color: "#C9A84C", fontSize: 32, cursor: "pointer" }}>←</button>
      <img src={items[index]?.signedUrl} alt="Ampliado" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", maxWidth: "90vw", objectFit: "contain" }} />
      <button aria-label="Próxima" onClick={(e) => { e.stopPropagation(); onNav(1); }} style={{ position: "absolute", right: 24, background: "none", border: "none", color: "#C9A84C", fontSize: 32, cursor: "pointer" }}>→</button>
    </motion.div>
  );
}

// ─── Galeria Espaço ─────────────────────────────────────────────────────────
function GaleriaEspaco({ items, isMobile }: { items: MediaItem[]; isMobile: boolean }) {
  const t = useTranslations("galeria");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const display = items.length > 0 ? items : Array.from({ length: 6 }, (_, i) => ({ id: `ph-${i}`, signedUrl: "", url: "" }));

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth * (display.length / 0.85));
    setActiveDot(Math.min(idx, display.length - 1));
  };

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h2)", color: "var(--color-text)", marginBottom: 32 }}>
        {t("espaco_titulo")}
      </h3>

      {isMobile ? (
        /* Mobile carousel */
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              display: "flex",
              overflowX: "auto",
              gap: 12,
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {display.map((item, i) => (
              <div key={item.id} style={{ minWidth: "85%", flexShrink: 0, scrollSnapAlign: "start", aspectRatio: "4/3", overflow: "hidden", background: "#111", borderRadius: 4, position: "relative" }}>
                {item.signedUrl ? (
                  <Image
                    src={item.signedUrl}
                    alt={`Interior do Naiara Colin — foto ${i + 1}`}
                    fill
                    sizes="85vw"
                    style={{ objectFit: "cover" }}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIhAAAQMEAwEBAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AoOl2u6XC4uW+2suyXkuFtDaSpaiDnGBkntVqtVUCAoJAGBgCiig/9k="
                    unoptimized={item.signedUrl.includes("token=")}
                  />
                ) : <CrownFallback />}
              </div>
            ))}
          </div>
          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
            {display.map((_, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", opacity: i === activeDot ? 1 : 0.3, transition: "opacity 200ms" }} />
            ))}
          </div>
        </>
      ) : (
        /* Desktop grid 3 columns */
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {display.map((item, i) => (
              <div
                key={item.id}
                onClick={() => item.signedUrl && setLightboxIdx(i)}
                style={{ aspectRatio: "4/3", overflow: "hidden", cursor: item.signedUrl ? "pointer" : "default", background: "#111", borderRadius: 4, position: "relative" }}
              >
                {item.signedUrl ? (
                  <Image
                    src={item.signedUrl}
                    alt={`Interior do Naiara Colin — área ${i + 1}`}
                    fill
                    sizes="(max-width: 1280px) 33vw, 427px"
                    style={{ objectFit: "cover", transition: "transform 300ms ease" }}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIhAAAQMEAwEBAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AoOl2u6XC4uW+2suyXkuFtDaSpaiDnGBkntVqtVUCAoJAGBgCiig/9k="
                    unoptimized={item.signedUrl.includes("token=")}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                ) : <CrownFallback />}
              </div>
            ))}
          </div>
          {lightboxIdx !== null && display.some(m => m.signedUrl) && (
            <Lightbox
              items={display.filter(m => m.signedUrl)}
              index={lightboxIdx}
              onClose={() => setLightboxIdx(null)}
              onNav={(d) => setLightboxIdx(prev => prev === null ? 0 : (prev + d + display.length) % display.length)}
            />
          )}
        </>
      )}
    </div>
  );
}

// ─── Galeria Trabalho (before/after) ────────────────────────────────────────
function GaleriaTrabalho({ items, isMobile }: { items: MediaItem[]; isMobile: boolean }) {
  const t = useTranslations("galeria");
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function SliderCard({ before, after, isMobile: mobile }: {
    before: MediaItem;
    after: MediaItem;
    isMobile: boolean;
  }) {
    const [position, setPosition] = useState(50);
    const [showAfter, setShowAfter] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition(Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100)));
    }, []);

    const stopDrag = useCallback(() => { dragging.current = false; }, []);

    useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDrag);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", stopDrag);
      };
    }, [handleMouseMove, stopDrag]);

    const CARD_STYLE: import("react").CSSProperties = {
      position: "relative",
      aspectRatio: "3/4",
      overflow: "hidden",
      borderRadius: 4,
      border: "1px solid var(--color-border)",
      background: "#111",
    };

    if (mobile) {
      return (
        <div
          onClick={() => setShowAfter(!showAfter)}
          style={{ ...CARD_STYLE, cursor: "pointer", flexShrink: 0, minWidth: "85%", scrollSnapAlign: "start" }}
        >
          {(showAfter ? after : before).signedUrl
            ? <img src={(showAfter ? after : before).signedUrl} alt={showAfter ? "Depois" : "Antes"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <CrownFallback />
          }
          <div style={{
            position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)", color: "#C9A84C",
            padding: "6px 14px", fontSize: 12, fontFamily: "var(--font-sans)", borderRadius: 2, whiteSpace: "nowrap",
          }}>
            {showAfter ? "← Ver antes" : "Ver depois →"}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        onMouseDown={() => { dragging.current = true; }}
        style={{ ...CARD_STYLE, cursor: "col-resize", userSelect: "none" }}
      >
        {/* Before */}
        <div style={{ position: "absolute", inset: 0 }}>
          {before.signedUrl
            ? <img src={before.signedUrl} alt="Antes" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <CrownFallback />
          }
        </div>
        {/* After clipped */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <div style={{ position: "absolute", inset: 0 }}>
            {after.signedUrl
              ? <img src={after.signedUrl} alt="Depois" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <CrownFallback />
            }
          </div>
        </div>
        {/* Divider */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: `${position}%`,
          width: 2, background: "#C9A84C", transform: "translateX(-50%)", pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 36, height: 36, borderRadius: "50%",
            background: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#1a1a1a", fontSize: 14, fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}>↔</div>
        </div>
      </div>
    );
  }

  const pairs: [MediaItem, MediaItem][] = [];
  for (let i = 0; i + 1 < items.length; i += 2) pairs.push([items[i], items[i + 1]]);

  const displayPairs: [MediaItem, MediaItem][] = pairs.length > 0 ? pairs : [
    [{ id: "ba1", signedUrl: "", url: "" }, { id: "ba2", signedUrl: "", url: "" }],
    [{ id: "ba3", signedUrl: "", url: "" }, { id: "ba4", signedUrl: "", url: "" }],
    [{ id: "ba5", signedUrl: "", url: "" }, { id: "ba6", signedUrl: "", url: "" }],
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / (scrollRef.current.offsetWidth * 0.85));
    setActiveDot(Math.min(idx, displayPairs.length - 1));
  };

  return (
    <div>
      <h3 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "var(--text-h2)",
        color: "var(--color-text)",
        marginBottom: 32,
      }}>
        {t("trabalho_titulo")}
      </h3>

      {isMobile ? (
        /* Mobile: snap carousel */
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              display: "flex",
              overflowX: "auto",
              gap: 12,
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {displayPairs.map(([before, after]) => (
              <SliderCard key={before.id} before={before} after={after} isMobile={true} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
            {displayPairs.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#C9A84C",
                  opacity: i === activeDot ? 1 : 0.3,
                  transition: "opacity 200ms",
                }}
              />
            ))}
          </div>
        </>
      ) : (
        /* Desktop: grid de cards */
        <div style={{
          display: "grid",
          gridTemplateColumns: displayPairs.length === 1
            ? "1fr"
            : displayPairs.length === 2
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
          gap: 16,
          maxWidth: displayPairs.length === 1 ? 480 : "100%",
          margin: displayPairs.length === 1 ? "0 auto" : undefined,
        }}>
          {displayPairs.map(([before, after]) => (
            <SliderCard key={before.id} before={before} after={after} isMobile={false} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function Galeria() {
  const { items: espaco   } = useMedia("galeria-espaco");
  const { items: trabalho } = useMedia("galeria-trabalho");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="galeria"
      className="texture-dark"
      style={{
        background: "var(--color-bg)",
        paddingTop: "var(--section-gap)",
        paddingBottom: "var(--section-gap)",
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
      }}
    >
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>
        <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GaleriaEspaco items={espaco} isMobile={isMobile} />
        </motion.div>
        <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GaleriaTrabalho items={trabalho} isMobile={isMobile} />
        </motion.div>
      </div>
    </section>
  );
}
