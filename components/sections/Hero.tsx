"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import type { MediaRow } from "@/lib/media";
import { heroLeftVariants, heroRightVariants, revealVariants } from "@/lib/motion";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

interface HeroProps {
  video1: MediaRow | null;
  video2: MediaRow | null;
}

function VideoPane({ url, isPrimary, side }: { url: string; isPrimary?: boolean; side?: "left" | "right" }) {
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setTimedOut(true);
      if (isPrimary) window.dispatchEvent(new Event("hero-poster-ready"));
    }, 4000);
    return () => clearTimeout(t);
  }, [isPrimary]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#0d0d0d" }}>
      {url ? (
        <video
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
        /* No video — decorative gradient placeholder */
        <div style={{
          width: "100%",
          height: "100%",
          background: side === "left"
            ? "linear-gradient(160deg, #1a1209 0%, #0a0a0a 60%)"
            : "linear-gradient(200deg, #0a0a0a 40%, #110e04 100%)",
        }}>
          {/* Subtle decorative line */}
          <div style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            height: "40%",
            background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.15), transparent)",
          }} />
        </div>
      )}
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.45)", pointerEvents: "none" }} />
      {/* Spinner while loading */}
      {url && loading && !timedOut && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          <div style={{
            width: 24, height: 24,
            border: "2px solid rgba(201,168,76,0.4)",
            borderTopColor: "#C9A84C",
            borderRadius: "50%",
            animation: "heroSpin 1s linear infinite",
          }} />
          <style>{`@keyframes heroSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}

export default function Hero({ video1, video2 }: HeroProps) {
  const t = useTranslations("hero");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="inicio"
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
    >
      {/* Videos background */}
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {isMobile ? (
          /* Mobile: only video1 */
          <div style={{ flex: 1, height: "100%" }}>
            <VideoPane url={video1?.signedUrl ?? ""} isPrimary side="left" />
          </div>
        ) : (
          /* Desktop: two portrait videos */
          <>
            <motion.div variants={heroLeftVariants} initial="hidden" animate="visible" style={{ flex: 1, height: "100%" }}>
              <VideoPane url={video1?.signedUrl ?? ""} isPrimary side="left" />
            </motion.div>
            <motion.div variants={heroRightVariants} initial="hidden" animate="visible" style={{ flex: 1, height: "100%" }}>
              <VideoPane url={video2?.signedUrl ?? ""} side="right" />
            </motion.div>
          </>
        )}
      </div>

      {/* Centered tagline */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "0 24px",
        textAlign: "center",
      }}>
        <motion.h1
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 } as never}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-display)",
            lineHeight: "var(--leading-tight)",
            color: "#ffffff",
            textShadow: "0 2px 40px rgba(0,0,0,0.8)",
            maxWidth: "80vw",
          }}
        >
          {t("tagline")}
        </motion.h1>

        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 } as never}
        >
          <Button
            href={getWhatsAppLink("geral")}
            onClick={() => trackWhatsAppClick("hero")}
            variant="primary"
          >
            {t("cta")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
