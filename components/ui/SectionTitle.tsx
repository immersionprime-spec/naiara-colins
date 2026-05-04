"use client";

import { dividerVariants, revealVariants } from "@/lib/motion";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionTitle({ title, subtitle, align = "center" }: SectionTitleProps) {
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
        gap: 12,
        alignItems: isCenter ? "center" : "flex-start",
        textAlign: isCenter ? "center" : "left",
      }}
    >
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
          opacity: 0.8,
          transformOrigin: "left",
          flexShrink: 0,
        }}
      />
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--text-h1)",
          lineHeight: "var(--leading-snug)",
          color: "var(--color-text)",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-lg)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-muted)",
            maxWidth: "42rem",
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
