const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://naiaracolin.com.br";

export function getBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "BeautySalon"],
    name: "Naiara Colin Espaço de Beleza",
    image: `${siteUrl}/og/default.png`,
    url: siteUrl,
    telephone: "+5547997923415",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua 1500, 397",
      addressLocality: "Balneário Camboriú",
      addressRegion: "SC",
      postalCode: "88330-000",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -26.9905,
      longitude: -48.6348,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/naiaracolin_salao",
      "https://wa.me/5547997923415",
    ],
    hasMap:
      "https://maps.google.com/?q=Rua+1500+397+Balneario+Camboriu+SC",
  };
}
