"use client";

import { useEffect, useState } from "react";

type BusinessStatus = {
  isOpen: boolean;
  label: string;
  nextInfo: string;
};

// Horário: Terça(2) a Sábado(6), 9h às 19h — Fuso: America/Sao_Paulo
function getStatus(): BusinessStatus {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
  const day = now.getDay(); // 0=Dom, 1=Seg, 2=Ter, ..., 6=Sab
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;
  const openMinutes = 9 * 60;   // 9h00
  const closeMinutes = 19 * 60; // 19h00

  const isWorkday = day >= 2 && day <= 6; // Ter a Sab
  const isInHours = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  const isOpen = isWorkday && isInHours;

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  if (isOpen) {
    const remaining = closeMinutes - currentMinutes;
    const hours = Math.floor(remaining / 60);
    const mins = remaining % 60;
    const closeStr = hours > 0 ? `${hours}h${mins > 0 ? mins + "min" : ""}` : `${mins}min`;
    return {
      isOpen: true,
      label: "Aberto agora",
      nextInfo: `Fecha em ${closeStr}`,
    };
  }

  // Próxima abertura
  let daysUntilOpen = 0;
  let nextDay = day;
  for (let i = 1; i <= 7; i++) {
    nextDay = (day + i) % 7;
    if (nextDay >= 2 && nextDay <= 6) {
      daysUntilOpen = i;
      break;
    }
  }

  if (isWorkday && currentMinutes < openMinutes) {
    return {
      isOpen: false,
      label: "Fechado",
      nextInfo: "Abre hoje às 9h",
    };
  }

  if (daysUntilOpen === 1) {
    return {
      isOpen: false,
      label: "Fechado",
      nextInfo: `Abre amanhã às 9h`,
    };
  }

  return {
    isOpen: false,
    label: "Fechado",
    nextInfo: `Abre ${dayNames[nextDay]} às 9h`,
  };
}

export function useBusinessHours(): BusinessStatus {
  const [status, setStatus] = useState<BusinessStatus>(() => getStatus());

  useEffect(() => {
    // Atualiza a cada minuto
    const interval = setInterval(() => {
      setStatus(getStatus());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}

