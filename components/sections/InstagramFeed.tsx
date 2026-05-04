"use client";

import { revealVariants, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SectionTitle from "../ui/SectionTitle";

type IGPost = {
  id: string;
  post_id: string;
  media_url: string;
  thumbnail_url: string | null;
  caption: string | null;
};

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function InstagramFeed() {
  const t = useTranslations("instagram");
  const [posts, setPosts] = useState<IGPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPosts(data.slice(0, 9));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Não renderiza nada se não houver posts e carregamento terminou
  if (!loading && posts.length === 0) return null;

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
        <SectionTitle title={t("titulo")} subtitle={t("subtitulo")} />

        {loading ? (
          /* Skeleton enquanto carrega */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 4,
              marginTop: 48,
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1/1",
                  background: "var(--color-border)",
                  animation: "igPulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes igPulse {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.7; }
              }
            `}</style>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 4,
              marginTop: 48,
            }}
          >
            {posts.map((post) => {
              const imgSrc = post.thumbnail_url || post.media_url;
              return (
                <motion.a
                  key={post.id}
                  variants={revealVariants}
                  href={`https://www.instagram.com/naiaracolin_salao/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={post.caption ? post.caption.slice(0, 80) : "Post do Instagram"}
                  style={{
                    display: "block",
                    position: "relative",
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    background: "var(--color-border)",
                    cursor: "url('/cursors/dot-gold.svg') 8 8, pointer",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={post.caption ? post.caption.slice(0, 80) : "Post Naiara Colin"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 300ms ease",
                    }}
                    loading="lazy"
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  {/* Overlay dourado no hover */}
                  <div
                    className="ig-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(201,168,76,0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 300ms ease",
                      color: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(201,168,76,0.25)";
                      (e.currentTarget as HTMLElement).style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(201,168,76,0)";
                      (e.currentTarget as HTMLElement).style.color = "transparent";
                    }}
                  >
                    <InstagramIcon />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        )}

        {/* CTA para o perfil */}
        {!loading && posts.length > 0 && (
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
          >
            <a
              href="https://www.instagram.com/naiaracolin_salao/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid var(--color-gold)",
                color: "var(--color-gold)",
                padding: "12px 28px",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-menu)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textDecoration: "none",
                transition: "background 200ms, color 200ms",
                cursor: "url('/cursors/dot-gold.svg') 8 8, pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--color-gold)";
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-text-inverse)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-gold)";
              }}
            >
              <InstagramIcon />
              {t("cta")}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
