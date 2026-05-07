"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { iconEntryVariants, revealVariants, staggerContainer } from "@/lib/motion";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SectionTitle from "../ui/SectionTitle";

type Service = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
};

type ServicesData = {
  hair: Service[];
  nail: Service[];
  estetica: Service[];
};

// Category icons
const ScissorsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

const NailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2C8 2 6 5 6 8v10a2 2 0 0 0 4 0v-1h4v1a2 2 0 0 0 4 0V8c0-3-2-6-6-6z"/>
    <line x1="6" y1="13" x2="18" y2="13"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

const SmallDotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#C9A84C" aria-hidden="true">
    <circle cx="8" cy="8" r="3"/>
  </svg>
);

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  hair: <ScissorsIcon />,
  nail: <NailIcon />,
  estetica: <SparkleIcon />,
};

function ServiceItem({ service, isMobile }: { service: Service; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const t = useTranslations("servicos");
  const href = getWhatsAppLink("servico", service.name);
  const handleClick = () => trackWhatsAppClick(`servico:${service.name}`);

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      className="service-card-hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "16px 20px",
        borderRadius: "var(--card-radius)",
        border: hovered ? "none" : "1px solid var(--color-border)",
        background: hovered ? "rgba(201,168,76,0.04)" : "transparent",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 200ms ease",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
        zIndex: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <SmallDotIcon />
        <h4 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-body-sm)",
          fontWeight: "var(--weight-semibold)" as unknown as number,
          letterSpacing: "0.02em",
          color: "var(--color-text)",
          lineHeight: 1.3,
          margin: 0,
        }}>
          {service.name}
        </h4>
      </div>

      {service.description && service.description !== "—" && (
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-body-sm)",
          color: "var(--color-text-muted)",
          lineHeight: "var(--leading-normal)",
          paddingLeft: 26,
        }}>
          {service.description}
        </p>
      )}

      {/* CTA */}
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        animate={{ opacity: isMobile ? 1 : hovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          marginTop: 4,
          paddingLeft: 26,
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fontWeight: 500,
          color: "#C9A84C",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 4,
          cursor: "url('/cursors/dot-gold.svg') 8 8, pointer",
        }}
      >
        {t("agendar")} {service.name} →
      </motion.a>
    </motion.div>
  );
}

function CategoryBlock({
  category,
  services,
  title,
  desc,
  featured,
  isMobile,
}: {
  category: string;
  services: Service[];
  title: string;
  desc: string;
  featured?: boolean;
  isMobile: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = featured && !showAll ? services.slice(0, 3) : services;

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        background: featured ? "var(--color-bg-featured)" : "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--card-radius)",
        padding: "var(--card-padding)",
        width: "100%",
      }}
    >
      {/* Category header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
        <motion.div
          variants={iconEntryVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: 4 }}
        >
          {CATEGORY_ICONS[category]}
        </motion.div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-h2)",
            color: "var(--color-text)",
            lineHeight: "var(--leading-snug)",
          }}>
            {title}
          </h3>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-sm)",
            color: "var(--color-text-muted)",
            marginTop: 4,
          }}>
            {desc}
          </p>
        </div>
      </div>

      {/* Services grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          display: "grid",
          gridTemplateColumns: featured ? "repeat(auto-fill, minmax(220px, 1fr))" : "1fr",
          gap: 12,
        }}
      >
        {displayed.map((s) => (
          <ServiceItem key={s.id} service={s} isMobile={isMobile} />
        ))}
      </motion.div>

      {/* Show more */}
      {featured && services.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          style={{
            marginTop: 16,
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-sm)",
            color: "var(--color-gold)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Ver todos ({services.length}) →
        </button>
      )}
    </motion.div>
  );
}

export default function Servicos({ data }: { data: ServicesData }) {
  const t = useTranslations("servicos");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const hair = data.hair.length ? data.hair : [
    { id: "h1", name: "Noiva & Ocasiões Especiais",       description: "Maquiagem e penteado exclusivos para momentos inesquecíveis", icon: null },
    { id: "h2", name: "Color Experience",                  description: "Mechas personalizadas e coloração de alto padrão",             icon: null },
    { id: "h3", name: "Styling & Finalização",             description: "Babyliss, escova e acabamento profissional",                   icon: null },
    { id: "h4", name: "Corte & Escova Premium",            description: "Design personalizado com finalização impecável",               icon: null },
    { id: "h5", name: "Hair Extension (Mega Hair)",        description: "Alongamento com naturalidade e sofisticação",                  icon: null },
    { id: "h6", name: "Escova Lisa Perfeita",              description: "Alinhamento e polimento dos fios",                            icon: null },
    { id: "h7", name: "Alinhamento Capilar Avançado",      description: "Redução de volume e disciplina dos fios",                     icon: null },
    { id: "h8", name: "Tratamentos Capilares Intensivos",  description: "Hidratação, reconstrução e nutrição profunda",                icon: null },
    { id: "h9", name: "Botox Capilar Renewal",             description: "Rejuvenescimento e selagem dos fios",                        icon: null },
  ];

  const nail = data.nail.length ? data.nail : [
    { id: "n1", name: "Unhas em Gel Premium", description: "—", icon: null },
    { id: "n2", name: "Alongamento de Unhas", description: "—", icon: null },
    { id: "n3", name: "Manicure Tradicional", description: "—", icon: null },
  ];

  const estetica = data.estetica.length ? data.estetica : [
    { id: "e1",  name: "Brow Lamination",            description: "Sobrancelhas alinhadas e volumosas",                       icon: null },
    { id: "e2",  name: "Design de Sobrancelhas",     description: "Harmonização perfeita do olhar",                           icon: null },
    { id: "e3",  name: "Lash Lifting",               description: "Curvatura e destaque natural dos cílios",                  icon: null },
    { id: "e4",  name: "Preenchimento Labial",       description: "Volume e contorno sofisticado",                            icon: null },
    { id: "e5",  name: "Micropigmentação Labial",    description: "Cor e definição duradoura",                               icon: null },
    { id: "e6",  name: "Preenchimento de Olheiras",  description: "Revitalização do olhar",                                  icon: null },
    { id: "e7",  name: "Peeling do Mar Morto",       description: "Renovação profunda da pele",                              icon: null },
    { id: "e8",  name: "Peeling Químico",            description: "Tratamento avançado para textura e luminosidade",         icon: null },
    { id: "e9",  name: "Limpeza de Pele Premium",    description: "Purificação e revitalização completa",                    icon: null },
    { id: "e10", name: "Drenagem Linfática",         description: "Redução de inchaço e melhora da circulação",              icon: null },
  ];

  return (
    <section
      id="servicos"
      className="texture-dark"
      style={{
        background: "var(--color-bg)",
        paddingTop: "var(--section-gap)",
        paddingBottom: "var(--section-gap)",
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
      }}
    >
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <SectionTitle
          title={t("titulo")}
          subtitle={t("subtitulo")}
          eyebrow={t("eyebrow")}
          align="left"
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 32, marginTop: 64 }}>
          {/* Hair — full width featured */}
          <CategoryBlock
            category="hair"
            services={hair}
            title={t("categorias.hair")}
            desc={t("categorias.hair_desc")}
            featured
            isMobile={isMobile}
          />

          {/* Nail + Estética — side by side on desktop */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 32,
          }}>
            <CategoryBlock
              category="nail"
              services={nail}
              title={t("categorias.nail")}
              desc={t("categorias.nail_desc")}
              isMobile={isMobile}
            />
            <CategoryBlock
              category="estetica"
              services={estetica}
              title={t("categorias.estetica")}
              desc={t("categorias.estetica_desc")}
              featured
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
