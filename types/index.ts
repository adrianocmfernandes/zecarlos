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
