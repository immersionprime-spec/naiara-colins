import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

export default async function CursosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cursos");

  return (
    <>
      <Header locale={locale} />
      <main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
        {/* Placeholder while no real content */}
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          textAlign: "center",
          padding: "var(--section-padding-x)",
          background: "#1a1a1a",
        }}>
          <svg width="48" height="34" viewBox="0 0 120 84" fill="#C9A84C">
            <path d="M10 70 L10 54 L30 30 L60 54 L90 18 L110 54 L110 70 Z"/>
            <rect x="8" y="68" width="104" height="10" rx="2"/>
            <circle cx="10" cy="30" r="6"/>
            <circle cx="60" cy="14" r="6"/>
            <circle cx="110" cy="30" r="6"/>
          </svg>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-h1)",
            color: "#C9A84C",
            lineHeight: "var(--leading-snug)",
          }}>
            {t("titulo")}
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-lg)",
            color: "var(--color-text-muted)",
            maxWidth: "42rem",
            lineHeight: "var(--leading-relaxed)",
          }}>
            {t("copy")}
          </p>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-sm)",
            color: "rgba(255,255,255,0.4)",
          }}>
            {t("conteudoEmBreve")}
          </p>

          {/* Cards mockados */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", marginTop: 24 }}>
            {["Curso 1", "Curso 2", "Curso 3"].map((name) => (
              <div key={name} style={{
                background: "#0a0a0a",
                border: "1px solid #222",
                borderRadius: "var(--card-radius)",
                padding: "24px 32px",
                minWidth: 220,
                textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h3)", color: "var(--color-text)", marginBottom: 8 }}>{name}</p>
                <span style={{
                  display: "inline-block",
                  background: "#C9A84C",
                  color: "#1a1a1a",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.05em",
                }}>Em breve</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky CTA */}
        <div style={{ position: "sticky", bottom: 0, zIndex: 100 }}>
          <a
            href={getWhatsAppLink("cursos")}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              width: "100%",
              background: "#C9A84C",
              color: "#1a1a1a",
              textAlign: "center",
              padding: "18px 32px",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "var(--text-body)",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            {t("ctaSticky")}
          </a>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
