import { NextResponse } from "next/server";

const products = [
  {
    id: "prod-1",
    nome: "Cortina Wave",
    descricao: "Ideal para sala",
    basePriceM2: 34.5,
    fabrics: [{ nome: "Linho Bege", pricePerMeter: 19.9 }],
    extras: [{ nome: "Blackout", valorFixo: 120 }]
  }
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const data = await request.json();
  const product = { id: `prod-${Date.now()}`, ...data };
  products.push(product);
  return NextResponse.json(product, { status: 201 });
}
