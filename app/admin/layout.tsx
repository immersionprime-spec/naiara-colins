import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import pt from "../../messages/pt.json";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="pt" messages={pt}>
      <div className="min-h-screen bg-[#0a0a0a] text-white">{children}</div>
    </NextIntlClientProvider>
  );
}
