import { NextResponse } from "next/server";
import { createId, fakeDb } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(fakeDb.clients);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.nome || !data.telefone) {
      return NextResponse.json({ erro: "Nome e telefone são obrigatórios." }, { status: 400 });
    }

    const client = {
      id: createId("client"),
      nome: String(data.nome),
      telefone: String(data.telefone),
      email: data.email ? String(data.email) : undefined,
      morada: data.morada ? String(data.morada) : undefined,
      origemLead: data.origemLead ? String(data.origemLead) : undefined,
      notas: data.notas ? String(data.notas) : undefined
    };

    fakeDb.clients.unshift(client);
    return NextResponse.json(client, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar cliente." }, { status: 500 });
  }
}
