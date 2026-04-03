import { NextResponse } from "next/server";
import { fakeDb } from "@/lib/mockData";

function simplePdfBuffer(lines: string[]) {
  const content = lines.join("\\n");
  const pdf = `%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length ${content.length + 33}>>stream\nBT /F1 12 Tf 40 800 Td (${content.replace(/[()]/g, "")}) Tj ET\nendstream\nendobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\nxref\n0 6\n0000000000 65535 f \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n0\n%%EOF`;
  return Buffer.from(pdf, "utf-8");
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const quote = fakeDb.quotes.find((item) => item.id === params.id);
  if (!quote) {
    return NextResponse.json({ erro: "Orçamento não encontrado." }, { status: 404 });
  }

  const lines = [
    `Orçamento ${quote.quoteNumber}`,
    ...quote.lines.map((line) => `${line.descricao} - ${line.quantity} x ${line.unitPrice} = ${line.lineTotal}`),
    `Total: ${quote.total}`
  ];

  const buffer = simplePdfBuffer(lines);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=orcamento-${quote.quoteNumber}.pdf`
    }
  });
}
