"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { appConfig } from "@/lib/config";
import {
  addTask,
  getActivityLogs,
  getClients,
  getOpportunities,
  getQuotes,
  getTasks,
  toggleTaskDone
} from "@/lib/storage";
import {
  PIPELINE_STAGE_LABELS,
  PIPELINE_STAGES,
  type ActivityLog,
  type Client,
  type Opportunity,
  type Quote,
  type Task
} from "@/types";

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </article>
  );
}

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "agora mesmo";
  if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `há ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `há ${Math.floor(seconds / 86400)}d`;
  return new Date(dateString).toLocaleDateString("pt-PT");
}

const ACTIVITY_ICONS: Record<string, string> = {
  client_added: "+",
  deal_added: "◆",
  deal_moved: "→",
  measurement_added: "⬜",
  quote_added: "▤"
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  async function reloadData() {
    const [clientsData, quotesData, opportunitiesData, tasksData, logsData] = await Promise.all([
      getClients(),
      getQuotes(),
      getOpportunities(),
      getTasks(),
      getActivityLogs(10)
    ]);
    setClients(clientsData);
    setQuotes(quotesData);
    setOpportunities(opportunitiesData);
    setTasks(tasksData);
    setActivityLogs(logsData);
  }

  useEffect(() => {
    void reloadData();
  }, []);

  const conversionRate = useMemo(() => {
    const considered = opportunities.filter((item) => item.stage !== "LEAD_RECEBIDO");
    if (considered.length === 0) return 0;
    const won = considered.filter((item) => item.stage === "GANHOU").length;
    return (won / considered.length) * 100;
  }, [opportunities]);

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return opportunities
      .filter((item) => item.stage === "GANHOU")
      .filter((item) => {
        const created = new Date(item.created_at);
        return created.getMonth() === month && created.getFullYear() === year;
      })
      .reduce((total, item) => total + Number(item.estimated_value ?? 0), 0);
  }, [opportunities]);

  const averageAcceptedQuote = useMemo(() => {
    const accepted = quotes.filter((quote) => quote.status === "aceite");
    if (accepted.length === 0) return 0;
    const total = accepted.reduce((sum, quote) => {
      const latest = quote.versions.at(-1);
      const linesTotal = (latest?.data.lines ?? []).reduce(
        (lineSum, line) => lineSum + line.quantity * line.unit_price,
        0
      );
      return sum + linesTotal;
    }, 0);
    return total / accepted.length;
  }, [quotes]);

  const todayTasks = useMemo(() => {
    const todayString = new Date().toISOString().slice(0, 10);
    return tasks
      .filter((task) => !task.done)
      .filter((task) => task.due_date <= todayString)
      .sort((a, b) => a.due_date.localeCompare(b.due_date));
  }, [tasks]);

  const upcomingInstallations = useMemo(
    () =>
      opportunities
        .filter((item) => item.stage === "INSTALACAO_AGENDADA")
        .sort((a, b) => {
          const dateA = a.installation_date ?? a.updated_at;
          const dateB = b.installation_date ?? b.updated_at;
          return dateA.localeCompare(dateB);
        })
        .slice(0, 5),
    [opportunities]
  );

  // Mini pipeline: deals per stage with total value
  const stageStats = useMemo(() => {
    return PIPELINE_STAGES.map((stage) => {
      const ops = opportunities.filter((o) => o.stage === stage);
      return {
        stage,
        count: ops.length,
        total: ops.reduce((s, o) => s + Number(o.estimated_value ?? 0), 0)
      };
    });
  }, [opportunities]);

  function getClientName(clientId: string) {
    return clients.find((c) => c.id === clientId)?.name ?? "Cliente";
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Metrics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard label="Taxa de conversão" value={`${conversionRate.toFixed(1)}%`} />
        <MetricCard label="Receita mensal" value={`${monthlyRevenue.toFixed(2)} €`} />
        <MetricCard label="Valor médio orçamento aceite" value={`${averageAcceptedQuote.toFixed(2)} €`} />
      </section>

      {/* Quick actions */}
      <section className="card">
        <h2 className="text-lg font-semibold text-foreground">Ações rápidas</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link href={appConfig.routes.pipeline} className="btn-primary text-center">
            Pipeline
          </Link>
          <Link href={appConfig.routes.clients} className="btn-primary text-center">
            Clientes
          </Link>
          <Link href={appConfig.routes.newMeasurement} className="btn-primary text-center">
            Nova medição
          </Link>
          <Link href={appConfig.routes.newQuote} className="btn-primary text-center">
            Novo orçamento
          </Link>
        </div>
      </section>

      {/* Mini pipeline summary */}
      <section className="card overflow-x-auto">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Pipeline — resumo</h2>
          <Link href={appConfig.routes.pipeline} className="nav-link text-sm">
            Ver completo
          </Link>
        </div>
        <div className="flex gap-2" style={{ minWidth: `${PIPELINE_STAGES.length * 100}px` }}>
          {stageStats.map(({ stage, count, total }) => (
            <div
              key={stage}
              className="flex flex-1 flex-col items-center rounded-2xl bg-background px-2 py-3 text-center"
            >
              <p className="text-xs font-semibold text-foreground">{count}</p>
              <p className="mt-0.5 text-xs leading-tight text-muted-foreground">
                {PIPELINE_STAGE_LABELS[stage]}
              </p>
              {total > 0 ? (
                <p className="mt-1 text-xs font-medium text-foreground">{total.toFixed(0)} €</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Tasks + Upcoming installations */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Tarefas do dia</h2>
            <button type="button" className="nav-link" onClick={() => setShowTaskForm((v) => !v)}>
              Adicionar
            </button>
          </div>

          {showTaskForm ? (
            <form
              className="mb-3 space-y-2"
              action={async (formData) => {
                await addTask({
                  label: String(formData.get("label") || ""),
                  due_date: String(formData.get("due_date") || ""),
                  opportunity_id: String(formData.get("opportunity_id") || "") || undefined
                });
                setShowTaskForm(false);
                await reloadData();
              }}
            >
              <input name="label" required placeholder="Descrição da tarefa" className="input" />
              <input name="due_date" type="date" required className="input" />
              <select name="opportunity_id" className="input">
                <option value="">Sem oportunidade associada</option>
                {opportunities.map((opp) => (
                  <option value={opp.id} key={opp.id}>
                    {getClientName(opp.client_id)} — {opp.description}
                  </option>
                ))}
              </select>
              <button className="btn-primary w-full" type="submit">
                Guardar tarefa
              </button>
            </form>
          ) : null}

          <ul className="space-y-2 text-sm">
            {todayTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between rounded-2xl bg-card p-3">
                <div>
                  <p className="text-foreground">{task.label}</p>
                  <p className="text-muted-foreground">
                    Prazo: {new Date(task.due_date).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <button
                  type="button"
                  className="nav-link"
                  onClick={async () => {
                    await toggleTaskDone(task.id, true);
                    await reloadData();
                  }}
                >
                  Concluir
                </button>
              </li>
            ))}
            {todayTasks.length === 0 ? (
              <li className="text-muted-foreground">Sem tarefas pendentes para hoje.</li>
            ) : null}
          </ul>
        </article>

        <article className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Próximas instalações</h2>
            <Link href={appConfig.routes.agenda} className="nav-link text-sm">
              Ver agenda
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {upcomingInstallations.map((opp) => (
              <li key={opp.id} className="rounded-2xl bg-card p-3">
                <p className="font-semibold text-foreground">{getClientName(opp.client_id)}</p>
                <p className="text-muted-foreground">{opp.description}</p>
                <p className="text-muted-foreground">
                  Data prevista:{" "}
                  {opp.installation_date
                    ? new Date(opp.installation_date).toLocaleDateString("pt-PT")
                    : "Por definir"}
                </p>
              </li>
            ))}
            {upcomingInstallations.length === 0 ? (
              <li className="text-muted-foreground">Sem instalações agendadas.</li>
            ) : null}
          </ul>
        </article>
      </section>

      {/* Activity feed */}
      <section className="card">
        <h2 className="text-lg font-semibold text-foreground">Atividade recente</h2>
        {activityLogs.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Sem atividade registada.{" "}
            <span className="text-xs">
              (Requer a tabela <code>activity_logs</code> no Supabase)
            </span>
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {activityLogs.map((log) => (
              <li key={log.id} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                  {ACTIVITY_ICONS[log.type] ?? "·"}
                </span>
                <div className="flex-1">
                  <p className="text-foreground">{log.description}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(log.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
