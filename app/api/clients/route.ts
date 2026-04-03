import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.nome || !data.telefone) {
      return NextResponse.json({ erro: "Nome e telefone são obrigatórios." }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email || null,
        morada: data.morada || null,
        origemLead: data.origemLead || null,
        notas: data.notas || null
      }
    });

    return NextResponse.json(client, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar cliente." }, { status: 500 });
  }
}
