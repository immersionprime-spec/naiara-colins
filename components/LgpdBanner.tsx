"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LgpdBanner() {
  const t = useTranslations("lgpd");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("nc_lgpd_accepted");
    if (accepted !== "true") {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("nc_lgpd_accepted", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="lgpd"
          className="lgpd-banner"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.0, 0.0, 0.2, 1] }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9000,
            background: "rgba(10,10,10,0.97)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "16px var(--section-padding-x)",
          }}
        >
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-sm)",
            color: "#d4c5b2",
            flex: 1,
          }}>
            {t("texto")}{" "}
            <Link
              href="/privacidade"
              style={{ color: "#C9A84C", textDecoration: "underline" }}
            >
              {t("link")}
            </Link>
          </p>
          <button
            onClick={accept}
            style={{
              background: "#C9A84C",
              color: "#1a1a1a",
              border: "none",
              padding: "10px 24px",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "var(--text-body-sm)",
              cursor: "pointer",
              borderRadius: 0,
              flexShrink: 0,
            }}
          >
            {t("botao")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
