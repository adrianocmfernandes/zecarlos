"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getClients, getMeasurements, getQuotes } from "@/lib/storage";
import type { Client, Measurement, Quote } from "@/types";

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="card">
      <p className="text-sm text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-primary">{value}</p>
    </article>
  );
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    setClients(getClients());
    setMeasurements(getMeasurements());
    setQuotes(getQuotes());
  }, []);

  const acceptedQuotes = useMemo(() => quotes.filter((quote) => quote.status === "aceite").length, [quotes]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard label="Clientes" value={clients.length} />
        <MetricCard label="Medições" value={measurements.length} />
        <MetricCard label="Orçamentos" value={quotes.length} />
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-primary">Ações rápidas</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/clientes/novo" className="btn-primary text-center">
            Add Client
          </Link>
          <Link href="/medicoes/nova" className="btn-primary text-center">
            Add Measurement
          </Link>
          <Link href="/orcamentos/novo" className="btn-primary text-center">
            Create Quote
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="card">
          <h3 className="text-base font-semibold text-primary">Últimos clientes</h3>
          <ul className="mt-3 space-y-2 text-sm text-secondary">
            {clients.slice(0, 5).map((client) => (
              <li key={client.id} className="rounded-2xl bg-soft px-3 py-2">
                <p className="font-medium text-primary">{client.name}</p>
                <p>{client.phone}</p>
              </li>
            ))}
            {clients.length === 0 ? <li>Nenhum cliente guardado ainda.</li> : null}
          </ul>
        </article>

        <article className="card">
          <h3 className="text-base font-semibold text-primary">Resumo de orçamentos</h3>
          <div className="mt-3 space-y-2 text-sm text-secondary">
            <p>Total: {quotes.length}</p>
            <p>Aceites: {acceptedQuotes}</p>
            <p>Com histórico de versões: {quotes.filter((quote) => quote.versions.length > 1).length}</p>
          </div>
        </article>
      </section>
    </div>
  );
}
