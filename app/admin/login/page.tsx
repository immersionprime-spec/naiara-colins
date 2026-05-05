"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErro(t("erro"));
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="font-serif text-4xl text-[#C9A84C]">{t("titulo")}</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm text-white/80">
          <span>{t("email_label")}</span>
          <input
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email_placeholder")}
          />
        </label>
        <label className="block text-sm text-white/80">
          <span>{t("senha_label")}</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded border border-[#C9A84C] px-4 py-2 font-medium text-[#C9A84C] transition hover:bg-[#C9A84C]/10 disabled:opacity-50"
        >
          {loading ? t("carregando") : t("botao")}
        </button>
      </form>
      {erro && <p className="mt-4 text-sm text-red-400">{erro}</p>}
    </main>
  );
}
