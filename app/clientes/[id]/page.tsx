"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  addMeasurement,
  addQuote,
  addTask,
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
  const [saving, setSaving] = useState(false);

  // ── Edit state — measurements ───────────────────────────────────────────
  const [editingMeasurementId, setEditingMeasurementId] = useState<string | null>(null);
  const [editMeasurementRoom, setEditMeasurementRoom] = useState("");
  const [editMeasurementDimensions, setEditMeasurementDimensions] = useState("");
  const [editMeasurementNotes, setEditMeasurementNotes] = useState("");

  // ── New measurement form ────────────────────────────────────────────────
  const [showNewMeasurement, setShowNewMeasurement] = useState(false);
  const [newRoom, setNewRoom] = useState("");
  const [newDimensions, setNewDimensions] = useState("");
  const [newMeasurementNotes, setNewMeasurementNotes] = useState("");

  // ── Edit state — quotes ─────────────────────────────────────────────────
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [editQuoteTitle, setEditQuoteTitle] = useState("");
  const [editQuoteDescription, setEditQuoteDescription] = useState("");
  const [editQuoteQuantity, setEditQuoteQuantity] = useState("1");
  const [editQuoteUnitPrice, setEditQuoteUnitPrice] = useState("0");
  const [editQuoteStatus, setEditQuoteStatus] = useState<QuoteStatus>("rascunho");
  const [editQuoteNotes, setEditQuoteNotes] = useState("");

  // ── New quote form ──────────────────────────────────────────────────────
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [newQuoteTitle, setNewQuoteTitle] = useState("");
  const [newQuoteDescription, setNewQuoteDescription] = useState("");
  const [newQuoteQuantity, setNewQuoteQuantity] = useState("1");
  const [newQuoteUnitPrice, setNewQuoteUnitPrice] = useState("0");
  const [newQuoteStatus, setNewQuoteStatus] = useState<QuoteStatus>("rascunho");
  const [newQuoteNotes, setNewQuoteNotes] = useState("");

  // ── New task form ───────────────────────────────────────────────────────
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  // ── Delete confirmation ─────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState<{ type: "measurement" | "quote"; id: string } | null>(null);

  // ── Data loading ────────────────────────────────────────────────────────

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

  // ── Measurement helpers ─────────────────────────────────────────────────

  function startEditMeasurement(m: Measurement) {
    setShowNewMeasurement(false);
    setEditingMeasurementId(m.id);
    setEditMeasurementRoom(m.room);
    setEditMeasurementDimensions(m.dimensions);
    setEditMeasurementNotes(m.notes);
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

  async function saveNewMeasurement() {
    if (!newRoom.trim()) return;
    setSaving(true);
    await addMeasurement({
      client_id: params.id,
      room: newRoom.trim(),
      dimensions: newDimensions.trim(),
      notes: newMeasurementNotes.trim()
    });
    setShowNewMeasurement(false);
    setNewRoom("");
    setNewDimensions("");
    setNewMeasurementNotes("");
    await loadAll();
    setSaving(false);
    showToast("Medição adicionada com sucesso");
  }

  // ── Quote helpers ───────────────────────────────────────────────────────

  function startEditQuote(q: Quote) {
    setShowNewQuote(false);
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

  async function saveQuote(id: string) {
    setSaving(true);
    await updateQuote(id, {
      status: editQuoteStatus,
      snapshot: {
        title: editQuoteTitle,
        lines: [{ description: editQuoteDescription, quantity: Number(editQuoteQuantity), unit_price: Number(editQuoteUnitPrice) }],
        notes: editQuoteNotes
      }
    });
    await loadAll();
    setEditingQuoteId(null);
    setSaving(false);
    showToast("Orçamento atualizado com sucesso");
  }

  async function saveNewQuote() {
    if (!newQuoteTitle.trim()) return;
    setSaving(true);
    await addQuote({
      client_id: params.id,
      status: newQuoteStatus,
      snapshot: {
        title: newQuoteTitle.trim(),
        lines: [{ description: newQuoteDescription.trim(), quantity: Number(newQuoteQuantity), unit_price: Number(newQuoteUnitPrice) }],
        notes: newQuoteNotes.trim()
      }
    });
    setShowNewQuote(false);
    setNewQuoteTitle("");
    setNewQuoteDescription("");
    setNewQuoteQuantity("1");
    setNewQuoteUnitPrice("0");
    setNewQuoteStatus("rascunho");
    setNewQuoteNotes("");
    await loadAll();
    setSaving(false);
    showToast("Orçamento adicionado com sucesso");
  }

  // ── Task helpers ────────────────────────────────────────────────────────

  async function saveNewTask() {
    if (!newTaskLabel.trim() || !newTaskDueDate) return;
    setSaving(true);
    await addTask({
      label: newTaskLabel.trim(),
      due_date: newTaskDueDate,
      opportunity_id: opportunity?.id
    });
    setShowNewTask(false);
    setNewTaskLabel("");
    setNewTaskDueDate("");
    await loadAll();
    setSaving(false);
    showToast("Tarefa adicionada com sucesso");
  }

  // ── Delete helpers ──────────────────────────────────────────────────────

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

  // ── Render ──────────────────────────────────────────────────────────────

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
        <p className="text-muted-foreground">
          {opportunity ? PIPELINE_STAGE_LABELS[opportunity.stage] : "Sem oportunidade"}
        </p>
      </article>

      {/* ── Medições ── */}
      <article className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Medições</h2>
          <button
            type="button"
            className="nav-link text-sm"
            onClick={() => {
              setEditingMeasurementId(null);
              setShowNewMeasurement((v) => !v);
            }}
          >
            {showNewMeasurement ? "Cancelar" : "Adicionar medição"}
          </button>
        </div>

        {showNewMeasurement ? (
          <div className="mt-3 space-y-2 rounded-2xl border border-border bg-background p-3">
            <input
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              placeholder="Divisão (ex.: Sala)"
              className="input text-sm"
            />
            <input
              value={newDimensions}
              onChange={(e) => setNewDimensions(e.target.value)}
              placeholder="Dimensões (ex.: 2.00m x 1.50m)"
              className="input text-sm"
            />
            <textarea
              value={newMeasurementNotes}
              onChange={(e) => setNewMeasurementNotes(e.target.value)}
              placeholder="Notas técnicas"
              className="input min-h-16 text-sm"
            />
            <button
              type="button"
              disabled={saving || !newRoom.trim()}
              className="btn-primary w-full text-sm"
              onClick={saveNewMeasurement}
            >
              {saving ? "A guardar..." : "Guardar medição"}
            </button>
          </div>
        ) : null}

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
                    <button
                      type="button"
                      className="nav-link flex-1 text-center text-sm"
                      onClick={() => setEditingMeasurementId(null)}
                    >
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
          {measurements.length === 0 && !showNewMeasurement ? (
            <li>Sem medições registadas.</li>
          ) : null}
        </ul>
      </article>

      {/* ── Orçamentos ── */}
      <article className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Orçamentos</h2>
          <button
            type="button"
            className="nav-link text-sm"
            onClick={() => {
              setEditingQuoteId(null);
              setShowNewQuote((v) => !v);
            }}
          >
            {showNewQuote ? "Cancelar" : "Adicionar orçamento"}
          </button>
        </div>

        {showNewQuote ? (
          <div className="mt-3 space-y-2 rounded-2xl border border-border bg-background p-3">
            <input
              value={newQuoteTitle}
              onChange={(e) => setNewQuoteTitle(e.target.value)}
              placeholder="Título (ex.: Blackout sala)"
              className="input text-sm"
            />
            <input
              value={newQuoteDescription}
              onChange={(e) => setNewQuoteDescription(e.target.value)}
              placeholder="Descrição do item"
              className="input text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.01"
                value={newQuoteQuantity}
                onChange={(e) => setNewQuoteQuantity(e.target.value)}
                placeholder="Quantidade"
                className="input text-sm"
              />
              <input
                type="number"
                step="0.01"
                value={newQuoteUnitPrice}
                onChange={(e) => setNewQuoteUnitPrice(e.target.value)}
                placeholder="Preço unitário €"
                className="input text-sm"
              />
            </div>
            <select
              value={newQuoteStatus}
              onChange={(e) => setNewQuoteStatus(e.target.value as QuoteStatus)}
              className="input text-sm"
            >
              <option value="rascunho">Rascunho</option>
              <option value="enviado">Enviado</option>
              <option value="aceite">Aceite</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
            <textarea
              value={newQuoteNotes}
              onChange={(e) => setNewQuoteNotes(e.target.value)}
              placeholder="Notas"
              className="input min-h-16 text-sm"
            />
            <button
              type="button"
              disabled={saving || !newQuoteTitle.trim()}
              className="btn-primary w-full text-sm"
              onClick={saveNewQuote}
            >
              {saving ? "A guardar..." : "Guardar orçamento"}
            </button>
          </div>
        ) : null}

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
                      <button
                        type="button"
                        className="nav-link flex-1 text-center text-sm"
                        onClick={() => setEditingQuoteId(null)}
                      >
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
                              v{version.version} —{" "}
                              {new Date(version.created_at).toLocaleDateString("pt-PT")}
                            </li>
                          ))}
                      </ul>
                    ) : null}
                  </>
                )}
              </li>
            );
          })}
          {quotes.length === 0 && !showNewQuote ? (
            <li>Sem orçamentos registados.</li>
          ) : null}
        </ul>
      </article>

      {/* ── Tarefas ── */}
      <article className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Tarefas</h2>
          <button
            type="button"
            className="nav-link text-sm"
            onClick={() => setShowNewTask((v) => !v)}
          >
            {showNewTask ? "Cancelar" : "Adicionar tarefa"}
          </button>
        </div>

        {showNewTask ? (
          <div className="mt-3 space-y-2 rounded-2xl border border-border bg-background p-3">
            <input
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              placeholder="Descrição da tarefa"
              className="input text-sm"
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="input text-sm"
            />
            {!opportunity ? (
              <p className="text-xs text-muted-foreground">
                Este cliente não tem oportunidade associada. A tarefa será criada sem oportunidade.
              </p>
            ) : null}
            <button
              type="button"
              disabled={saving || !newTaskLabel.trim() || !newTaskDueDate}
              className="btn-primary w-full text-sm"
              onClick={saveNewTask}
            >
              {saving ? "A guardar..." : "Guardar tarefa"}
            </button>
          </div>
        ) : null}

        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between rounded-2xl bg-card p-3">
              <div>
                <span className={task.done ? "line-through" : "text-foreground"}>{task.label}</span>
                <p className="text-xs text-muted-foreground">
                  Prazo: {new Date(task.due_date).toLocaleDateString("pt-PT")}
                </p>
              </div>
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
          {tasks.length === 0 && !showNewTask ? (
            <li>Sem tarefas para este cliente.</li>
          ) : null}
        </ul>
      </article>

      <Link href="/clientes" className="nav-link inline-block">
        Voltar aos clientes
      </Link>
    </section>
  );
}
