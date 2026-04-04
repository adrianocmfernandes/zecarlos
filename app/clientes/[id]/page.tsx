"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { PIPELINE_STAGE_LABELS, type Measurement, type Opportunity, type Quote, type Task } from "@/types";

export default function ClienteDetalhePage() {
  const params = useParams<{ id: string }>();
  const [client, setClient] = useState<Awaited<ReturnType<typeof getClientById>>>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);

  async function loadAll() {
    const clientData = await getClientById(params.id);
    setClient(clientData);

    const [measurementsData, quotesData, opportunitiesData, taskData] = await Promise.all([
      getMeasurements(params.id),
      getQuotes(params.id),
      getOpportunities(),
      getTasks()
    ]);

    const clientOpportunity = opportunitiesData.find((item) => item.client_id === params.id) ?? null;
    setOpportunity(clientOpportunity);
    setMeasurements(measurementsData);
    setQuotes(quotesData);
    setTasks(clientOpportunity ? taskData.filter((task) => task.opportunity_id === clientOpportunity.id) : []);
  }

  useEffect(() => {
    void loadAll();
  }, [params.id]);

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
                  onClick={async () => {
                    await toggleTaskDone(task.id, true);
                    await loadAll();
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
