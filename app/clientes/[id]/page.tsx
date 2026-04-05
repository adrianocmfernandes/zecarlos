"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  deleteMeasurement,
  deleteQuote,
  getClientById,
  getMeasurements,
  getOpportunities,
  getQuotes,
  getTasks,
  normalizePhoneToWhatsApp,
  toggleTaskDone,
  updateMeasurement,
  updateQuote
} from "@/lib/storage";
import { useToast } from "@/components/ui/toast";
import { PIPELINE_STAGE_LABELS, type Measurement, type Opportunity, type Quote, type QuoteStatus, type Task } from "@/types";

/** Simple confirmation dialog rendered inline. */
function ConfirmDialog({
  message,
  onConfirm,
  onCancel
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4">
      <div className="card w-full max-w-sm space-y-4">
        <p className="text-foreground">{message}</p>
        <div className="flex gap-3">
          <button type="button" className="btn-primary flex-1" onClick={onConfirm}>
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

export default function ClienteDetalhePage() {
  const params = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [client, setClient] = useState<Awaited<ReturnType<typeof getClientById>>>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);

  // Edit state for measurements
  const [editingMeasurementId, setEditingMeasurementId] = useState<string | null>(null);
  const [editMeasurementRoom, setEditMeasurementRoom] = useState("");
  const [editMeasurementDimensions, setEditMeasurementDimensions] = useState("");
  const [editMeasurementNotes, setEditMeasurementNotes] = useState("");

  // Edit state for quotes
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [editQuoteTitle, setEditQuoteTitle] = useState("");
  const [editQuoteDescription, setEditQuoteDescription] = useState("");
  const [editQuoteQuantity, setEditQuoteQuantity] = useState("1");
  const [editQuoteUnitPrice, setEditQuoteUnitPrice] = useState("0");
  const [editQuoteStatus, setEditQuoteStatus] = useState<QuoteStatus>("rascunho");
  const [editQuoteNotes, setEditQuoteNotes] = useState("");

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState<{ type: "measurement" | "quote"; id: string } | null>(null);

  const [saving, setSaving] = useState(false);

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

  // ── Measurement edit helpers ─────────────────────────────────────────────

  function startEditMeasurement(m: Measurement) {
    setEditingMeasurementId(m.id);
    setEditMeasurementRoom(m.room);
    setEditMeasurementDimensions(m.dimensions);
    setEditMeasurementNotes(m.notes);
  }

  function cancelEditMeasurement() {
    setEditingMeasurementId(null);
  }

  async function saveMeasurement(id: string) {
    setSaving(true);
    await updateMeasurement(id, {
      room: editMeasurementRoom,
      dimensions: editMeasurementDimensions,
      notes: editMeasurementNotes
    });
    await loadAll();
    setEditingMeasurementId(null);
    setSaving(false);
    showToast("Medição atualizada com sucesso");
  }

  // ── Quote edit helpers ───────────────────────────────────────────────────

  function startEditQuote(q: Quote) {
    const latest = q.versions.at(-1);
    const firstLine = latest?.data.lines[0];
    setEditingQuoteId(q.id);
    setEditQuoteTitle(latest?.data.title ?? "");
    setEditQuoteDescription(firstLine?.description ?? "");
    setEditQuoteQuantity(String(firstLine?.quantity ?? 1));
    setEditQuoteUnitPrice(String(firstLine?.unit_price ?? 0));
    setEditQuoteStatus(q.status);
    setEditQuoteNotes(latest?.data.notes ?? "");
  }

  function cancelEditQuote() {
    setEditingQuoteId(null);
  }

  async function saveQuote(id: string) {
    setSaving(true);
    await updateQuote(id, {
      status: editQuoteStatus,
      snapshot: {
        title: editQuoteTitle,
        lines: [
          {
            description: editQuoteDescription,
            quantity: Number(editQuoteQuantity),
            unit_price: Number(editQuoteUnitPrice)
          }
        ],
        notes: editQuoteNotes
      }
    });
    await loadAll();
    setEditingQuoteId(null);
    setSaving(false);
    showToast("Orçamento atualizado com sucesso");
  }

  // ── Delete helpers ───────────────────────────────────────────────────────

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setSaving(true);
    if (confirmDelete.type === "measurement") {
      await deleteMeasurement(confirmDelete.id);
      showToast("Medição eliminada");
    } else {
      await deleteQuote(confirmDelete.id);
      showToast("Orçamento eliminado");
    }
    setConfirmDelete(null);
    await loadAll();
    setSaving(false);
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (!client) {
    return <p className="text-muted-foreground">Cliente não encontrado.</p>;
  }

  return (
    <section className="space-y-4">
      {confirmDelete ? (
        <ConfirmDialog
          message="Tem a certeza? Esta ação não pode ser revertida."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      ) : null}

      <header className="card space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{client.name}</h1>
        <p className="text-muted-foreground">{client.phone}</p>
        <p className="text-muted-foreground">{client.address}</p>
        <a
          href={`https://wa.me/${normalizePhoneToWhatsApp(client.phone)}`}
          target="_blank"
          rel="noreferrer"
          className="btn-primary inline-block text-center"
        >
          Contactar por WhatsApp
        </a>
      </header>

      <article className="card">
        <h2 className="font-semibold text-foreground">Pipeline</h2>
        <p className="text-muted-foreground">{opportunity ? PIPELINE_STAGE_LABELS[opportunity.stage] : "Sem oportunidade"}</p>
      </article>

      {/* ── Medições ── */}
      <article className="card">
        <h2 className="font-semibold text-foreground">Medições</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {measurements.map((measurement) => (
            <li key={measurement.id} className="rounded-2xl bg-card p-3">
              {editingMeasurementId === measurement.id ? (
                <div className="space-y-2">
                  <input
                    value={editMeasurementRoom}
                    onChange={(e) => setEditMeasurementRoom(e.target.value)}
                    placeholder="Divisão"
                    className="input text-sm"
                  />
                  <input
                    value={editMeasurementDimensions}
                    onChange={(e) => setEditMeasurementDimensions(e.target.value)}
                    placeholder="Dimensões"
                    className="input text-sm"
                  />
                  <textarea
                    value={editMeasurementNotes}
                    onChange={(e) => setEditMeasurementNotes(e.target.value)}
                    placeholder="Notas"
                    className="input min-h-16 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      className="btn-primary flex-1 text-sm"
                      onClick={() => saveMeasurement(measurement.id)}
                    >
                      {saving ? "A guardar..." : "Guardar"}
                    </button>
                    <button type="button" className="nav-link flex-1 text-center text-sm" onClick={cancelEditMeasurement}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-medium text-foreground">{measurement.room}</p>
                  <p>{measurement.dimensions}</p>
                  <p>{measurement.notes}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="nav-link text-sm"
                      onClick={() => startEditMeasurement(measurement)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="nav-link text-sm"
                      onClick={() => setConfirmDelete({ type: "measurement", id: measurement.id })}
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
          {measurements.length === 0 ? <li>Sem medições registadas.</li> : null}
        </ul>
      </article>

      {/* ── Orçamentos ── */}
      <article className="card">
        <h2 className="font-semibold text-foreground">Orçamentos</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {quotes.map((quote) => {
            const latestVersion = quote.versions.at(-1);
            const isOpen = expandedQuoteId === quote.id;
            return (
              <li key={quote.id} className="rounded-2xl bg-card p-3">
                {editingQuoteId === quote.id ? (
                  <div className="space-y-2">
                    <input
                      value={editQuoteTitle}
                      onChange={(e) => setEditQuoteTitle(e.target.value)}
                      placeholder="Título"
                      className="input text-sm"
                    />
                    <input
                      value={editQuoteDescription}
                      onChange={(e) => setEditQuoteDescription(e.target.value)}
                      placeholder="Descrição"
                      className="input text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={editQuoteQuantity}
                        onChange={(e) => setEditQuoteQuantity(e.target.value)}
                        placeholder="Quantidade"
                        className="input text-sm"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editQuoteUnitPrice}
                        onChange={(e) => setEditQuoteUnitPrice(e.target.value)}
                        placeholder="Preço unitário"
                        className="input text-sm"
                      />
                    </div>
                    <select
                      value={editQuoteStatus}
                      onChange={(e) => setEditQuoteStatus(e.target.value as QuoteStatus)}
                      className="input text-sm"
                    >
                      <option value="rascunho">Rascunho</option>
                      <option value="enviado">Enviado</option>
                      <option value="aceite">Aceite</option>
                      <option value="rejeitado">Rejeitado</option>
                    </select>
                    <textarea
                      value={editQuoteNotes}
                      onChange={(e) => setEditQuoteNotes(e.target.value)}
                      placeholder="Notas"
                      className="input min-h-16 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={saving}
                        className="btn-primary flex-1 text-sm"
                        onClick={() => saveQuote(quote.id)}
                      >
                        {saving ? "A guardar..." : "Guardar"}
                      </button>
                      <button type="button" className="nav-link flex-1 text-center text-sm" onClick={cancelEditQuote}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-foreground">{latestVersion?.data.title || "Orçamento"}</p>
                    <p>Estado: {quote.status}</p>
                    <p>Versão atual: {latestVersion?.version}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="nav-link text-sm"
                        onClick={() => startEditQuote(quote)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="nav-link text-sm"
                        onClick={() => setConfirmDelete({ type: "quote", id: quote.id })}
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        className="nav-link text-sm"
                        onClick={() => setExpandedQuoteId(isOpen ? null : quote.id)}
                      >
                        {isOpen ? "Esconder histórico" : "Ver histórico"}
                      </button>
                    </div>
                    {isOpen ? (
                      <ul className="mt-2 space-y-1">
                        {quote.versions
                          .slice()
                          .reverse()
                          .map((version) => (
                            <li key={version.version}>
                              v{version.version} — {new Date(version.created_at).toLocaleDateString("pt-PT")}
                            </li>
                          ))}
                      </ul>
                    ) : null}
                  </>
                )}
              </li>
            );
          })}
          {quotes.length === 0 ? <li>Sem orçamentos registados.</li> : null}
        </ul>
      </article>

      {/* ── Tarefas ── */}
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
