"use client";

import { revealVariants } from "@/lib/motion";
import { trackWhatsAppClick } from "@/lib/analytics";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import SectionTitle from "../ui/SectionTitle";

/* ─── coordenadas do salão ───────────────────────────────── */
const LNG = -48.6355;
const LAT = -26.9947;
const ZOOM = 15.5;

/* ─── URL do estilo dark MapTiler ────────────────────────── */
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;

/* ─── Marker SVG dourado ─────────────────────────────────── */
const GoldPin = () => (
  <svg
    width="36"
    height="48"
    viewBox="0 0 36 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ filter: "drop-shadow(0 4px 12px rgba(201,168,76,0.5))" }}
  >
    <path
      d="M18 0C8.059 0 0 8.059 0 18c0 12.703 16.2 28.8 17.1 29.7a1.35 1.35 0 001.8 0C19.8 46.8 36 30.703 36 18 36 8.059 27.941 0 18 0z"
      fill="#C9A84C"
    />
    <circle cx="18" cy="18" r="7" fill="#0a0a0a" />
    <circle cx="18" cy="18" r="3.5" fill="#C9A84C" />
  </svg>
);

/* ─── Card de informações ────────────────────────────────── */
function InfoCard({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 10,
      background: "rgba(10,10,10,0.92)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(201,168,76,0.25)",
      padding: "24px 28px",
      maxWidth: 260,
      display: "flex",
      flexDirection: "column",
      gap: 14,
    }}>
      {/* Nome */}
      <div>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
          color: "var(--color-gold)",
          margin: "0 0 6px",
        }}>
          {t("eyebrow")}
        </p>
        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--text-h3)",
          color: "#ffffff",
          margin: 0,
          lineHeight: "var(--leading-snug)",
        }}>
          Naiara Colin
        </p>
        <p style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "var(--text-body-sm)",
          color: "rgba(255,255,255,0.5)",
          margin: "2px 0 0",
        }}>
          Espaço de Beleza
        </p>
      </div>

      {/* Linha dourada */}
      <span style={{ display: "block", width: 40, height: 1, background: "#C9A84C", opacity: 0.6 }} />

      {/* Endereço */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-caption)",
          color: "rgba(255,255,255,0.6)",
          margin: 0,
          lineHeight: 1.5,
        }}>
          {t("endereco")}
        </p>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-caption)",
          color: "rgba(255,255,255,0.45)",
          margin: 0,
        }}>
          {t("horario")}
        </p>
      </div>

      {/* CTA */}
      <a
        href={getWhatsAppLink("mapa")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick("mapa")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-block",
          border: "1px solid #C9A84C",
          color: hovered ? "#1a1a1a" : "#C9A84C",
          background: hovered ? "#C9A84C" : "transparent",
          padding: "10px 16px",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-caption)",
          fontWeight: 500,
          letterSpacing: "0.05em",
          textDecoration: "none",
          textAlign: "center",
          transition: "background 200ms ease, color 200ms ease",
        }}
      >
        {t("cta")}
      </a>
    </div>
  );
}

/* ─── Componente principal ───────────────────────────────── */
export default function MapaSection() {
  const t = useTranslations("mapa");
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const initMap = useCallback(async () => {
    if (!mapContainer.current || mapRef.current) return;

    const maplibregl = await import("maplibre-gl");
    // @ts-expect-error - CSS import resolved by Next.js bundler at runtime
    await import("maplibre-gl/dist/maplibre-gl.css");

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE_URL,
      center: [LNG, LAT],
      zoom: ZOOM,
      pitch: 30,          /* inclinação leve — efeito 3D sutil */
      bearing: -10,       /* rotação leve para parecer editorial */
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    /* Remover controles padrão */
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    /* Marker dourado */
    const markerEl = document.createElement("div");
    markerEl.innerHTML = `
      <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 4px 12px rgba(201,168,76,0.5)); cursor: default;">
        <path d="M18 0C8.059 0 0 8.059 0 18c0 12.703 16.2 28.8 17.1 29.7a1.35 1.35 0 001.8 0C19.8 46.8 36 30.703 36 18 36 8.059 27.941 0 18 0z" fill="#C9A84C"/>
        <circle cx="18" cy="18" r="7" fill="#0a0a0a"/>
        <circle cx="18" cy="18" r="3.5" fill="#C9A84C"/>
      </svg>
    `;
    markerEl.style.cssText = "width:36px;height:48px;display:block;";

    const marker = new maplibregl.Marker({ element: markerEl, anchor: "bottom" })
      .setLngLat([LNG, LAT])
      .addTo(map);

    map.on("load", () => {
      setMapLoaded(true);

      /* Desabilitar scroll zoom — evita capturar scroll da página */
      map.scrollZoom.disable();

      /* Reativar no click dentro do mapa */
      map.getCanvas().addEventListener("click", () => {
        map.scrollZoom.enable();
      });
      document.addEventListener("click", (e) => {
        if (!mapContainer.current?.contains(e.target as Node)) {
          map.scrollZoom.disable();
        }
      });
    });

    mapRef.current = map;
    markerRef.current = marker;
  }, []);

  useEffect(() => {
    initMap();
    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, [initMap]);

  return (
    <section
      id="mapa"
      className="texture-dark"
      style={{
        background: "var(--color-bg)",
        paddingTop: "var(--section-gap)",
        paddingBottom: 0,
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
      }}
    >
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <SectionTitle
          title={t("titulo")}
          eyebrow={t("eyebrow_secao")}
        />

        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginTop: 48, position: "relative" }}
        >
          {/* Borda dourada */}
          <div style={{
            position: "absolute",
            inset: -1,
            border: "1px solid rgba(201,168,76,0.25)",
            pointerEvents: "none",
            zIndex: 20,
          }} />

          {/* Container do mapa */}
          <div
            ref={mapContainer}
            style={{
              width: "100%",
              height: isMobile ? 420 : 520,
              background: "#0a0a0a",
              overflow: "hidden",
            }}
          />

          {/* Card sobreposto — desktop */}
          {!isMobile && <InfoCard t={t} />}

          {/* Loading state */}
          {!mapLoaded && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
            }}>
              <div style={{
                width: 28,
                height: 28,
                border: "1.5px solid rgba(201,168,76,0.3)",
                borderTopColor: "#C9A84C",
                borderRadius: "50%",
                animation: "mapSpin 1s linear infinite",
              }} />
              <style>{`@keyframes mapSpin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </motion.div>

        {/* Card mobile — abaixo do mapa */}
        {isMobile && (
          <div style={{
            border: "1px solid rgba(201,168,76,0.18)",
            padding: "24px 20px",
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "var(--color-bg-card)",
          }}>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              margin: 0,
            }}>
              {t("eyebrow")}
            </p>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-body-sm)",
              color: "var(--color-text-muted)",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {t("endereco")}
            </p>
            <p style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "var(--text-body-sm)",
              color: "var(--color-text-muted)",
              margin: 0,
            }}>
              {t("horario")}
            </p>
            <a
              href={getWhatsAppLink("mapa")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("mapa")}
              style={{
                border: "1px solid #C9A84C",
                color: "#C9A84C",
                padding: "12px 16px",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-body-sm)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              {t("cta")}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
