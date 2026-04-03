export const PIPELINE_STAGES = [
  "LEAD_RECEBIDO",
  "CONTACTADO",
  "VISITA_MEDICAO_AGENDADA",
  "MEDICAO_REALIZADA",
  "ORCAMENTO_ENVIADO",
  "NEGOCIACAO",
  "GANHOU",
  "PERDIDO",
  "INSTALACAO_AGENDADA",
  "CONCLUIDO"
] as const;

export const STAGE_LABELS: Record<(typeof PIPELINE_STAGES)[number], string> = {
  LEAD_RECEBIDO: "Lead recebido",
  CONTACTADO: "Contactado",
  VISITA_MEDICAO_AGENDADA: "Visita de medição agendada",
  MEDICAO_REALIZADA: "Medição realizada",
  ORCAMENTO_ENVIADO: "Orçamento enviado",
  NEGOCIACAO: "Negociação",
  GANHOU: "Ganhou",
  PERDIDO: "Perdido",
  INSTALACAO_AGENDADA: "Instalação agendada",
  CONCLUIDO: "Concluído"
};
