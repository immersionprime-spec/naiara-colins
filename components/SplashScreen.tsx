"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useState } from "react";

const CrownSVG = ({ size = 120 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 120 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10 70 L10 54 L30 30 L60 54 L90 18 L110 54 L110 70 Z"
      fill="#C9A84C"
      stroke="#C9A84C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <rect x="8" y="68" width="104" height="10" rx="2" fill="#C9A84C" />
    <circle cx="10" cy="30" r="6" fill="#C9A84C" />
    <circle cx="60" cy="14" r="6" fill="#C9A84C" />
    <circle cx="110" cy="30" r="6" fill="#C9A84C" />
  </svg>
);

export default function SplashScreen() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [posterReady, setPosterReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeDone(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = () => setPosterReady(true);
    window.addEventListener("hero-poster-ready", handler);
    // Fallback: hide after 4s regardless
    const fallback = setTimeout(() => setPosterReady(true), 4000);
    return () => {
      window.removeEventListener("hero-poster-ready", handler);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (minTimeDone && posterReady) {
      setVisible(false);
    }
  }, [minTimeDone, posterReady]);

  return (
    <AnimatePresence mode="popLayout">
      {visible && (
        <motion.div
          key="splash"
          aria-hidden="true"
          role="presentation"
          className="splash-screen"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
        >
          <motion.div layoutId="crown-logo">
            <motion.div
              animate={reducedMotion ? { opacity: 1 } : { opacity: [0, 1, 1, 1] }}
              transition={reducedMotion ? { duration: 0 } : { duration: 1.5, times: [0, 0.3, 0.8, 1] }}
            >
              <CrownSVG size={120} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
