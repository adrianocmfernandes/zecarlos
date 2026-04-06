"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { appConfig } from "@/lib/config";
import { getClients, normalizePhoneToWhatsApp } from "@/lib/storage";
import type { Client } from "@/types";

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void getClients().then(setClients);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [clients, search]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
        <Link href={appConfig.routes.newClient} className="btn-primary">
          Novo cliente
        </Link>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar por nome, telefone ou morada…"
        className="input"
      />

      <ul className="space-y-3">
        {filtered.map((client) => (
          <li key={client.id} className="card">
            <p className="font-semibold text-foreground">{client.name}</p>
            <p className="text-sm text-muted-foreground">{client.phone}</p>
            <p className="text-sm text-muted-foreground">{client.address}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/clientes/${client.id}`} className="nav-link">
                Ver detalhe
              </Link>
              <a
                href={`https://wa.me/${normalizePhoneToWhatsApp(client.phone)}`}
                target="_blank"
                rel="noreferrer"
                className="nav-link"
              >
                WhatsApp
              </a>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && clients.length > 0 ? (
        <p className="text-muted-foreground">Nenhum cliente corresponde à pesquisa.</p>
      ) : null}
      {clients.length === 0 ? (
        <p className="text-muted-foreground">Ainda não existem clientes.</p>
      ) : null}
    </section>
  );
}
