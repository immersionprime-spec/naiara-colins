"use client";

import { revealVariants } from "@/lib/motion";
import Button from "@/components/ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export default function CursosHome({ imageUrl }: { imageUrl?: string }) {
  const t = useTranslations("cursos");
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="cursos"
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#0a0a0a",
        paddingTop: "var(--section-gap)",
        paddingBottom: "var(--section-gap)",
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
        overflow: "hidden",
      }}
    >
      {/* Noise grain */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "200px",
        }}
      />

      <div style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 64,
        alignItems: "center",
      }}>
        {/* Text side */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}
        >
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            lineHeight: "var(--leading-snug)",
            color: "var(--color-gold)",
          }}>
            {t("titulo")}
          </h2>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-lg)",
            color: "var(--color-text-muted)",
            lineHeight: "var(--leading-relaxed)",
            maxWidth: "420px",
          }}>
            {t("copy")}
          </p>
          <div style={{ marginTop: 8 }}>
            <Button href="/cursos" variant="primary">
              {t("cta")} →
            </Button>
          </div>
        </motion.div>

        {/* Image side with parallax */}
        <motion.div
          style={{ y, flex: 1, overflow: "hidden", borderRadius: "var(--card-radius)" }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Bastidores dos cursos Naiara Colin"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{
              width: "100%",
              aspectRatio: "4/3",
              background: "#161616",
              border: "1px solid #222",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}>
              <svg width="48" height="34" viewBox="0 0 120 84" fill="#C9A84C" opacity={0.3}>
                <path d="M10 70 L10 54 L30 30 L60 54 L90 18 L110 54 L110 70 Z"/>
                <rect x="8" y="68" width="104" height="10" rx="2"/>
                <circle cx="10" cy="30" r="6"/><circle cx="60" cy="14" r="6"/><circle cx="110" cy="30" r="6"/>
              </svg>
              <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontSize: 12 }}>
                {t("imagemEmBreve")}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
