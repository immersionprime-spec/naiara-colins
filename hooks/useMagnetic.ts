"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useCallback, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface MagneticOptions {
  strength?: number; // 0 a 1, padrão 0.35
  radius?: number; // pixels, padrão 80
}

export function useMagnetic(
  { strength = 0.35, radius = 80 }: MagneticOptions = {}
) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reducedMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      if (dist < radius) {
        x.set(distX * strength);
        y.set(distY * strength);
      }
    },
    [reducedMotion, radius, strength, x, y]
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, springX, springY, onMouseMove, onMouseLeave };
}

