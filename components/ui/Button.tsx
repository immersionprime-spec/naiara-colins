"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "cta-mobile";

interface ButtonProps {
  variant?: Variant;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function Button({
  variant = "primary",
  children,
  onClick,
  href,
  ariaLabel,
  className = "",
  type = "button",
  disabled,
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "url('/cursors/dot-gold.svg') 8 8, pointer",
    textDecoration: "none",
    letterSpacing: "0.05em",
    fontFamily: "var(--font-sans)",
    transition: "background 200ms ease, color 200ms ease, box-shadow 200ms ease",
    outline: "none",
    border: "none",
    userSelect: "none",
  };

  const variantStyles: Record<Variant, React.CSSProperties> = {
    primary: {
      border: "1px solid var(--color-gold)",
      color: "var(--color-gold)",
      background: "transparent",
      padding: "14px 32px",
      fontWeight: "var(--weight-medium)" as unknown as number,
      borderRadius: 0,
    },
    ghost: {
      color: "var(--color-text-muted)",
      background: "transparent",
      padding: "8px 16px",
    },
    "cta-mobile": {
      background: "#C9A84C",
      color: "#1a1a1a",
      width: "100%",
      padding: "18px 32px",
      fontWeight: 700,
      borderRadius: 0,
    },
  };

  const style: React.CSSProperties = { ...baseStyle, ...variantStyles[variant] };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === "primary") {
      (e.currentTarget as HTMLElement).style.background = "var(--color-gold)";
      (e.currentTarget as HTMLElement).style.color = "var(--color-text-inverse)";
    }
    if (variant === "ghost") {
      (e.currentTarget as HTMLElement).style.color = "var(--color-gold)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === "primary") {
      (e.currentTarget as HTMLElement).style.background = "transparent";
      (e.currentTarget as HTMLElement).style.color = "var(--color-gold)";
    }
    if (variant === "ghost") {
      (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
    }
  };

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      style={{ ...style, border: variant === "primary" ? "1px solid var(--color-gold)" : "none" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
