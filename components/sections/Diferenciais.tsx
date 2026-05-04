"use client";

import { iconEntryVariants, revealVariants, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SectionTitle from "../ui/SectionTitle";

const icons = [
  <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
];

export default function Diferenciais() {
  const t = useTranslations("diferenciais");
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const check = () => setCols(window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const items = [
    { icon: icons[0], title: t("item1") },
    { icon: icons[1], title: t("item2") },
    { icon: icons[2], title: t("item3") },
    { icon: icons[3], title: t("item4") },
  ];

  return (
    <section
      style={{
        background: "var(--color-bg-alt)",
        paddingTop: "var(--section-gap)",
        paddingBottom: "var(--section-gap)",
        paddingLeft: "var(--section-padding-x)",
        paddingRight: "var(--section-padding-x)",
      }}
    >
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <SectionTitle title={t("titulo")} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 48,
            marginTop: 64,
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={revealVariants}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 16,
              }}
            >
              <motion.div
                variants={iconEntryVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {item.icon}
              </motion.div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "var(--text-h3)",
                  color: "var(--color-text)",
                  lineHeight: "var(--leading-normal)",
                }}
              >
                {item.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
