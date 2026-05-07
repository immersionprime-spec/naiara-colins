"use client";

import { dividerVariants, revealVariants } from "@/lib/motion";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "center" | "left";
}

export default function SectionTitle({
  title,
  subtitle,
  eyebrow,
  align = "center",
}: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={revealVariants}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: isCenter ? "center" : "flex-start",
        textAlign: isCenter ? "center" : "left",
      }}
    >
      {/* Eyebrow — label de seção, aparece antes da linha dourada */}
      {eyebrow && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            margin: 0,
          }}
        >
          {eyebrow}
        </p>
      )}

      {/* Linha dourada — 80px, animada */}
      <motion.span
        variants={dividerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          display: "block",
          width: 80,
          height: 1,
          background: "var(--color-gold)",
          opacity: "var(--divider-opacity)" as unknown as number,
          transformOrigin: "left",
          flexShrink: 0,
          alignSelf: isCenter ? "center" : "flex-start",
        }}
      />

      {/* Título */}
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--text-h1)",
          fontWeight: "var(--weight-regular)" as unknown as number,
          lineHeight: "var(--leading-snug)",
          letterSpacing: "var(--tracking-tight)",
          color: "var(--color-text)",
          margin: 0,
          maxWidth: "720px",
        }}
      >
        {title}
      </h2>

      {/* Subtítulo */}
      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-muted)",
            maxWidth: "560px",
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
