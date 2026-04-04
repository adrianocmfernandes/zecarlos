import Link from "next/link";
import { appConfig } from "@/lib/config";

const NAV_ITEMS = [
  { href: appConfig.routes.dashboard, label: "Dashboard" },
  { href: appConfig.routes.newClient, label: "Novo cliente" },
  { href: appConfig.routes.newMeasurement, label: "Nova medição" },
  { href: appConfig.routes.newQuote, label: "Novo orçamento" }
] as const;

export function Header() {
  return (
    <header className="bg-[#E8D8C3] px-4 py-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-primary">{appConfig.appName}</h1>
        <nav className="flex flex-wrap gap-2 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
