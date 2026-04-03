import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gerarPdfOrcamento } from "@/lib/pdf";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      lines: true,
      opportunity: { include: { client: true } }
    }
  });

  if (!quote) {
    return NextResponse.json({ erro: "Orçamento não encontrado." }, { status: 404 });
  }

  const stream = await gerarPdfOrcamento({
    quoteNumber: quote.quoteNumber,
    clientName: quote.opportunity.client.nome,
    lines: quote.lines.map((line) => ({
      descricao: line.descricao,
      quantidade: Number(line.quantity),
      unitPrice: Number(line.unitPrice),
      lineTotal: Number(line.lineTotal)
    })),
    total: Number(quote.total)
  });

  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=orcamento-${quote.quoteNumber}.pdf`
    }
  });
}
