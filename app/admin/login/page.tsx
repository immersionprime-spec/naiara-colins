"use client";

import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
    setMsg(error ? t("erro") : t("sucesso"));
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
            className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email_placeholder")}
          />
        </label>
        <button
          type="submit"
          className="w-full rounded border border-[#C9A84C] px-4 py-2 font-medium text-[#C9A84C] transition hover:bg-[#C9A84C]/10"
        >
          {t("botao")}
        </button>
      </form>
      {msg ? <p className="mt-4 text-sm text-white/70">{msg}</p> : null}
    </main>
  );
}
