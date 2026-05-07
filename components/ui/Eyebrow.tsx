"use client";

import { motion } from "framer-motion";
import { revealVariants } from "@/lib/motion";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Eyebrow — label de seção com linha dourada à esquerda.
 *
 * Uso:
 *   <Eyebrow>Para Naiara — em mãos próprias</Eyebrow>
 *
 * Renderiza em maiúsculas com letter-spacing generoso.
 * Cor: --color-gold-deep (dourado mais escuro, contraste WCAG em fundos claros).
 * Linha: 18px × 1px em --color-gold.
 */
export default function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-label)",       /* 0.6875rem ≈ 7pt */
        fontWeight: "var(--weight-medium)" as unknown as number,
        letterSpacing: "var(--tracking-widest)",
        textTransform: "uppercase",
        color: "var(--color-gold)",
        lineHeight: 1,
      }}
    >
      {/* Linha dourada decorativa à esquerda */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: 18,
          height: 1,
          background: "var(--color-gold)",
          flexShrink: 0,
        }}
      />
      {children}
    </motion.div>
  );
}

