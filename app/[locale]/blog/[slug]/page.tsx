import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PostCTA from "@/components/PostCTA";
import ShareButton from "@/components/ShareButton";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Link } from "@/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type PostDetail = {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_url: string | null;
  published_at: string | null;
};

export async function generateStaticParams() {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";
  try {
    const res = await fetch(`${base}/api/posts?language=pt`, { cache: "no-store" });
    if (!res.ok) return [];
    const posts = await res.json();
    if (!Array.isArray(posts)) return [];
    return posts.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

async function fetchPost(slug: string, locale: string): Promise<PostDetail | null> {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";
  try {
    const res = await fetch(`${base}/api/posts/${slug}?language=${locale}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const post = await fetchPost(slug, locale);
  if (!post) notFound();

  return (
    <>
      <Header locale={locale} />
      <article>
        {/* Dark hero */}
        <header style={{
          background: "#0a0a0a",
          position: "relative",
          minHeight: "60vh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}>
          {post.cover_url && (
            <img
              src={post.cover_url}
              alt={post.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}
            />
          )}
          <div style={{ position: "relative", zIndex: 1, padding: "80px var(--section-padding-x) 48px", width: "100%" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-h1)", color: "#C9A84C", lineHeight: "var(--leading-snug)", maxWidth: "720px" }}>
              {post.title}
            </h1>
            {post.excerpt && (
              <p style={{ marginTop: 16, fontFamily: "var(--font-sans)", fontSize: "var(--text-body-lg)", color: "rgba(255,255,255,0.7)", maxWidth: "600px" }}>
                {post.excerpt}
              </p>
            )}
          </div>
        </header>

        {/* Light body — invariant */}
        <div style={{ background: "#f5f0eb", color: "#1a1a1a" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem)", position: "relative" }}>
            <ShareButton title={post.title} />
            <Link href="/blog" style={{ display: "inline-block", marginBottom: 32, fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", color: "#C9A84C", textDecoration: "none" }}>
              ← {t("voltar")}
            </Link>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-lg)", lineHeight: "var(--leading-loose)", color: "#1a1a1a", whiteSpace: "pre-line" }}>
              {post.body}
            </div>
          </div>

          {/* Client CTA — translated + analytics */}
          <PostCTA />
        </div>
      </article>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
