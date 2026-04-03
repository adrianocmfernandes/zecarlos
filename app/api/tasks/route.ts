import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tasks = await prisma.task.findMany({ include: { client: true }, orderBy: { dueDate: "asc" } });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const task = await prisma.task.create({
      data: {
        clientId: data.clientId,
        titulo: data.titulo,
        descricao: data.descricao || null,
        taskType: data.taskType,
        dueDate: new Date(data.dueDate),
        status: data.status || "PENDENTE"
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar tarefa." }, { status: 500 });
  }
}
