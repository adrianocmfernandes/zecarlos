import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Querido Lar CRM",
  description: "CRM local-first para vendas de cortinas e interiores"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
      </body>
    </html>
  );
}
