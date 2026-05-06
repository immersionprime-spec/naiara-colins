import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Link } from "@/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

type PostListItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
};

async function fetchPosts(locale: string): Promise<PostListItem[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";
  try {
    const res = await fetch(`${base}/api/posts?language=${locale}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function BlogListPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = await fetchPosts(locale);

  return (
    <>
      <Header locale={locale} />
      <main style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: 120 }}>
        <div style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 var(--section-padding-x)",
          paddingBottom: "var(--section-gap)",
        }}>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-h1)",
            color: "#C9A84C",
            marginBottom: 64,
          }}>
            {t("titulo")}
          </h1>

          {posts.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>
              {t("empty")}
            </p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--card-gap)",
            }}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <article style={{
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--card-radius)",
                    overflow: "hidden",
                    transition: "border-color 200ms, transform 200ms",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {post.cover_url && (
                      <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "#111" }}>
                        <img
                          src={post.cover_url}
                          alt={post.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div style={{ padding: "var(--card-padding)" }}>
                      <h2 style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "var(--text-h3)",
                        color: "var(--color-text)",
                        marginBottom: 8,
                      }}>
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-body-sm)",
                          color: "var(--color-text-muted)",
                          lineHeight: "var(--leading-normal)",
                        }}>
                          {post.excerpt}
                        </p>
                      )}
                      {post.published_at && (
                        <p style={{
                          marginTop: 12,
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-caption)",
                          color: "var(--color-text-muted)",
                        }}>
                          {new Date(post.published_at).toLocaleDateString(locale === "pt" ? "pt-BR" : locale)}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
