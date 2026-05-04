const number =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5547997923415";
const BASE_URL = `https://wa.me/${number}`;

export function getWhatsAppLink(
  type: "geral" | "servico" | "cursos",
  serviceName?: string
): string {
  const messages = {
    geral: "Olá, Nay! Vi o site e gostaria de agendar.",
    servico: `Olá! Tenho interesse em ${serviceName ?? "um serviço"}.`,
    cursos: "Olá! Tenho interesse em saber mais sobre os cursos.",
  };
  const message = encodeURIComponent(messages[type]);
  return `${BASE_URL}?text=${message}`;
}
