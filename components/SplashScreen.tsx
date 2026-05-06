"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function SplashScreen() {
  const reducedMotion = useReducedMotion();
  const tc = useTranslations("common");
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
              <Image
                src="/logo-circle.png"
                alt={tc("logoAlt")}
                width={144}
                height={120}
                priority
                style={{ objectFit: "contain" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
