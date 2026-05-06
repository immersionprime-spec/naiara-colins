"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CursorFollower() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 250, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (reducedMotion) return;

    // Só mostrar em dispositivos com mouse real (não touch)
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
      if (!visible) setVisible(true);
    };

    const handleEnter = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [role='button']")) {
        setIsHovering(true);
      }
    };

    const handleLeave = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [role='button']")) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", handleEnter);
    document.addEventListener("mouseout", handleLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", handleEnter);
      document.removeEventListener("mouseout", handleLeave);
    };
  }, [reducedMotion, mouseX, mouseY, visible]);

  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x,
        y,
        width: isHovering ? 40 : 24,
        height: isHovering ? 40 : 24,
        borderRadius: "50%",
        border: `1.5px solid rgba(201,168,76,${isHovering ? 0.9 : 0.6})`,
        background: isHovering ? "rgba(201,168,76,0.12)" : "transparent",
        zIndex: 99999,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "width 200ms ease, height 200ms ease, background 200ms ease, border-color 200ms ease",
        mixBlendMode: "normal",
      }}
    />
  );
}

