import { getStorageKey } from "@/lib/config";
import type {
  Client,
  Measurement,
  Opportunity,
  PipelineStage,
  Quote,
  QuoteSnapshot,
  QuoteStatus,
  Task
} from "@/types";

const STORAGE_KEYS = {
  clients: getStorageKey("clients"),
  measurements: getStorageKey("measurements"),
  quotes: getStorageKey("quotes"),
  pipeline: "querido-lar:pipeline",
  tasks: "querido-lar:tasks"
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string): T[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, value: T[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizePhoneToWhatsApp(phone: string) {
  return phone.replace(/\s|\+/g, "");
}

export function getClients() {
  return readJson<Client>(STORAGE_KEYS.clients);
}

export function getClientById(clientId: string) {
  return getClients().find((client) => client.id === clientId) ?? null;
}

export function addClient(input: Omit<Client, "id">) {
  const next: Client = { id: createId("client"), ...input };
  writeJson(STORAGE_KEYS.clients, [next, ...getClients()]);
  return next;
}

export function updateClient(clientId: string, patch: Partial<Omit<Client, "id">>) {
  const updated = getClients().map((client) => (client.id === clientId ? { ...client, ...patch } : client));
  writeJson(STORAGE_KEYS.clients, updated);
  return updated.find((client) => client.id === clientId) ?? null;
}

export function getMeasurements() {
  return readJson<Measurement>(STORAGE_KEYS.measurements);
}

export function addMeasurement(input: Omit<Measurement, "id" | "created_at">) {
  const next: Measurement = {
    id: createId("measurement"),
    created_at: new Date().toISOString(),
    ...input
  };
  writeJson(STORAGE_KEYS.measurements, [next, ...getMeasurements()]);
  return next;
}

export function getQuotes() {
  return readJson<Quote>(STORAGE_KEYS.quotes);
}

export function addQuote(input: { client_id: string; status?: QuoteStatus; snapshot: QuoteSnapshot }) {
  const next: Quote = {
    id: createId("quote"),
    client_id: input.client_id,
    status: input.status ?? "rascunho",
    versions: [
      {
        version: 1,
        data: input.snapshot,
        created_at: new Date().toISOString()
      }
    ]
  };
  writeJson(STORAGE_KEYS.quotes, [next, ...getQuotes()]);
  return next;
}

export function updateQuote(quoteId: string, input: { snapshot: QuoteSnapshot; status?: QuoteStatus }) {
  let result: Quote | null = null;
  const updated = getQuotes().map((quote) => {
    if (quote.id !== quoteId) return quote;
    result = {
      ...quote,
      status: input.status ?? quote.status,
      versions: [
        ...quote.versions,
        {
          version: (quote.versions.at(-1)?.version ?? 0) + 1,
          data: input.snapshot,
          created_at: new Date().toISOString()
        }
      ]
    };
    return result;
  });
  writeJson(STORAGE_KEYS.quotes, updated);
  return result;
}

export function getOpportunities() {
  return readJson<Opportunity>(STORAGE_KEYS.pipeline);
}

export function addOpportunity(input: {
  client_id: string;
  description: string;
  stage?: PipelineStage;
  estimated_value?: number;
  installation_date?: string;
}) {
  const now = new Date().toISOString();
  const next: Opportunity = {
    id: createId("opp"),
    client_id: input.client_id,
    description: input.description,
    stage: input.stage ?? "LEAD_RECEBIDO",
    created_at: now,
    updated_at: now,
    estimated_value: input.estimated_value,
    installation_date: input.installation_date
  };
  writeJson(STORAGE_KEYS.pipeline, [next, ...getOpportunities()]);
  return next;
}

export function updateOpportunity(opportunityId: string, patch: Partial<Omit<Opportunity, "id" | "client_id" | "created_at">>) {
  let result: Opportunity | null = null;
  const updated = getOpportunities().map((opportunity) => {
    if (opportunity.id !== opportunityId) return opportunity;
    result = {
      ...opportunity,
      ...patch,
      updated_at: new Date().toISOString()
    };
    return result;
  });
  writeJson(STORAGE_KEYS.pipeline, updated);
  return result;
}

export function getTasks() {
  return readJson<Task>(STORAGE_KEYS.tasks);
}

export function addTask(input: Omit<Task, "id" | "done"> & { done?: boolean }) {
  const next: Task = {
    id: createId("task"),
    done: input.done ?? false,
    label: input.label,
    due_date: input.due_date,
    opportunity_id: input.opportunity_id
  };
  writeJson(STORAGE_KEYS.tasks, [next, ...getTasks()]);
  return next;
}

export function toggleTaskDone(taskId: string, done: boolean) {
  const updated = getTasks().map((task) => (task.id === taskId ? { ...task, done } : task));
  writeJson(STORAGE_KEYS.tasks, updated);
}