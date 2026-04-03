import { NextResponse } from "next/server";
import { calcularTotalLinhas, calcularTotais } from "@/lib/pricing";
import { createId, fakeDb } from "@/lib/mockData";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.opportunityId || !Array.isArray(data.lines) || data.lines.length === 0) {
      return NextResponse.json({ erro: "Dados de orçamento inválidos." }, { status: 400 });
    }

    const preparedLines = data.lines.map((line: Record<string, unknown>) => {
      const quantity = Number(line.quantity ?? 0);
      const unitPrice = Number(line.unitPrice ?? 0);
      return {
        descricao: String(line.descricao ?? "Linha sem descrição"),
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice
      };
    });

    const subtotal = calcularTotalLinhas(preparedLines.map((line: { descricao: string; quantity: number; unitPrice: number }) => ({
      descricao: line.descricao,
      quantidade: line.quantity,
      precoUnitario: line.unitPrice
    })));

    const { total, desconto } = calcularTotais(subtotal, Number(data.discount || 0));

    const quote = {
      id: createId("quote"),
      opportunityId: String(data.opportunityId),
      quoteNumber: `ORC-${Date.now()}`,
      subtotal,
      discount: desconto,
      total,
      lines: preparedLines
    };

    fakeDb.quotes.unshift(quote);
    return NextResponse.json(quote, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar orçamento." }, { status: 500 });
  }
}
