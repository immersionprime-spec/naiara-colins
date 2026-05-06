"use client";

import type { CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealTextProps {
  text: string;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function RevealText({
  text,
  delay = 0,
  className,
  style,
  as: Tag = "h1",
}: RevealTextProps) {
  const reducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (reducedMotion) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      style={{
        ...(style || {}),
        display: "flex",
        flexWrap: "wrap",
        gap: "0 0.28em",
        justifyContent: "center",
        alignItems: "flex-end",
        lineHeight: style?.lineHeight ?? "var(--leading-tight)",
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ overflow: "hidden", display: "block", lineHeight: "inherit" }}
        >
          <motion.span
            custom={i}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: delay + i * 0.08 }}
            style={{ display: "block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

