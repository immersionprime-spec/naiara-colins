"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Particle {
  id: number;
  cx: string;
  cy: string;
  r: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

// Partículas geradas de forma determinística (sem Math.random em SSR)
const PARTICLES: Particle[] = [
  { id: 1, cx: "8%", cy: "20%", r: 1, opacity: 0.25, duration: 8, delay: 0, driftX: 15, driftY: -20 },
  { id: 2, cx: "23%", cy: "65%", r: 1.5, opacity: 0.2, duration: 11, delay: 1.5, driftX: -12, driftY: -25 },
  { id: 3, cx: "37%", cy: "40%", r: 1, opacity: 0.3, duration: 9, delay: 3, driftX: 18, driftY: -15 },
  { id: 4, cx: "52%", cy: "75%", r: 2, opacity: 0.15, duration: 13, delay: 0.5, driftX: -10, driftY: -30 },
  { id: 5, cx: "68%", cy: "30%", r: 1, opacity: 0.25, duration: 10, delay: 2, driftX: 12, driftY: -18 },
  { id: 6, cx: "80%", cy: "55%", r: 1.5, opacity: 0.2, duration: 12, delay: 4, driftX: -15, driftY: -22 },
  { id: 7, cx: "15%", cy: "85%", r: 1, opacity: 0.18, duration: 14, delay: 1, driftX: 20, driftY: -28 },
  { id: 8, cx: "45%", cy: "15%", r: 1.5, opacity: 0.22, duration: 9, delay: 2.5, driftX: -8, driftY: -20 },
  { id: 9, cx: "72%", cy: "80%", r: 1, opacity: 0.25, duration: 11, delay: 0.8, driftX: 14, driftY: -16 },
  { id: 10, cx: "90%", cy: "45%", r: 2, opacity: 0.15, duration: 15, delay: 3.5, driftX: -18, driftY: -24 },
  { id: 11, cx: "30%", cy: "90%", r: 1, opacity: 0.2, duration: 10, delay: 1.2, driftX: 10, driftY: -30 },
  { id: 12, cx: "60%", cy: "50%", r: 1, opacity: 0.18, duration: 12, delay: 4.5, driftX: -14, driftY: -18 },
];

export default function GoldParticles() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      <style>{`
        ${PARTICLES.map(
          (p) => `
          @keyframes float-${p.id} {
            0%   { transform: translate(0, 0) scale(1); opacity: ${p.opacity}; }
            33%  { transform: translate(${p.driftX * 0.5}px, ${p.driftY * 0.4}px) scale(1.1); opacity: ${p.opacity * 1.3}; }
            66%  { transform: translate(${p.driftX}px, ${p.driftY}px) scale(0.9); opacity: ${p.opacity * 0.7}; }
            100% { transform: translate(${p.driftX * 0.3}px, ${p.driftY * 1.5}px) scale(1); opacity: 0; }
          }
        `
        ).join("")}
      `}</style>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {PARTICLES.map((p) => (
          <circle
            key={p.id}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#C9A84C"
            style={{
              animation: `float-${p.id} ${p.duration}s ${p.delay}s ease-in-out infinite`,
              transformOrigin: `${p.cx} ${p.cy}`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

