import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularTotalLinhas, calcularTotais } from "@/lib/pricing";

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

    const subtotal = calcularTotalLinhas(
      preparedLines.map((line: { descricao: string; quantity: number; unitPrice: number }) => ({
        descricao: line.descricao,
        quantidade: line.quantity,
        precoUnitario: line.unitPrice
      }))
    );

    const { total, desconto } = calcularTotais(subtotal, Number(data.discount || 0));

    const quote = await prisma.quote.create({
      data: {
        opportunityId: data.opportunityId,
        quoteNumber: `ORC-${Date.now()}`,
        discount: desconto,
        subtotal,
        total,
        lines: {
          create: preparedLines.map((line: { descricao: string; quantity: number; unitPrice: number; lineTotal: number }) => ({
            descricao: line.descricao,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            lineTotal: line.lineTotal
          }))
        }
      },
      include: { lines: true }
    });

    return NextResponse.json(quote, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar orçamento." }, { status: 500 });
  }
}
