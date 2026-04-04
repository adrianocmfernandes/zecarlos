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
import { createClient } from "@/lib/supabase/client";

type DbQuoteVersion = {
  id: string;
  version: number;
  data: QuoteSnapshot;
  created_at: string;
};

type DbQuote = {
  id: string;
  client_id: string;
  status: QuoteStatus;
  quote_versions: DbQuoteVersion[];
};

async function getCurrentUserId() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export function normalizePhoneToWhatsApp(phone: string) {
  return phone.replace(/\s|\+/g, "");
}

export async function getClients() {
  const supabase = createClient();
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Client[];
}

export async function getClientById(clientId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("clients").select("*").eq("id", clientId).maybeSingle();
  if (error) return null;
  return data as Client | null;
}

export async function addClient(input: Omit<Client, "id">) {
  const supabase = createClient();
  const createdBy = await getCurrentUserId();
  const { data, error } = await supabase
    .from("clients")
    .insert({ ...input, created_by: createdBy })
    .select("*")
    .single();
  if (error) throw error;
  return data as Client;
}

export async function updateClient(clientId: string, patch: Partial<Omit<Client, "id">>) {
  const supabase = createClient();
  const { data, error } = await supabase.from("clients").update(patch).eq("id", clientId).select("*").maybeSingle();
  if (error) return null;
  return data as Client | null;
}

export async function getMeasurements(clientId?: string) {
  const supabase = createClient();
  let query = supabase.from("measurements").select("*").order("created_at", { ascending: false });
  if (clientId) query = query.eq("client_id", clientId);
  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Measurement[];
}

export async function addMeasurement(input: Omit<Measurement, "id" | "created_at">) {
  const supabase = createClient();
  const createdBy = await getCurrentUserId();
  const { data, error } = await supabase
    .from("measurements")
    .insert({ ...input, created_by: createdBy })
    .select("*")
    .single();

  if (error) throw error;
  return data as Measurement;
}

export async function getQuotes(clientId?: string) {
  const supabase = createClient();
  let query = supabase
    .from("quotes")
    .select("id, client_id, status, quote_versions(id, version, data, created_at)")
    .order("created_at", { ascending: false });

  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) return [];

  return ((data ?? []) as DbQuote[]).map((quote) => ({
    id: quote.id,
    client_id: quote.client_id,
    status: quote.status,
    versions: [...(quote.quote_versions ?? [])].sort((a, b) => a.version - b.version)
  })) as Quote[];
}

export async function addQuote(input: { client_id: string; status?: QuoteStatus; snapshot: QuoteSnapshot }) {
  const supabase = createClient();
  const createdBy = await getCurrentUserId();

  const { data: quoteData, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      client_id: input.client_id,
      status: input.status ?? "rascunho",
      created_by: createdBy
    })
    .select("id, client_id, status")
    .single();

  if (quoteError) throw quoteError;

  const { error: versionError } = await supabase.from("quote_versions").insert({
    quote_id: quoteData.id,
    version: 1,
    data: input.snapshot
  });

  if (versionError) throw versionError;

  return {
    ...quoteData,
    versions: [
      {
        id: "local",
        version: 1,
        data: input.snapshot,
        created_at: new Date().toISOString()
      }
    ]
  } as Quote;
}

export async function updateQuote(quoteId: string, input: { snapshot: QuoteSnapshot; status?: QuoteStatus }) {
  const supabase = createClient();

  const { data: latestVersion } = await supabase
    .from("quote_versions")
    .select("version")
    .eq("quote_id", quoteId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latestVersion?.version ?? 0) + 1;

  const { error: versionError } = await supabase.from("quote_versions").insert({
    quote_id: quoteId,
    version: nextVersion,
    data: input.snapshot
  });

  if (versionError) throw versionError;

  const { data, error } = await supabase
    .from("quotes")
    .update({ status: input.status })
    .eq("id", quoteId)
    .select("id, client_id, status")
    .maybeSingle();

  if (error) return null;

  return data as Quote | null;
}

export async function getOpportunities() {
  const supabase = createClient();
  const { data, error } = await supabase.from("opportunities").select("*").order("updated_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Opportunity[];
}

export async function addOpportunity(input: {
  client_id: string;
  description: string;
  stage?: PipelineStage;
  estimated_value?: number;
  installation_date?: string;
}) {
  const supabase = createClient();
  const createdBy = await getCurrentUserId();

  const { data, error } = await supabase
    .from("opportunities")
    .insert({
      ...input,
      stage: input.stage ?? "LEAD_RECEBIDO",
      created_by: createdBy
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Opportunity;
}

export async function updateOpportunity(opportunityId: string, patch: Partial<Omit<Opportunity, "id" | "client_id" | "created_at">>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("opportunities")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", opportunityId)
    .select("*")
    .maybeSingle();

  if (error) return null;
  return data as Opportunity | null;
}

export async function getTasks() {
  const supabase = createClient();
  const { data, error } = await supabase.from("tasks").select("*").order("due_date", { ascending: true });
  if (error) return [];
  return (data ?? []) as Task[];
}

export async function addTask(input: Omit<Task, "id" | "done"> & { done?: boolean }) {
  const supabase = createClient();
  const createdBy = await getCurrentUserId();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      label: input.label,
      due_date: input.due_date,
      opportunity_id: input.opportunity_id ?? null,
      done: input.done ?? false,
      created_by: createdBy
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Task;
}

export async function toggleTaskDone(taskId: string, done: boolean) {
  const supabase = createClient();
  await supabase.from("tasks").update({ done }).eq("id", taskId);
}
