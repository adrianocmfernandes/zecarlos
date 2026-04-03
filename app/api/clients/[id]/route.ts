import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) return NextResponse.json({ erro: "Cliente não encontrado." }, { status: 404 });
  return NextResponse.json(client);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        morada: data.morada,
        origemLead: data.origemLead,
        notas: data.notas
      }
    });
    return NextResponse.json(client);
  } catch {
    return NextResponse.json({ erro: "Erro ao atualizar cliente." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.client.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ erro: "Erro ao remover cliente." }, { status: 500 });
  }
}
