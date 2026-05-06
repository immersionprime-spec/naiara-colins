"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { heroLeftVariants, heroRightVariants, revealVariants } from "@/lib/motion";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useMedia } from "@/hooks/useMedia";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

function VideoPane({ url, isPrimary, side }: { url: string; isPrimary?: boolean; side?: "left" | "right" }) {
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimedOut(false);
    if (!url) {
      setLoading(false);
      if (isPrimary) window.dispatchEvent(new Event("hero-poster-ready"));
      return;
    }
    const t = setTimeout(() => {
      setTimedOut(true);
      if (isPrimary) window.dispatchEvent(new Event("hero-poster-ready"));
    }, 4000);
    return () => clearTimeout(t);
  }, [url, isPrimary]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#0d0d0d" }}>
      {url ? (
        <video
          key={url}
          autoPlay muted loop playsInline preload="metadata"
          onLoadedData={() => {
            setLoading(false);
            if (isPrimary) window.dispatchEvent(new Event("hero-poster-ready"));
          }}
          onError={() => { setTimedOut(true); if (isPrimary) window.dispatchEvent(new Event("hero-poster-ready")); }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        >
          <source src={url} type="video/mp4" />
        </video>
      ) : (
        <div style={{
          width: "100%", height: "100%",
          background: side === "left"
            ? "linear-gradient(160deg, #1a1209 0%, #0a0a0a 60%)"
            : "linear-gradient(200deg, #0a0a0a 40%, #110e04 100%)",
        }}>
          <div style={{
            position: "absolute", top: "30%", left: "50%",
            transform: "translateX(-50%)", width: 1, height: "40%",
            background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.15), transparent)",
          }} />
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.45)", pointerEvents: "none" }} />
      {url && loading && !timedOut && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          <div style={{
            width: 24, height: 24,
            border: "2px solid rgba(201,168,76,0.4)",
            borderTopColor: "#C9A84C", borderRadius: "50%",
            animation: "heroSpin 1s linear infinite",
          }} />
          <style>{`@keyframes heroSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const [isMobile, setIsMobile] = useState(false);
  const { items } = useMedia("hero");

  const primary   = items.find((v) => v.is_primary) ?? items[0] ?? null;
  const secondary = items.find((v) => !v.is_primary && v.id !== primary?.id) ?? null;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="inicio"
      className="texture-dark"
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {isMobile ? (
          <div style={{ flex: 1, height: "100%" }}>
            <VideoPane url={primary?.signedUrl ?? ""} isPrimary side="left" />
          </div>
        ) : (
          <>
            <motion.div variants={heroLeftVariants} initial="hidden" animate="visible" style={{ flex: 1, height: "100%" }}>
              <VideoPane url={primary?.signedUrl ?? ""} isPrimary side="left" />
            </motion.div>
            <motion.div variants={heroRightVariants} initial="hidden" animate="visible" style={{ flex: 1, height: "100%" }}>
              <VideoPane url={secondary?.signedUrl ?? ""} side="right" />
            </motion.div>
          </>
        )}
      </div>

      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 32, padding: "0 24px", textAlign: "center",
      }}>
        <motion.h1
          variants={revealVariants} initial="hidden" animate="visible"
          transition={{ delay: 0.6 } as never}
          style={{
            fontFamily: "var(--font-serif)", fontSize: "var(--text-display)",
            lineHeight: "var(--leading-tight)", color: "#ffffff",
            textShadow: "0 2px 40px rgba(0,0,0,0.8)", maxWidth: "80vw",
          }}
        >
          {t("tagline")}
        </motion.h1>
        <motion.div variants={revealVariants} initial="hidden" animate="visible" transition={{ delay: 0.9 } as never}>
          <Button href={getWhatsAppLink("geral")} onClick={() => trackWhatsAppClick("hero")} variant="primary">
            {t("cta")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
