import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[#E8D8C3] bg-[#FAF7F2] px-4 py-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-primary">Querido Lar CRM</h1>
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link href="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link href="/clientes/novo" className="nav-link">
            Novo cliente
          </Link>
          <Link href="/medicoes/nova" className="nav-link">
            Nova medição
          </Link>
          <Link href="/orcamentos/novo" className="nav-link">
            Novo orçamento
          </Link>
        </nav>
      </div>
    </header>
  );
}
