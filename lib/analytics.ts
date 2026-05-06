type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export type WhatsAppSource =
  | "hero"
  | "header"
  | "menu-mobile"
  | "flutuante"
  | "rodape"
  | "cursos"
  | "post-blog"
  | `servico:${string}`;

export function trackWhatsAppClick(source: WhatsAppSource) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "whatsapp_click", {
      source,
      event_category: "engagement",
      event_label: source,
    });
  }
}
