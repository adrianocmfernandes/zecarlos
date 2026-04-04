"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { appConfig } from "@/lib/config";
import {
  addTask,
  getClients,
  getOpportunities,
  getQuotes,
  getTasks,
  toggleTaskDone,
  updateOpportunity
} from "@/lib/storage";
import { PIPELINE_STAGE_LABELS, PIPELINE_STAGES, type Client, type Opportunity, type Quote, type Task } from "@/types";

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </article>
  );
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  async function reloadData() {
    const [clientsData, quotesData, opportunitiesData, tasksData] = await Promise.all([
      getClients(),
      getQuotes(),
      getOpportunities(),
      getTasks()
    ]);

    setClients(clientsData);
    setQuotes(quotesData);
    setOpportunities(opportunitiesData);
    setTasks(tasksData);
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
        .sort((a, b) => a.updated_at.localeCompare(b.updated_at))
        .slice(0, 5),
    [opportunities]
  );

  function getClientName(clientId: string) {
    return clients.find((client) => client.id === clientId)?.name ?? "Cliente";
  }

  return (
    <div className="space-y-6 pb-4">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard label="Taxa de conversão" value={`${conversionRate.toFixed(1)}%`} />
        <MetricCard label="Receita mensal" value={`${monthlyRevenue.toFixed(2)} €`} />
        <MetricCard label="Valor médio orçamento aceite" value={`${averageAcceptedQuote.toFixed(2)} €`} />
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-foreground">Ações rápidas</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

      <section className="card overflow-x-auto">
        <h2 className="text-lg font-semibold text-foreground">Pipeline comercial</h2>
        <div className="mt-4 grid min-w-[980px] grid-cols-10 gap-3">
          {PIPELINE_STAGES.map((stage) => (
            <article
              key={stage}
              className="rounded-2xl bg-card p-3"
              onDragOver={(event) => event.preventDefault()}
              onDrop={async (event) => {
                event.preventDefault();
                const opportunityId = event.dataTransfer.getData("opportunity_id");
                await updateOpportunity(opportunityId, { stage });
                await reloadData();
              }}
            >
              <h3 className="mb-2 text-xs font-semibold text-foreground">{PIPELINE_STAGE_LABELS[stage]}</h3>
              <ul className="space-y-2 text-xs">
                {opportunities
                  .filter((item) => item.stage === stage)
                  .map((item) => (
                    <li
                      key={item.id}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData("opportunity_id", item.id)}
                      className="rounded-xl border border-border bg-background p-2"
                    >
                      <p className="font-semibold text-foreground">{getClientName(item.client_id)}</p>
                      <p className="text-muted-foreground">{item.description}</p>
                      <p className="text-muted-foreground">{new Date(item.updated_at).toLocaleDateString("pt-PT")}</p>
                    </li>
                  ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Tarefas do dia</h2>
            <button type="button" className="nav-link" onClick={() => setShowTaskForm((value) => !value)}>
              Adicionar tarefa
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
                {opportunities.map((opportunity) => (
                  <option value={opportunity.id} key={opportunity.id}>
                    {getClientName(opportunity.client_id)} — {opportunity.description}
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
                  <p className="text-muted-foreground">Prazo: {new Date(task.due_date).toLocaleDateString("pt-PT")}</p>
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
            {todayTasks.length === 0 ? <li className="text-muted-foreground">Sem tarefas pendentes para hoje.</li> : null}
          </ul>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold text-foreground">Próximas instalações</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {upcomingInstallations.map((opportunity) => (
              <li key={opportunity.id} className="rounded-2xl bg-card p-3">
                <p className="font-semibold text-foreground">{getClientName(opportunity.client_id)}</p>
                <p className="text-muted-foreground">{opportunity.description}</p>
                <p className="text-muted-foreground">
                  Data prevista: {opportunity.installation_date ? new Date(opportunity.installation_date).toLocaleDateString("pt-PT") : "Por definir"}
                </p>
              </li>
            ))}
            {upcomingInstallations.length === 0 ? <li className="text-muted-foreground">Sem instalações agendadas.</li> : null}
          </ul>
        </article>
      </section>
    </div>
  );
}
