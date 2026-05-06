import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { setRequestLocale } from "next-intl/server";

export default async function PrivacidadePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  return (
    <>
      <Header locale={locale} />
      <main>
        {/* Dark hero */}
        <div style={{
          background: "#0a0a0a",
          padding: "120px var(--section-padding-x) 64px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-h1)",
            color: "#ffffff",
            lineHeight: "var(--leading-snug)",
          }}>
            Política de Privacidade
          </h1>
        </div>

        {/* Light body */}
        <div style={{
          background: "#f5f0eb",
          color: "#1a1a1a",
          padding: "0",
        }}>
          <div style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "clamp(2rem, 5vw, 4rem)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-lg)",
            lineHeight: "var(--leading-loose)",
          }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h2)", marginBottom: 16, color: "#1a1a1a" }}>
              1. Coleta de Dados
            </h2>
            <p style={{ marginBottom: 24 }}>
              O Naiara Colin Espaço de Beleza coleta apenas os dados necessários para prestação de serviços e comunicação com clientes, como nome, e-mail e telefone, fornecidos voluntariamente pelo usuário.
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h2)", marginBottom: 16, color: "#1a1a1a" }}>
              2. Uso dos Dados
            </h2>
            <p style={{ marginBottom: 24 }}>
              Os dados coletados são utilizados exclusivamente para agendamento de serviços, envio de informações relevantes e melhoria da experiência do usuário. Não compartilhamos seus dados com terceiros sem consentimento.
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h2)", marginBottom: 16, color: "#1a1a1a" }}>
              3. Cookies
            </h2>
            <p style={{ marginBottom: 24 }}>
              Utilizamos cookies para melhorar a experiência de navegação e analisar o tráfego do site através do Google Analytics. Você pode recusar cookies nas configurações do seu navegador.
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h2)", marginBottom: 16, color: "#1a1a1a" }}>
              4. Seus Direitos (LGPD)
            </h2>
            <p style={{ marginBottom: 24 }}>
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), você tem direito de acessar, corrigir, excluir ou portar seus dados pessoais. Para exercer esses direitos, entre em contato pelo WhatsApp.
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h2)", marginBottom: 16, color: "#1a1a1a" }}>
              5. Contato
            </h2>
            <p>
              Para dúvidas sobre esta política ou sobre seus dados pessoais, entre em contato: <a href="https://wa.me/5547997923415" style={{ color: "#C9A84C" }}>WhatsApp</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
