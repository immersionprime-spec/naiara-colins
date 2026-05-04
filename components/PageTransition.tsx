"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.0, 0.0, 0.2, 1] }}
        style={{ position: "relative" }}
      >
        {children}
        {/* Overlay preto para transição — fade preto 300ms */}
        <motion.div
          key={`overlay-${pathname}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.0, 0.0, 0.2, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#0a0a0a",
            zIndex: 9998,
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
