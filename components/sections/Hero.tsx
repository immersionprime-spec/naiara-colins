"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { heroLeftVariants, heroRightVariants, revealVariants } from "@/lib/motion";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useMedia } from "@/hooks/useMedia";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import RevealText from "../ui/RevealText";
import MagneticButton from "../ui/MagneticButton";
import GoldParticles from "../ui/GoldParticles";

function VideoPane({ url, isPrimary, side, poster }: { url: string; isPrimary?: boolean; side?: "left" | "right"; poster?: string }) {
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
          poster={poster || undefined}
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
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { items } = useMedia("hero");

  const primary   = items.find((v) => v.is_primary) ?? items[0] ?? null;
  const secondary = items.find((v) => !v.is_primary && v.id !== primary?.id) ?? null;
  const [ctaHovered, setCtaHovered] = useState(false);

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
            <VideoPane url={primary?.signedUrl ?? ""} isPrimary side="left" poster={primary?.posterUrl ?? ""} />
          </div>
        ) : (
          <>
            <motion.div
              variants={reducedMotion ? undefined : heroLeftVariants}
              initial={reducedMotion ? { opacity: 1 } : "hidden"}
              animate={reducedMotion ? { opacity: 1 } : "visible"}
              style={{ flex: 1, height: "100%" }}
            >
              <VideoPane url={primary?.signedUrl ?? ""} isPrimary side="left" poster={primary?.posterUrl ?? ""} />
            </motion.div>
            <motion.div
              variants={reducedMotion ? undefined : heroRightVariants}
              initial={reducedMotion ? { opacity: 1 } : "hidden"}
              animate={reducedMotion ? { opacity: 1 } : "visible"}
              style={{ flex: 1, height: "100%" }}
            >
              <VideoPane url={secondary?.signedUrl ?? ""} side="right" poster={secondary?.posterUrl ?? ""} />
            </motion.div>
          </>
        )}
      </div>

      <GoldParticles />

      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "0 24px",
        paddingTop: "8vh",
        paddingBottom: "8vh",
        textAlign: "center",
      }}>
        <RevealText
          text={t("tagline")}
          delay={0.6}
          as="h1"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--leading-tight)",
            color: "#ffffff",
            textShadow: "0 2px 40px rgba(0,0,0,0.8)",
            maxWidth: "80vw",
          }}
        />
        <motion.div variants={revealVariants} initial="hidden" animate="visible" transition={{ delay: 0.9 } as never}>
          <MagneticButton
            href={getWhatsAppLink("geral")}
            onClick={() => trackWhatsAppClick("hero")}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--color-gold)",
              color: ctaHovered ? "var(--color-text-inverse)" : "var(--color-gold)",
              background: ctaHovered ? "var(--color-gold)" : "transparent",
              padding: "14px 32px",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textDecoration: "none",
              cursor: "url('/cursors/dot-gold.svg') 8 8, pointer",
              transition: "background 200ms ease, color 200ms ease",
              userSelect: "none",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("cta")}
          </MagneticButton>
        </motion.div>

        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 } as never}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            marginTop: 8,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "rgba(201,168,76,0.9)",
              textAlign: "center",
            }}
          >
            {t("credencial")}
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 11,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.05em",
              textAlign: "center",
              maxWidth: "90vw",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t("credencial_sub")}
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }}
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            cursor: "default",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
            }}
          >
            {t("scroll")}
          </span>
          <motion.div
            animate={reducedMotion ? {} : { y: [0, 6, 0] }}
            transition={reducedMotion ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(201,168,76,0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
