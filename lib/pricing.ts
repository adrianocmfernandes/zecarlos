export type QuoteDraftLine = {
  descricao: string;
  quantidade: number;
  precoUnitario: number;
};

export function calcularTotalLinhas(lines: QuoteDraftLine[]) {
  return lines.reduce((acc, line) => acc + line.quantidade * line.precoUnitario, 0);
}

export function calcularTotais(subtotal: number, desconto = 0) {
  const total = Math.max(0, subtotal - desconto);
  return { subtotal, desconto, total };
}
