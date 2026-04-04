"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { appConfig } from "@/lib/config";
import { getClients, normalizePhoneToWhatsApp } from "@/lib/storage";
import type { Client } from "@/types";

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    void getClients().then(setClients);
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
        <Link href={appConfig.routes.newClient} className="btn-primary">
          Novo cliente
        </Link>
      </div>

      <ul className="space-y-3">
        {clients.map((client) => (
          <li key={client.id} className="card">
            <p className="font-semibold text-foreground">{client.name}</p>
            <p className="text-sm text-muted-foreground">{client.phone}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/clientes/${client.id}`} className="nav-link">
                Ver detalhe
              </Link>
              <a href={`https://wa.me/${normalizePhoneToWhatsApp(client.phone)}`} target="_blank" rel="noreferrer" className="nav-link">
                WhatsApp
              </a>
            </div>
          </li>
        ))}
      </ul>

      {clients.length === 0 ? <p className="text-muted-foreground">Ainda não existem clientes.</p> : null}
    </section>
  );
}
