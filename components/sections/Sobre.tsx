"use client";

import { revealVariants } from "@/lib/motion";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import RevealText from "../ui/RevealText";

export default function Sobre({ videoUrl }: { videoUrl: string }) {
  const t = useTranslations("sobre");
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const texto = t("texto");

  return (
    <section
      id="sobre"
      className="texture-dark"
      style={{
        background: "var(--color-bg)",
        paddingTop: "var(--section-gap)",
        paddingBottom: "var(--section-gap)",
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 48,
          alignItems: "flex-start",
        }}
      >
        {/* Video — 40% on desktop */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            flexShrink: 0,
            width: isMobile ? "100%" : "40%",
          }}
        >
          {videoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster=""
              style={{
                width: "100%",
                aspectRatio: "9/16",
                maxHeight: isMobile ? "70vh" : "80vh",
                objectFit: "cover",
                display: "block",
              }}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "9/16",
                maxHeight: isMobile ? "50vh" : "80vh",
                background: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="48" height="34" viewBox="0 0 120 84" fill="#C9A84C" opacity={0.3}>
                <path d="M10 70 L10 54 L30 30 L60 54 L90 18 L110 54 L110 70 Z"/>
                <rect x="8" y="68" width="104" height="10" rx="2"/>
              </svg>
            </div>
          )}
        </motion.div>

        {/* Text — 60% on desktop */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            paddingTop: isMobile ? 0 : 32,
          }}
        >
          <RevealText
            text={t("titulo")}
            delay={0}
            as="h2"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--text-h1)",
              lineHeight: "var(--leading-snug)",
              color: "var(--color-text)",
            }}
          />

          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-body-lg)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-muted)",
              whiteSpace: "pre-line",
              overflow: "hidden",
              maxHeight: isMobile && !expanded ? 120 : 4000,
              transition: "max-height 600ms ease",
              WebkitMaskImage: isMobile && !expanded ? "linear-gradient(to bottom, black 50%, transparent 100%)" : "none",
              maskImage: isMobile && !expanded ? "linear-gradient(to bottom, black 50%, transparent 100%)" : "none",
            }}
          >
            {texto}
          </div>

          {isMobile && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "#C9A84C",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "var(--text-body)",
                textAlign: "left",
                padding: 0,
              }}
            >
              {t("lerMais")}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
