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
import { getHeroVideos, getMediaBySection } from "@/lib/media";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";

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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    { video1, video2 },
    sobreMedia,
    espacoMedia,
    trabalhoMedia,
    cursosMedia,
    services,
    testimonials,
  ] = await Promise.all([
    getHeroVideos(),
    getMediaBySection("sobre"),
    getMediaBySection("galeria-espaco"),
    getMediaBySection("galeria-trabalho"),
    getMediaBySection("cursos"),
    fetchServices(),
    fetchTestimonials(),
  ]);

  const sobreVideo = sobreMedia[0]?.signedUrl ?? "";
  const cursosImage = cursosMedia[0]?.signedUrl ?? "";

  return (
    <>
      <SplashScreen />
      <Header locale={locale} />
      <main>
        <Hero video1={video1} video2={video2} />
        <Sobre videoUrl={sobreVideo} />
        <Servicos data={services} />
        <Diferenciais />
        <Galeria espaco={espacoMedia} trabalho={trabalhoMedia} />
        <Depoimentos data={testimonials} />
        <InstagramFeed />
        <CursosHome imageUrl={cursosImage} />
        <MapaSection />
      </main>
      <Footer />
      <WhatsAppFloat />
      <LgpdBanner />
      <SectionTitleObserver />
    </>
  );
}
