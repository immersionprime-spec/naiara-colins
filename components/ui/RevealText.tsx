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

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: delay }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.25em",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      {words.map((word, i) => (
        <div
          key={`${word}-${i}`}
          style={{
            overflow: "hidden",
            display: "inline-block",
            lineHeight: 1.1,
          }}
        >
          <motion.span
            custom={i}
            variants={wordVariants}
            style={{
              display: "inline-block",
              ...(style || {}),
            }}
            className={className}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
}

