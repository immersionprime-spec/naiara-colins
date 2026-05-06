"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { activeSectionStore } from "@/lib/activeSectionStore";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useState } from "react";

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.843L.057 23.27a.75.75 0 00.92.92l5.427-1.453A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.73 9.73 0 01-5.03-1.392l-.361-.214-3.743 1.002 1.002-3.743-.214-.361A9.73 9.73 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

export default function WhatsAppFloat() {
  const reducedMotion = useReducedMotion();
  const [show, setShow] = useState(false);
  const [activeSection, setActiveSection] = useState(activeSectionStore.get());

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return activeSectionStore.subscribe(setActiveSection);
  }, []);

  function getContextualLink(section: string): string {
    const base = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5547997923415"}`;
    const messages: Record<string, string> = {
      galeria: "Olá, Nay! Vi a galeria de trabalhos no site e adorei. Gostaria de agendar.",
      depoimentos: "Olá, Nay! Li os depoimentos e gostaria de agendar minha experiência.",
      servicos: "Olá, Nay! Vi os serviços no site e gostaria de saber mais.",
      cursos: "Olá! Tenho interesse em saber mais sobre os cursos.",
      sobre: "Olá, Nay! Adorei conhecer sua história. Gostaria de agendar.",
    };
    const message = messages[section] ?? "Olá, Nay! Vi o site e gostaria de agendar.";
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  const handleClick = () => {
    trackWhatsAppClick("flutuante");
    window.open(getContextualLink(activeSection), "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="wa-float"
          aria-label="Agendar pelo WhatsApp"
          onClick={handleClick}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.1, 1] }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="whatsapp-float"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#25D366",
            border: "2px solid #C9A84C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "url('/cursors/dot-gold.svg') 8 8, pointer",
          }}
        >
          <WhatsAppIcon />
          <style>{`
            @keyframes waPulse {
              0% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
              70% { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
              100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
            }
            ${!reducedMotion ? '.whatsapp-float { animation: waPulse 3s infinite; }' : ''}
            .whatsapp-float:hover { animation: none; }
          `}</style>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
