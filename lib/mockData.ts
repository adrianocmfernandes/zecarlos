import { PIPELINE_STAGES, type PipelineStage } from "@/lib/constants";

export type MockOpportunity = {
  id: string;
  clientName: string;
  projectTitle: string;
  stage: PipelineStage;
  estimatedValue: number;
};

export type MockTask = {
  id: string;
  clientName: string;
  titulo: string;
  dueDate: string;
  status: "PENDENTE" | "CONCLUIDA";
};

export type MockInstallation = {
  id: string;
  clientName: string;
  installDate: string;
  teamName: string;
  status: "AGENDADA" | "EM_CURSO" | "CONCLUIDA";
};

export type MockClient = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  morada?: string;
  origemLead?: string;
  notas?: string;
};

export type MockMeasurement = {
  id: string;
  clientId: string;
  visitDate: string;
  observacoes?: string;
  rooms: Array<{
    divisao: string;
    larguraCm: number;
    alturaCm: number;
    notasTecnicas?: string;
  }>;
  fotos: string[];
};

export type MockQuote = {
  id: string;
  opportunityId: string;
  quoteNumber: string;
  subtotal: number;
  discount: number;
  total: number;
  lines: Array<{ descricao: string; quantity: number; unitPrice: number; lineTotal: number }>;
};

export const fakeDb = {
  totalOpps: 34,
  wonOpps: 11,
  monthlyRevenue: 18750,
  opportunities: [
    { id: "opp-1", clientName: "Ana Silva", projectTitle: "Cortinas sala T3", stage: "LEAD_RECEBIDO", estimatedValue: 950 },
    { id: "opp-2", clientName: "João Costa", projectTitle: "Blackout quartos", stage: "CONTACTADO", estimatedValue: 680 },
    { id: "opp-3", clientName: "Marta Gomes", projectTitle: "Calhas + voil", stage: "ORCAMENTO_ENVIADO", estimatedValue: 1450 },
    { id: "opp-4", clientName: "Pedro Nunes", projectTitle: "Motorizado open-space", stage: "NEGOCIACAO", estimatedValue: 2300 },
    { id: "opp-5", clientName: "Sofia Ribeiro", projectTitle: "Substituição total", stage: "GANHOU", estimatedValue: 3200 },
    { id: "opp-6", clientName: "Ricardo Alves", projectTitle: "Cortinados cozinha", stage: "INSTALACAO_AGENDADA", estimatedValue: 790 }
  ] as MockOpportunity[],
  tasks: [
    { id: "task-1", clientName: "Marta Gomes", titulo: "Follow-up orçamento", dueDate: new Date().toISOString(), status: "PENDENTE" },
    { id: "task-2", clientName: "Pedro Nunes", titulo: "Chamada de validação", dueDate: new Date().toISOString(), status: "PENDENTE" }
  ] as MockTask[],
  installations: [
    { id: "inst-1", clientName: "Sofia Ribeiro", installDate: new Date(Date.now() + 86400000).toISOString(), teamName: "Equipa Norte", status: "AGENDADA" },
    { id: "inst-2", clientName: "Ricardo Alves", installDate: new Date(Date.now() + 172800000).toISOString(), teamName: "Equipa Sul", status: "AGENDADA" }
  ] as MockInstallation[],
  clients: [
    { id: "client-1", nome: "Ana Silva", telefone: "912345678", email: "ana@email.pt", origemLead: "Instagram" },
    { id: "client-2", nome: "João Costa", telefone: "913333222", email: "joao@email.pt", origemLead: "Recomendação" }
  ] as MockClient[],
  measurements: [] as MockMeasurement[],
  quotes: [] as MockQuote[]
};

export function getMetrics() {
  return {
    totalOpps: fakeDb.totalOpps,
    wonOpps: fakeDb.wonOpps,
    monthlyRevenue: fakeDb.monthlyRevenue
  };
}

export function getPipelineData() {
  return fakeDb.opportunities;
}

export function moveOpportunity(opportunityId: string, stage: PipelineStage) {
  if (!PIPELINE_STAGES.includes(stage)) return null;
  const opp = fakeDb.opportunities.find((item) => item.id === opportunityId);
  if (!opp) return null;
  opp.stage = stage;
  return opp;
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
