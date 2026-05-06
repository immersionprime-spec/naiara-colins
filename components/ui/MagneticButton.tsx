"use client";

import type { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  strength?: number;
  radius?: number;
}

export default function MagneticButton({
  children,
  className,
  style,
  onClick,
  href,
  target,
  rel,
  ariaLabel,
  strength = 0.3,
  radius = 70,
}: MagneticButtonProps) {
  const { ref, springX, springY, onMouseMove, onMouseLeave } = useMagnetic({
    strength,
    radius,
  });

  const motionProps = {
    style: { x: springX, y: springY, ...style },
    className,
    onMouseMove,
    onMouseLeave,
  } as const;

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}

