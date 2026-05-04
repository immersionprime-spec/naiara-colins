import { getWhatsAppLink } from "@/lib/whatsapp";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        textAlign: "center",
        padding: "48px 24px",
      }}
    >
      {/* Crown */}
      <svg width="64" height="45" viewBox="0 0 120 84" fill="none">
        <path d="M10 70 L10 54 L30 30 L60 54 L90 18 L110 54 L110 70 Z" fill="#C9A84C" stroke="#C9A84C" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="8" y="68" width="104" height="10" rx="2" fill="#C9A84C"/>
        <circle cx="10" cy="30" r="6" fill="#C9A84C"/>
        <circle cx="60" cy="14" r="6" fill="#C9A84C"/>
        <circle cx="110" cy="30" r="6" fill="#C9A84C"/>
      </svg>

      <p style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(1.25rem, 4vw, 2rem)",
        color: "#C9A84C",
        maxWidth: "480px",
        lineHeight: 1.3,
      }}>
        Esta página não existe — mas sua próxima experiência sim.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 320 }}>
        <Link
          href="/"
          style={{
            border: "1px solid #C9A84C",
            color: "#C9A84C",
            padding: "14px 32px",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.05em",
            textAlign: "center",
            transition: "background 200ms, color 200ms",
            display: "block",
          }}
        >
          Voltar para o início
        </Link>
        <a
          href={getWhatsAppLink("geral")}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            background: "#C9A84C",
            color: "#1a1a1a",
            padding: "18px 32px",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          Agendar pelo WhatsApp
        </a>
      </div>
    </main>
  );
}
