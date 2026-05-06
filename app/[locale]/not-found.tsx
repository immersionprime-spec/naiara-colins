import { getWhatsAppLink } from "@/lib/whatsapp";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

export default async function NotFound() {
  await getLocale();

  const t = await getTranslations("pagina404");
  const tc = await getTranslations("common");

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
      <Image
        src="/logo.png"
        alt={tc("logoAlt")}
        width={80}
        height={80}
        style={{ objectFit: "contain" }}
      />

      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(1.25rem, 4vw, 2rem)",
          color: "#C9A84C",
          maxWidth: "480px",
          lineHeight: 1.3,
        }}
      >
        {t("titulo")}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
          maxWidth: 320,
        }}
      >
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
          {t("inicio")}
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
          {t("whatsapp")}
        </a>
      </div>
    </main>
  );
}

