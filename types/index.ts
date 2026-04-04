export type Client = {
  id: string;
  name: string;
  phone: string;
  address: string;
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
export type NovoClienteInput = {
  nome: string;
  telefone: string;
  email?: string;
  morada?: string;
  origemLead?: string;
  notas?: string;
};

export type NovaMedicaoInput = {
  clientId: string;
  visitDate: string;
  observacoes?: string;
  rooms: Array<{
    divisao: string;
    larguraCm: number;
    alturaCm: number;
    curtainTypeId?: string;
    notasTecnicas?: string;
  }>;
  fotos?: string[];
};
