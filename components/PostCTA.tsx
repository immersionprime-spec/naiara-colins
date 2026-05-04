"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useTranslations } from "next-intl";

export default function PostCTA() {
  const t = useTranslations("blog");

  return (
    <div style={{
      background: "#0a0a0a",
      padding: "64px var(--section-padding-x)",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 24,
    }}>
      <p style={{
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontSize: "var(--text-h2)",
        color: "#C9A84C",
        maxWidth: "600px",
      }}>
        {t("postCta")}
      </p>
      <a
        href={getWhatsAppLink("geral")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick("post-blog")}
        style={{
          border: "1px solid #C9A84C",
          color: "#C9A84C",
          padding: "14px 32px",
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          textDecoration: "none",
          letterSpacing: "0.05em",
          transition: "background 200ms, color 200ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#C9A84C";
          (e.currentTarget as HTMLAnchorElement).style.color = "#1a1a1a";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C";
        }}
      >
        {t("postCtaBtn")}
      </a>
    </div>
  );
}
