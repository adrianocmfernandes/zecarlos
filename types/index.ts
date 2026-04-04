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
};
