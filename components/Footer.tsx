"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { dividerVariants, revealVariants } from "@/lib/motion";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import Image from "next/image";

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const WAIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#C9A84C">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.843L.057 23.27a.75.75 0 00.92.92l5.427-1.453A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.73 9.73 0 01-5.03-1.392l-.361-.214-3.743 1.002 1.002-3.743-.214-.361A9.73 9.73 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

export default function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");
  const [tooltip, setTooltip] = useState(false);
  const [phoneTooltip, setPhoneTooltip] = useState(false);
  const businessStatus = useBusinessHours();

  const address = "Rua 1500, 397 — Centro, Balneário Camboriú, SC";
  const phone = "+55 47 99792-3415";

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setTooltip(true);
    setTimeout(() => setTooltip(false), 2000);
  };

  const handlePhone = () => {
    if (window.innerWidth < 1024) {
      window.location.href = "tel:+5547997923415";
    } else {
      navigator.clipboard.writeText(phone);
      setPhoneTooltip(true);
      setTimeout(() => setPhoneTooltip(false), 2000);
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="texture-dark" style={{ background: "var(--color-bg-footer)" }}>
      {/* Upper */}
      <div style={{
        paddingTop: 64,
        paddingBottom: 48,
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        textAlign: "center",
      }}>
        <Image
          src="/logo-circle.png"
          alt={tc("logoAlt")}
          width={56}
          height={56}
          style={{ objectFit: "contain" }}
        />
        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#C9A84C",
          margin: "0 0 4px",
          fontWeight: 400,
        }}>
          {tc("nomeMarca")}
        </p>
        <p style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          margin: "0 0 18px",
        }}>
          {tc("taglineMarca")}
        </p>

        <motion.span
          variants={dividerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "block",
            width: 80,
            height: 1,
            background: "#C9A84C",
            opacity: 0.4,
          }}
        />

        {/* Address */}
        <div style={{ position: "relative" }}>
          <button
            onClick={copyAddress}
            aria-label="Copiar endereço"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-body-sm)",
              color: "var(--color-text-muted)",
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            {address}
          </button>
          {tooltip && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#C9A84C",
              color: "#1a1a1a",
              padding: "4px 12px",
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              borderRadius: 2,
              whiteSpace: "nowrap",
            }}>
              {t("copiarEndereco")}
            </div>
          )}
        </div>

        {/* Hours */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <p style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "var(--text-body-sm)",
            color: "var(--color-text-muted)",
          }}>
            {t("horario")}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: businessStatus.isOpen ? "#4caf7d" : "#e55555",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                color: businessStatus.isOpen ? "#4caf7d" : "var(--color-text-muted)",
                fontWeight: businessStatus.isOpen ? 600 : 400,
              }}
            >
              {businessStatus.label}
            </span>
            <span style={{ color: "var(--color-border)", fontSize: 11 }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                color: "var(--color-text-muted)",
              }}
            >
              {businessStatus.nextInfo}
            </span>
          </div>
        </div>

        {/* Phone */}
        <div style={{ position: "relative" }}>
          <button
            onClick={handlePhone}
            aria-label="Telefone"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-body-sm)",
              color: "#C9A84C",
            }}
          >
            {phone}
          </button>
          {phoneTooltip && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#C9A84C",
              color: "#1a1a1a",
              padding: "4px 12px",
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              borderRadius: 2,
              whiteSpace: "nowrap",
            }}>
              {t("copiarTelefone")}
            </div>
          )}
        </div>
      </div>

      {/* Lower */}
      <div style={{
        background: "var(--color-bg-footer-sub)",
        borderTop: "1px solid rgba(201,168,76,0.2)",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>
        {/* Social */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a
            href="https://instagram.com/naiaracolin_salao"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Naiara Colin"
          >
            <InstagramIcon />
          </a>
          <a
            href={getWhatsAppLink("geral")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Naiara Colin"
            onClick={() => trackWhatsAppClick("rodape")}
          >
            <WAIcon />
          </a>
        </div>

        {/* Copyright */}
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-caption)",
          color: "var(--color-text-muted)",
        }}>
          {t.raw("copyright").replace("{year}", String(year))}
        </p>

        {/* Privacy */}
        <a
          href="/privacidade"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-caption)",
            color: "var(--color-text-muted)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          {t("privacidade")}
        </a>
      </div>
    </footer>
  );
}
