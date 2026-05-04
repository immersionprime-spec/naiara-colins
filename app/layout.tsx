import "./globals.css";

import { getBusinessSchema } from "@/lib/schema";
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

const site = "https://naiaracolin.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || site
  ),
  title: "Naiara Colin Espaço de Beleza",
  description: "Salão de beleza premium em Balneário Camboriú, SC.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="pt-BR" href={`${site}/`} />
        <link rel="alternate" hrefLang="es" href={`${site}/es`} />
        <link rel="alternate" hrefLang="en" href={`${site}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${site}/`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getBusinessSchema()),
          }}
        />
        {/* Theme init — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var stored = localStorage.getItem('nc_theme');
                var preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.dataset.theme = preferred;
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
