"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getClientById,
  getMeasurements,
  getOpportunities,
  getQuotes,
  getTasks,
  normalizePhoneToWhatsApp,
  toggleTaskDone
} from "@/lib/storage";
import { PIPELINE_STAGE_LABELS } from "@/types";

export default function ClienteDetalhePage() {
  const params = useParams<{ id: string }>();
  const [reloadTick, setReloadTick] = useState(0);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);

  const client = useMemo(() => getClientById(params.id), [params.id, reloadTick]);
  const measurements = useMemo(() => getMeasurements().filter((item) => item.client_id === params.id), [params.id, reloadTick]);
  const quotes = useMemo(() => getQuotes().filter((item) => item.client_id === params.id), [params.id, reloadTick]);
  const opportunity = useMemo(() => getOpportunities().find((item) => item.client_id === params.id) ?? null, [params.id, reloadTick]);
  const tasks = useMemo(() => {
    const taskPool = getTasks();
    if (!opportunity) return [];
    return taskPool.filter((task) => task.opportunity_id === opportunity.id);
  }, [opportunity, reloadTick]);

  if (!client) {
    return <p className="text-muted-foreground">Cliente não encontrado.</p>;
  }

  return (
    <section className="space-y-4">
      <header className="card space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{client.name}</h1>
        <p className="text-muted-foreground">{client.phone}</p>
        <p className="text-muted-foreground">{client.address}</p>
        <a href={`https://wa.me/${normalizePhoneToWhatsApp(client.phone)}`} target="_blank" rel="noreferrer" className="btn-primary inline-block text-center">
          Contactar por WhatsApp
        </a>
      </header>

      <article className="card">
        <h2 className="font-semibold text-foreground">Pipeline</h2>
        <p className="text-muted-foreground">{opportunity ? PIPELINE_STAGE_LABELS[opportunity.stage] : "Sem oportunidade"}</p>
      </article>

      <article className="card">
        <h2 className="font-semibold text-foreground">Medições</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {measurements.map((measurement) => (
            <li key={measurement.id} className="rounded-2xl bg-card p-3">
              <p className="font-medium text-foreground">{measurement.room}</p>
              <p>{measurement.dimensions}</p>
              <p>{measurement.notes}</p>
            </li>
          ))}
          {measurements.length === 0 ? <li>Sem medições registadas.</li> : null}
        </ul>
      </article>

      <article className="card">
        <h2 className="font-semibold text-foreground">Orçamentos</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {quotes.map((quote) => {
            const latestVersion = quote.versions.at(-1);
            const isOpen = expandedQuoteId === quote.id;
            return (
              <li key={quote.id} className="rounded-2xl bg-card p-3">
                <p className="font-medium text-foreground">{latestVersion?.data.title || "Orçamento"}</p>
                <p>Estado: {quote.status}</p>
                <p>Versão atual: {latestVersion?.version}</p>
                <button
                  type="button"
                  className="mt-2 nav-link"
                  onClick={() => setExpandedQuoteId(isOpen ? null : quote.id)}
                >
                  {isOpen ? "Esconder histórico" : "Ver histórico"}
                </button>
                {isOpen ? (
                  <ul className="mt-2 space-y-1">
                    {quote.versions
                      .slice()
                      .reverse()
                      .map((version) => (
                        <li key={version.version}>v{version.version} — {new Date(version.created_at).toLocaleDateString("pt-PT")}</li>
                      ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
          {quotes.length === 0 ? <li>Sem orçamentos registados.</li> : null}
        </ul>
      </article>

      <article className="card">
        <h2 className="font-semibold text-foreground">Tarefas</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between rounded-2xl bg-card p-3">
              <span className={task.done ? "line-through" : ""}>{task.label}</span>
              {!task.done ? (
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => {
                    toggleTaskDone(task.id, true);
                    setReloadTick((value) => value + 1);
                  }}
                >
                  Concluir
                </button>
              ) : null}
            </li>
          ))}
          {tasks.length === 0 ? <li>Sem tarefas para este cliente.</li> : null}
        </ul>
      </article>

      <Link href="/clientes" className="nav-link inline-block">
        Voltar aos clientes
      </Link>
    </section>
  );
}
