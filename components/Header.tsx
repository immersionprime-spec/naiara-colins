"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { Link, usePathname, useRouter } from "@/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { activeSectionStore } from "@/lib/activeSectionStore";
import { useMagnetic } from "@/hooks/useMagnetic";
import Image from "next/image";

const navItems = [
  { href: "#sobre", key: "sobre" },
  { href: "#servicos", key: "servicos" },
  { href: "#galeria", key: "galeria" },
  { href: "#depoimentos", key: "depoimentos" },
  { href: "#cursos", key: "cursos" },
] as const;

const locales = [
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
] as const;

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const {
    ref: ctaRef,
    springX: ctaX,
    springY: ctaY,
    onMouseMove: ctaMouseMove,
    onMouseLeave: ctaMouseLeave,
  } = useMagnetic({ strength: 0.25, radius: 60 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("nc_theme") as "dark" | "light" | null;
    const preferred = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(preferred);
    document.documentElement.dataset.theme = preferred;
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("nc_theme", next);
    document.documentElement.dataset.theme = next;
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) setScrollProgress((window.scrollY / docH) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((i) => i.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
            activeSectionStore.set(id);
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Focus trap no menu mobile
  useEffect(() => {
    if (!menuOpen) return;

    const overlay = document.getElementById("mobile-menu-overlay");
    if (!overlay) return;

    const focusableElements = overlay.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const changeLocale = (code: string) => {
    localStorage.setItem("nc_locale", code);
    router.replace(pathname, { locale: code });
  };

  return (
    <>
      {/* Mobile scroll progress */}
      {isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, zIndex: 1001, height: 2, width: `${scrollProgress}%`, background: "#C9A84C", transition: "width 0.1s linear" }} />
      )}

      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--section-padding-x)",
        background: scrolled ? "var(--color-bg-overlay)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 300ms ease",
      }}>
        {/* Logo */}
        <Link href="/" aria-label="Naiara Colin Espaço de Beleza" style={{ textDecoration: "none" }}>
          <motion.div
            layoutId="crown-logo"
            animate={{ scale: scrolled ? 0.85 : 1 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", width: 40, height: 40, alignItems: "center" }}
          >
            <Image
              src="/logo.png"
              alt={tc("logoAlt")}
              width={40}
              height={40}
              priority
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.key}
                  href={item.href}
                  style={{
                    position: "relative",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-menu)",
                    fontWeight: 500,
                    color: "var(--color-text)",
                    textDecoration: "none",
                    paddingBottom: 4,
                    cursor: "url('/cursors/dot-gold.svg') 8 8, pointer",
                  }}
                >
                  {t(item.key)}
                  {isActive && (
                    <motion.span
                      layoutId="menu-indicator"
                      style={{
                        position: "absolute",
                        bottom: -2,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: "#C9A84C",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
        )}

        {/* Right controls — Desktop */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Tema claro" : "Tema escuro"}
              style={{ fontSize: 14, color: "var(--color-text-muted)", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
            >
              {theme === "dark" ? "☀" : "◐"}
            </button>
            <span style={{ color: "#C9A84C", fontSize: 10 }}>|</span>
            {/* Locale */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
              {locales.map((loc, i) => (
                <span key={loc.code} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <button
                    onClick={() => changeLocale(loc.code)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: locale === loc.code ? "var(--color-text)" : "var(--color-text-muted)",
                      fontFamily: "var(--font-sans)",
                      fontSize: 10,
                      fontWeight: locale === loc.code ? 700 : 400,
                      padding: "2px 4px",
                    }}
                  >
                    {loc.label}
                  </button>
                  {i < locales.length - 1 && <span style={{ color: "#C9A84C" }}>·</span>}
                </span>
              ))}
            </div>
            {/* CTA */}
            <motion.a
              href={getWhatsAppLink("geral")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("header")}
              ref={ctaRef as React.RefObject<HTMLAnchorElement>}
              style={{
                x: ctaX,
                y: ctaY,
                border: "1px solid var(--color-gold)",
                color: "var(--color-gold)",
                padding: "10px 24px",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-menu)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textDecoration: "none",
                transition: "background 200ms, color 200ms",
                cursor: "url('/cursors/dot-gold.svg') 8 8, pointer",
                display: "inline-block",
              }}
              onMouseMove={ctaMouseMove}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-gold)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-inverse)";
              }}
              onMouseLeave={(e) => {
                ctaMouseLeave();
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-gold)";
              }}
            >
              {t("agendar")}
            </motion.a>
          </div>
        )}

        {/* Hambúrguer — Mobile */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 8 }}
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} style={{ display: "block", width: 24, height: 1.5, background: "#C9A84C", borderRadius: 1 }} />
            <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.3 }} style={{ display: "block", width: 18, height: 1.5, background: "#C9A84C", borderRadius: 1 }} />
            <motion.span animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} style={{ display: "block", width: 12, height: 1.5, background: "#C9A84C", borderRadius: 1 }} />
          </button>
        )}
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu-overlay"
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              background: "rgba(10,10,10,0.97)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.75rem, 6vw, 3rem)",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                {t(item.key)}
              </a>
            ))}

            <motion.a
              href={getWhatsAppLink("geral")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { setMenuOpen(false); trackWhatsAppClick("menu-mobile"); }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                background: "#C9A84C",
                color: "#1a1a1a",
                padding: "18px 48px",
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.05em",
                marginTop: 8,
              }}
            >
              {t("agendarWhatsApp")}
            </motion.a>

            {/* Toggles */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={toggleTheme} style={{ color: "#666", background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                {theme === "dark" ? "☀" : "◐"}
              </button>
              <span style={{ color: "#C9A84C" }}>|</span>
              {locales.map((loc, i) => (
                <span key={loc.code} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => { changeLocale(loc.code); setMenuOpen(false); }}
                    style={{
                      background: "none",
                      border: "none",
                      color: locale === loc.code ? "#fff" : "rgba(255,255,255,0.35)",
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {loc.label}
                  </button>
                  {i < locales.length - 1 && <span style={{ color: "#C9A84C" }}>·</span>}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
