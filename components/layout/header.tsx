"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: appConfig.routes.dashboard, label: "Dashboard" },
  { href: appConfig.routes.pipeline, label: "Pipeline" },
  { href: appConfig.routes.clients, label: "Clientes" },
  { href: appConfig.routes.agenda, label: "Agenda" }
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace(appConfig.routes.login);
    router.refresh();
  }

  if (pathname === appConfig.routes.login) {
    return null;
  }

  return (
    <header className="bg-secondary px-4 py-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{appConfig.appName}</h1>
        <nav className="flex flex-wrap gap-2 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname.startsWith(item.href) ? "bg-primary text-primary-foreground" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <button type="button" className="nav-link" onClick={logout}>
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
