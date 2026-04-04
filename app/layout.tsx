import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.appDescription

export const metadata: Metadata = {
  title: "CRM de Cortinas",
  description: "MVP para gestão comercial de empresa de cortinas"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={appConfig.locale}>
      <body>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
    <html lang="pt-PT">
      <body>
        <Header />
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
