type WhatsAppType = "geral" | "servico" | "cursos";

const number =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5547997923415";
const BASE_URL = `https://wa.me/${number}`;

const MESSAGES: Record<string, Record<WhatsAppType, string>> = {
  pt: {
    geral:   "Olá, Nay! Vi o site e gostaria de agendar.",
    servico: "Olá! Tenho interesse em {servico}.",
    cursos:  "Olá! Tenho interesse em saber mais sobre os cursos.",
  },
  es: {
    geral:   "¡Hola, Nay! Vi el sitio web y me gustaría hacer una cita.",
    servico: "¡Hola! Estoy interesada en {servico}.",
    cursos:  "¡Hola! Me gustaría saber más sobre los cursos.",
  },
  en: {
    geral:   "Hello, Nay! I saw the website and I'd like to book an appointment.",
    servico: "Hello! I'm interested in {servico}.",
    cursos:  "Hello! I'd like to know more about the courses.",
  },
};

function getLocale(): string {
  if (typeof window === "undefined") return "pt";
  return localStorage.getItem("nc_locale") ?? "pt";
}

export function getWhatsAppLink(
  type: WhatsAppType,
  serviceName?: string
): string {
  const locale = getLocale();
  const dict = MESSAGES[locale] ?? MESSAGES["pt"];
  const template = dict[type];
  const text = type === "servico"
    ? template.replace("{servico}", serviceName ?? "um serviço")
    : template;
  return `${BASE_URL}?text=${encodeURIComponent(text)}`;
}
