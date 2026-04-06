export type PipelineStage =
  | "LEAD_RECEBIDO"
  | "CONTACTADO"
  | "VISITA_AGENDADA"
  | "MEDICAO_REALIZADA"
  | "ORCAMENTO_ENVIADO"
  | "NEGOCIACAO"
  | "GANHOU"
  | "INSTALACAO_AGENDADA"
  | "CONCLUIDO"
  | "PERDIDO";

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  LEAD_RECEBIDO: "Lead recebido",
  CONTACTADO: "Contactado",
  VISITA_AGENDADA: "Visita agendada",
  MEDICAO_REALIZADA: "Medição realizada",
  ORCAMENTO_ENVIADO: "Orçamento enviado",
  NEGOCIACAO: "Negociação",
  GANHOU: "Ganhou",
  INSTALACAO_AGENDADA: "Instalação agendada",
  CONCLUIDO: "Concluído",
  PERDIDO: "Perdido"
};

export const PIPELINE_STAGES: PipelineStage[] = [
  "LEAD_RECEBIDO",
  "CONTACTADO",
  "VISITA_AGENDADA",
  "MEDICAO_REALIZADA",
  "ORCAMENTO_ENVIADO",
  "NEGOCIACAO",
  "GANHOU",
  "INSTALACAO_AGENDADA",
  "CONCLUIDO",
  "PERDIDO"
];

export type Client = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

export type Opportunity = {
  id: string;
  client_id: string;
  description: string;
  stage: PipelineStage;
  created_at: string;
  updated_at: string;
  estimated_value?: number;
  installation_date?: string;
};

export type Measurement = {
  id: string;
  client_id: string;
  room: string;
  dimensions: string;
  notes: string;
  created_at: string;
};

export type QuoteStatus = "rascunho" | "enviado" | "aceite" | "rejeitado";

export type QuoteSnapshot = {
  title: string;
  lines: Array<{
    description: string;
    quantity: number;
    unit_price: number;
  }>;
  notes?: string;
};

export type QuoteVersion = {
  version: number;
  data: QuoteSnapshot;
  created_at: string;
};

export type Quote = {
  id: string;
  client_id: string;
  status: QuoteStatus;
  versions: QuoteVersion[];
};

export type Task = {
  id: string;
  label: string;
  opportunity_id?: string;
  due_date: string;
  done: boolean;
};

export type ActivityLog = {
  id: string;
  type: string;
  description: string;
  entity_id?: string;
  created_at: string;
};
