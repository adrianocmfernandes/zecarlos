"use client";

import { useEffect, useMemo, useState } from "react";
import { getClients, getOpportunities } from "@/lib/storage";
import { PIPELINE_STAGE_LABELS, type Client, type Opportunity } from "@/types";

type AgendaItem = {
  id: string;
  clientName: string;
  description: string;
  type: "visita" | "instalação";
  date: string | null; // ISO date string or null
  stage: Opportunity["stage"];
};

function dateLabel(dateStr: string | null): string {
  if (!dateStr) return "Sem data definida";
  return new Date(dateStr).toLocaleDateString("pt-PT", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function groupLabel(dateStr: string | null): string {
  if (!dateStr) return "Sem data";
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((date.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return "Em atraso";
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff <= 7) return "Esta semana";
  if (diff <= 30) return "Este mês";
  return "Mais tarde";
}

const GROUP_ORDER = ["Em atraso", "Hoje", "Amanhã", "Esta semana", "Este mês", "Mais tarde", "Sem data"];

export default function AgendaPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    void Promise.all([getClients(), getOpportunities()]).then(([c, o]) => {
      setClients(c);
      setOpportunities(o);
    });
  }, []);

  function getClientName(clientId: string) {
    return clients.find((c) => c.id === clientId)?.name ?? "Cliente";
  }

  const items: AgendaItem[] = useMemo(() => {
    const visits = opportunities
      .filter((o) => o.stage === "VISITA_AGENDADA")
      .map((o) => ({
        id: o.id,
        clientName: getClientName(o.client_id),
        description: o.description,
        type: "visita" as const,
        date: o.updated_at?.slice(0, 10) ?? null,
        stage: o.stage
      }));

    const installs = opportunities
      .filter((o) => o.stage === "INSTALACAO_AGENDADA")
      .map((o) => ({
        id: o.id,
        clientName: getClientName(o.client_id),
        description: o.description,
        type: "instalação" as const,
        date: o.installation_date ?? null,
        stage: o.stage
      }));

    return [...visits, ...installs].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  }, [opportunities, clients]);

  const grouped = useMemo(() => {
    const map = new Map<string, AgendaItem[]>();
    for (const item of items) {
      const label = groupLabel(item.date);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(item);
    }
    // Sort groups by GROUP_ORDER
    return GROUP_ORDER.flatMap((label) => {
      const groupItems = map.get(label);
      if (!groupItems || groupItems.length === 0) return [];
      return [{ label, items: groupItems }];
    });
  }, [items]);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Agenda</h1>
        <p className="text-sm text-muted-foreground">
          {items.length} evento{items.length !== 1 ? "s" : ""} agendado{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      {grouped.length === 0 ? (
        <div className="card">
          <p className="text-muted-foreground">Sem visitas ou instalações agendadas.</p>
        </div>
      ) : null}

      {grouped.map((group) => (
        <section key={group.label} className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {group.label}
          </h2>
          <ul className="space-y-2">
            {group.items.map((item) => (
              <li key={item.id} className="card flex items-start gap-4 p-4">
                {/* Type badge */}
                <div
                  className="mt-0.5 flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    background: item.type === "instalação" ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                    color: item.type === "instalação" ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"
                  }}
                >
                  {item.type === "instalação" ? "Instalação" : "Visita"}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.clientName}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{dateLabel(item.date)}</p>
                </div>

                <span className="mt-0.5 flex-shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {PIPELINE_STAGE_LABELS[item.stage]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
