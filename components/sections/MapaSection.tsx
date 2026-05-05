"use client";

import { revealVariants } from "@/lib/motion";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionTitle from "../ui/SectionTitle";

export default function MapaSection() {
  const t = useTranslations("mapa");

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
        <SectionTitle title={t("titulo")} />
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginTop: 48, overflow: "hidden", borderRadius: "var(--card-radius)" }}
        >
          <iframe
            src="https://maps.google.com/maps?q=Rua+1500,+397,+Centro,+Balne%C3%A1rio+Cambori%C3%BA,+SC,+Brasil&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização Naiara Colin Espaço de Beleza"
          />
        </motion.div>
      </div>
    </section>
  );
}
