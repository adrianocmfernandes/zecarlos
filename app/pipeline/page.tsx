"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addActivityLog,
  addOpportunity,
  getClients,
  getOpportunities,
  updateOpportunity
} from "@/lib/storage";
import {
  PIPELINE_STAGE_LABELS,
  PIPELINE_STAGES,
  type Client,
  type Opportunity,
  type PipelineStage
} from "@/types";

// Warm-palette border accent per stage
const STAGE_COLORS: Record<PipelineStage, string> = {
  LEAD_RECEBIDO: "#C4A882",
  CONTACTADO: "#B89B7A",
  VISITA_AGENDADA: "#A0865A",
  MEDICAO_REALIZADA: "#8B6F45",
  ORCAMENTO_ENVIADO: "#7A5C30",
  NEGOCIACAO: "#6B4F22",
  GANHOU: "#5A8A5A",
  INSTALACAO_AGENDADA: "#5A7A8A",
  CONCLUIDO: "#4A7A5A",
  PERDIDO: "#8A5A5A"
};

/** Modal that asks for installation date before confirming move to INSTALACAO_AGENDADA. */
function InstallDateModal({
  onConfirm,
  onCancel
}: {
  onConfirm: (date: string) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4">
      <div className="card w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Data de instalação</h3>
        <p className="text-sm text-muted-foreground">Selecione a data prevista para esta instalação.</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-primary flex-1"
            disabled={!date}
            onClick={() => onConfirm(date)}
          >
            Confirmar
          </button>
          <button type="button" className="nav-link flex-1 text-center" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/** Dropdown to pick a new stage. Closes on outside click/tap. */
function MoveMenu({
  opportunity,
  onMove,
  onClose
}: {
  opportunity: Opportunity;
  onMove: (stage: PipelineStage) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
    >
      {PIPELINE_STAGES.filter((s) => s !== opportunity.stage).map((s) => (
        <button
          key={s}
          type="button"
          className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-secondary"
          onClick={() => onMove(s)}
        >
          {PIPELINE_STAGE_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

/** Inline quick-add form at the bottom of a column. */
function QuickAddForm({
  stage,
  clients,
  onSave,
  onCancel
}: {
  stage: PipelineStage;
  clients: Client[];
  onSave: (clientId: string, description: string, value: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !description) return;
    setSaving(true);
    await onSave(clientId, description, value);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2 rounded-xl border border-border bg-background p-2">
      <select
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        required
        className="input py-1.5 text-xs"
      >
        <option value="">Selecionar cliente</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
        required
        className="input py-1.5 text-xs"
      />
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Valor €"
        className="input py-1.5 text-xs"
      />
      <div className="flex gap-1">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex-1 py-1.5 text-xs"
        >
          {saving ? "..." : "Criar"}
        </button>
        <button
          type="button"
          className="nav-link flex-1 py-1.5 text-center text-xs"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function PipelinePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [mobileMenuId, setMobileMenuId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{ opportunityId: string } | null>(null);
  const [quickAddStage, setQuickAddStage] = useState<PipelineStage | null>(null);

  async function reloadData() {
    const [clientsData, opportunitiesData] = await Promise.all([
      getClients(),
      getOpportunities()
    ]);
    setClients(clientsData);
    setOpportunities(opportunitiesData);
  }

  useEffect(() => {
    void reloadData();
  }, []);

  function getClientName(clientId: string) {
    return clients.find((c) => c.id === clientId)?.name ?? "Cliente";
  }

  async function requestMove(opportunityId: string, stage: PipelineStage) {
    setMobileMenuId(null);
    if (stage === "INSTALACAO_AGENDADA") {
      setPendingMove({ opportunityId });
      return;
    }
    const opp = opportunities.find((o) => o.id === opportunityId);
    await updateOpportunity(opportunityId, { stage });
    void addActivityLog({
      type: "deal_moved",
      description: `${getClientName(opp?.client_id ?? "")} movido para ${PIPELINE_STAGE_LABELS[stage]}`,
      entity_id: opportunityId
    });
    await reloadData();
  }

  async function confirmInstallDate(date: string) {
    if (!pendingMove) return;
    const opp = opportunities.find((o) => o.id === pendingMove.opportunityId);
    await updateOpportunity(pendingMove.opportunityId, {
      stage: "INSTALACAO_AGENDADA",
      installation_date: date
    });
    void addActivityLog({
      type: "deal_moved",
      description: `${getClientName(opp?.client_id ?? "")} movido para Instalação agendada`,
      entity_id: pendingMove.opportunityId
    });
    setPendingMove(null);
    await reloadData();
  }

  async function handleQuickAdd(stage: PipelineStage, clientId: string, description: string, value: string) {
    if (stage === "INSTALACAO_AGENDADA") {
      // still needs an install date — open the modal after creating
    }
    const newOpp = await addOpportunity({
      client_id: clientId,
      description,
      stage,
      estimated_value: value ? Number(value) : undefined
    });
    void addActivityLog({
      type: "deal_added",
      description: `Nova oportunidade: ${description} (${getClientName(clientId)})`,
      entity_id: newOpp.id
    });
    setQuickAddStage(null);
    await reloadData();
  }

  // Per-stage stats
  const stageStats = useMemo(() => {
    const stats = {} as Record<PipelineStage, { count: number; total: number }>;
    for (const stage of PIPELINE_STAGES) {
      const ops = opportunities.filter((o) => o.stage === stage);
      stats[stage] = {
        count: ops.length,
        total: ops.reduce((sum, o) => sum + Number(o.estimated_value ?? 0), 0)
      };
    }
    return stats;
  }, [opportunities]);

  const totalDeals = opportunities.length;
  const totalValue = opportunities.reduce((s, o) => s + Number(o.estimated_value ?? 0), 0);

  return (
    <div className="space-y-4 pb-6">
      {pendingMove ? (
        <InstallDateModal
          onConfirm={confirmInstallDate}
          onCancel={() => setPendingMove(null)}
        />
      ) : null}

      {/* Header */}
      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Pipeline comercial</h1>
        <p className="text-sm text-muted-foreground">
          {totalDeals} negócio{totalDeals !== 1 ? "s" : ""} · {totalValue.toFixed(2)} €
        </p>
      </div>

      {/* Board */}
      <div className="overflow-x-auto rounded-3xl bg-card p-4 shadow-sm">
        <div className="flex gap-3" style={{ minWidth: `${PIPELINE_STAGES.length * 200}px` }}>
          {PIPELINE_STAGES.map((stage) => {
            const { count, total } = stageStats[stage];
            const stageOpps = opportunities.filter((o) => o.stage === stage);

            return (
              <div
                key={stage}
                className="flex w-48 flex-shrink-0 flex-col rounded-2xl bg-background p-3"
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault();
                  const opportunityId = e.dataTransfer.getData("opportunity_id");
                  if (opportunityId) await requestMove(opportunityId, stage);
                }}
              >
                {/* Column header */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold text-foreground">{PIPELINE_STAGE_LABELS[stage]}</h2>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {count}
                    </span>
                  </div>
                  {total > 0 ? (
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">{total.toFixed(0)} €</p>
                  ) : null}
                </div>

                {/* Cards */}
                <ul className="flex-1 space-y-2">
                  {stageOpps.map((item) => (
                    <li
                      key={item.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("opportunity_id", item.id)}
                      className="relative rounded-xl border border-border bg-card p-2 pl-3"
                      style={{ borderLeftWidth: 4, borderLeftColor: STAGE_COLORS[item.stage] }}
                    >
                      {/* Move icon */}
                      <div className="absolute right-1.5 top-1.5">
                        <button
                          type="button"
                          className="rounded-lg p-0.5 text-sm leading-none text-muted-foreground hover:bg-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMobileMenuId(mobileMenuId === item.id ? null : item.id);
                          }}
                          aria-label="Mover negócio"
                        >
                          ⋮
                        </button>
                        {mobileMenuId === item.id ? (
                          <MoveMenu
                            opportunity={item}
                            onMove={(s) => requestMove(item.id, s)}
                            onClose={() => setMobileMenuId(null)}
                          />
                        ) : null}
                      </div>

                      <p className="pr-5 text-xs font-semibold text-foreground">
                        {getClientName(item.client_id)}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      {item.estimated_value ? (
                        <p className="mt-1 text-xs font-semibold text-foreground">
                          {Number(item.estimated_value).toFixed(2)} €
                        </p>
                      ) : null}
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(item.updated_at).toLocaleDateString("pt-PT")}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Quick-add */}
                {quickAddStage === stage ? (
                  <QuickAddForm
                    stage={stage}
                    clients={clients}
                    onSave={(clientId, description, value) =>
                      handleQuickAdd(stage, clientId, description, value)
                    }
                    onCancel={() => setQuickAddStage(null)}
                  />
                ) : (
                  <button
                    type="button"
                    className="mt-2 w-full rounded-xl border border-dashed border-border py-1.5 text-xs text-muted-foreground transition hover:bg-secondary"
                    onClick={() => setQuickAddStage(stage)}
                  >
                    + Adicionar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
