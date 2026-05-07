export const dynamic = "force-dynamic";

import CursosHome from "@/components/sections/CursosHome";
import Depoimentos from "@/components/sections/Depoimentos";
import Diferenciais from "@/components/sections/Diferenciais";
import Galeria from "@/components/sections/Galeria";
import Hero from "@/components/sections/Hero";
import InstagramFeed from "@/components/sections/InstagramFeed";
import MapaSection from "@/components/sections/MapaSection";
import Servicos from "@/components/sections/Servicos";
import Sobre from "@/components/sections/Sobre";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LgpdBanner from "@/components/LgpdBanner";
import SectionTitleObserver from "@/components/SectionTitleObserver";
import SplashScreen from "@/components/SplashScreen";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getMediaBySection } from "@/lib/media";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import { LayoutGroup } from "framer-motion";

type ServiceRow = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
};

type TestimonialRow = {
  id: string;
  name: string;
  photo_url: string | null;
  text: string;
  stars: number;
  order: number;
};

async function fetchServices() {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("services")
      .select("id, category, name, description, icon, order")
      .eq("active", true)
      .order("order", { ascending: true });

    const grouped: { hair: ServiceRow[]; nail: ServiceRow[]; estetica: ServiceRow[] } = {
      hair: [], nail: [], estetica: [],
    };
    for (const row of (data ?? []) as ServiceRow[]) {
      if (row.category in grouped) {
        grouped[row.category as keyof typeof grouped].push(row);
      }
    }
    return grouped;
  } catch {
    return { hair: [] as ServiceRow[], nail: [] as ServiceRow[], estetica: [] as ServiceRow[] };
  }
}

async function fetchTestimonials() {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("testimonials")
      .select("id, name, photo_url, text, stars, order")
      .eq("visible", true)
      .order("order", { ascending: true });
    return (data ?? []) as TestimonialRow[];
  } catch {
    return [] as TestimonialRow[];
  }
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [
    heroMedia,
    sobreMedia,
    cursosMedia,
    services,
    testimonials,
  ] = await Promise.all([
    getMediaBySection("hero"),
    getMediaBySection("sobre"),
    getMediaBySection("cursos"),
    fetchServices(),
    fetchTestimonials(),
  ]);

  const cursosImage = cursosMedia[0]?.signedUrl ?? "";

  const heroPrimary   = heroMedia.find((v) => v.is_primary) ?? heroMedia[0] ?? null;
  const heroSecondary = heroMedia.find((v) => !v.is_primary && v.id !== heroPrimary?.id) ?? null;
  const sobreVideo    = sobreMedia[0] ?? null;

  return (
    <LayoutGroup id="nc-crown">
      <SplashScreen />
      <Header locale={locale} />
      <main>
        <Hero
          primaryVideo={heroPrimary ? { signedUrl: heroPrimary.signedUrl ?? "", is_primary: true } : null}
          secondaryVideo={heroSecondary ? { signedUrl: heroSecondary.signedUrl ?? "", is_primary: false } : null}
        />
        <Sobre
          videoUrl={sobreVideo?.signedUrl ?? ""}
        />
        <Servicos data={services} />
        <Diferenciais />
        <Galeria />
        <Depoimentos data={testimonials} />
        <InstagramFeed />
        <CursosHome imageUrl={cursosImage} />
        <MapaSection />
      </main>
      <Footer />
      <WhatsAppFloat />
      <LgpdBanner />
      <SectionTitleObserver />
    </LayoutGroup>
  );
}
