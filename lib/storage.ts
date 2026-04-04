import { getStorageKey } from "@/lib/config";
import type { Client, Measurement, Quote, QuoteSnapshot, QuoteStatus } from "@/types";

const STORAGE_KEYS = {
  clients: getStorageKey("clients"),
  measurements: getStorageKey("measurements"),
  quotes: getStorageKey("quotes")
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

export function getClients() {
  return readJson<Client>(STORAGE_KEYS.clients);
}

export function addClient(input: Omit<Client, "id">) {
  const clients = getClients();
  const next: Client = {
    id: createId("client"),
    ...input
  };
  writeJson(STORAGE_KEYS.clients, [next, ...clients]);
  return next;
}

export function updateClient(clientId: string, patch: Partial<Omit<Client, "id">>) {
  const clients = getClients();
  const updated = clients.map((client) =>
    client.id === clientId
      ? {
          ...client,
          ...patch
        }
      : client
  );
  writeJson(STORAGE_KEYS.clients, updated);
  return updated.find((client) => client.id === clientId) ?? null;
}

export function getMeasurements() {
  return readJson<Measurement>(STORAGE_KEYS.measurements);
}

export function addMeasurement(input: Omit<Measurement, "id" | "created_at">) {
  const measurements = getMeasurements();
  const next: Measurement = {
    id: createId("measurement"),
    created_at: new Date().toISOString(),
    ...input
  };
  writeJson(STORAGE_KEYS.measurements, [next, ...measurements]);
  return next;
}

export function getQuotes() {
  return readJson<Quote>(STORAGE_KEYS.quotes);
}

export function addQuote(input: { client_id: string; status?: QuoteStatus; snapshot: QuoteSnapshot }) {
  const quotes = getQuotes();
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
  writeJson(STORAGE_KEYS.quotes, [next, ...quotes]);
  return next;
}

export function updateQuote(
  quoteId: string,
  input: {
    snapshot: QuoteSnapshot;
    status?: QuoteStatus;
  }
) {
  const quotes = getQuotes();
  let result: Quote | null = null;

  const updated = quotes.map((quote) => {
    if (quote.id !== quoteId) return quote;

    const nextVersion = (quote.versions.at(-1)?.version ?? 0) + 1;
    result = {
      ...quote,
      status: input.status ?? quote.status,
      versions: [
        ...quote.versions,
        {
          version: nextVersion,
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
