"use client";

import { useEffect } from "react";

const SECTION_TITLES: Record<string, string> = {
  inicio: "Naiara Colin Espaço de Beleza",
  sobre: "Sobre | Naiara Colin",
  servicos: "Serviços | Naiara Colin",
  galeria: "Galeria | Naiara Colin",
  depoimentos: "Depoimentos | Naiara Colin",
  cursos: "Cursos | Naiara Colin",
  mapa: "Localização | Naiara Colin",
};

export function useActiveSectionTitle() {
  useEffect(() => {
    const sections = Object.keys(SECTION_TITLES)
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observers: IntersectionObserver[] = [];

    sections.forEach((el) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            document.title = SECTION_TITLES[el.id] ?? "Naiara Colin Espaço de Beleza";
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);
}
