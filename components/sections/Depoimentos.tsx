"use client";

import { revealVariants } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import SectionTitle from "../ui/SectionTitle";

type Testimonial = {
  id: string;
  name: string;
  photo_url: string | null;
  text: string;
  stars: number;
};

const INTERVAL = 6000;

export default function Depoimentos({ data }: { data: Testimonial[] }) {
  const t = useTranslations("depoimentos");
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);

  const items: Testimonial[] = data.length > 0 ? data : [
    { id: "m1", name: "Cliente fiel", photo_url: null, text: "Ambiente incrível, atendimento impecável. Saí me sentindo outra pessoa!", stars: 5 },
    { id: "m2", name: "Ana Luísa", photo_url: null, text: "A Nay é um amor, profissional demais. Meu cabelo nunca ficou tão bonito.", stars: 5 },
    { id: "m3", name: "Fernanda M.", photo_url: null, text: "Espaço lindo, sofisticado. Vale cada centavo. Super recomendo!", stars: 5 },
  ];

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setProgress(0);
    startRef.current = Date.now();
  }, []);

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (paused) { cancelAnimationFrame(rafRef.current); return; }

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (elapsed >= INTERVAL) {
        next();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current, paused, items.length, next]);

  const item = items[current];

  return (
    <section
      id="depoimentos"
      className="texture-dark"
      style={{
        background: "var(--color-bg)",
        paddingTop: "var(--section-gap-testimonials)",
        paddingBottom: "var(--section-gap-testimonials)",
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
      }}
    >
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <SectionTitle title={t("titulo")} subtitle={t("subtitulo")} />

        <div
          style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Card */}
          <div
            aria-live="polite"
            style={{ width: "100%", maxWidth: 720, minHeight: 220, position: "relative" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--card-radius)",
                  padding: 56,
                  position: "relative",
                }}
              >
                {/* Big quote */}
                <span style={{
                  position: "absolute",
                  top: 8,
                  left: 16,
                  fontSize: 80,
                  lineHeight: 1,
                  color: "#C9A84C",
                  opacity: 0.3,
                  fontFamily: "var(--font-serif)",
                  pointerEvents: "none",
                }}>{'"'}</span>

                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-relaxed)",
                  color: "var(--color-text-muted)",
                  fontStyle: "italic",
                  marginTop: 32,
                }}>
                  {item.text}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
                  {/* Avatar */}
                  {item.photo_url ? (
                    <img
                      src={item.photo_url}
                      alt={item.name}
                      style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #C9A84C", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      border: "2px solid #C9A84C",
                      background: "var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-serif)",
                      fontSize: 20,
                      color: "#C9A84C",
                    }}>
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "var(--text-h3)",
                    color: "var(--color-text)",
                  }}>
                    {item.name}
                  </span>
                </div>

                {/* Stars */}
                {item.stars > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={i < item.stars ? "#C9A84C" : "none"}
                        stroke="#C9A84C"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div style={{ width: "100%", maxWidth: 480, height: 2, background: "var(--color-border)", marginTop: 20, overflow: "hidden", borderRadius: 1 }}>
            <div
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemax={100}
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#C9A84C",
                transition: paused ? "none" : "width 0.1s linear",
              }}
            />
          </div>

          {/* Indicadores — barras width-animated */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Depoimento ${i + 1}`}
                style={{
                  width: i === current ? 24 : 8,
                  height: 2,
                  background: i === current ? "#C9A84C" : "rgba(255,255,255,0.2)",
                  border: 0,
                  padding: 0,
                  cursor: "pointer",
                  transition: "width 200ms ease, background 200ms ease",
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            <button
              aria-label="Depoimento anterior"
              onClick={prev}
              style={{ background: "none", border: "none", color: "#C9A84C", fontSize: 24, cursor: "pointer" }}
            >←</button>
            <button
              aria-label="Próximo depoimento"
              onClick={next}
              style={{ background: "none", border: "none", color: "#C9A84C", fontSize: 24, cursor: "pointer" }}
            >→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
