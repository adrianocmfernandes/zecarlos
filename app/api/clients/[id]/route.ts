import { NextResponse } from "next/server";
import { fakeDb } from "@/lib/mockData";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const client = fakeDb.clients.find((item) => item.id === params.id);
  if (!client) return NextResponse.json({ erro: "Cliente não encontrado." }, { status: 404 });
  return NextResponse.json(client);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const index = fakeDb.clients.findIndex((item) => item.id === params.id);
    if (index < 0) return NextResponse.json({ erro: "Cliente não encontrado." }, { status: 404 });

    fakeDb.clients[index] = { ...fakeDb.clients[index], ...data };
    return NextResponse.json(fakeDb.clients[index]);
  } catch {
    return NextResponse.json({ erro: "Erro ao atualizar cliente." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const index = fakeDb.clients.findIndex((item) => item.id === params.id);
  if (index < 0) return NextResponse.json({ erro: "Cliente não encontrado." }, { status: 404 });
  fakeDb.clients.splice(index, 1);
  return NextResponse.json({ ok: true });
}
