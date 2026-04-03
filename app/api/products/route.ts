import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.productType.findMany({ include: { fabrics: true, extras: true } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const product = await prisma.productType.create({
      data: {
        nome: data.nome,
        descricao: data.descricao || null,
        basePriceM2: data.basePriceM2,
        fabrics: {
          create: (data.fabrics || []).map((f: Record<string, unknown>) => ({
            nome: String(f.nome),
            pricePerMeter: Number(f.pricePerMeter)
          }))
        },
        extras: {
          create: (data.extras || []).map((e: Record<string, unknown>) => ({
            nome: String(e.nome),
            valorFixo: e.valorFixo ? Number(e.valorFixo) : null,
            valorPercent: e.valorPercent ? Number(e.valorPercent) : null
          }))
        }
      },
      include: { fabrics: true, extras: true }
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar produto." }, { status: 500 });
  }
}
