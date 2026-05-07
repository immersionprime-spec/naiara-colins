import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getTranslations, setRequestLocale } from "next-intl/server";

/** Converte \n\n em parágrafos e **texto** em <strong>. */
function renderCorpo(raw: string) {
  return raw.split("\n\n").map((block, i) => {
    const parts = block.split(/\*\*(.+?)\*\*/g);
    const nodes = parts.map((part, j) =>
      j % 2 === 1
        ? <strong key={j} style={{ fontWeight: 500, color: "#1a1a1a" }}>{part}</strong>
        : part
    );
    return (
      <p key={i} style={{ marginBottom: 20 }}>
        {nodes}
      </p>
    );
  });
}

export default async function PrivacidadePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations("privacidade");

  return (
    <>
      <Header locale={locale} />
      <main>
        {/* Dark hero */}
        <div style={{
          background: "#0a0a0a",
          padding: "120px var(--section-padding-x) 64px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-h1)",
            color: "#ffffff",
            lineHeight: "var(--leading-snug)",
          }}>
            {t("titulo")}
          </h1>
        </div>

        {/* Light body */}
        <div style={{
          background: "#f5f0eb",
          color: "#1a1a1a",
        }}>
          <div style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "clamp(2rem, 5vw, 4rem)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-lg)",
            lineHeight: "var(--leading-loose)",
          }}>
            {renderCorpo(t("corpo"))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
