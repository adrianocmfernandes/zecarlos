import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white p-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-lg font-semibold">CRM Cortinas</h1>
        <nav className="flex gap-3 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/clientes/novo">Novo cliente</Link>
          <Link href="/medicoes/nova">Nova medição</Link>
          <Link href="/orcamentos/novo">Novo orçamento</Link>
        </nav>
      </div>
    </header>
  );
}
