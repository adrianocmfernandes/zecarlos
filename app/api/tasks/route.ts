import { NextResponse } from "next/server";
import { createId, fakeDb } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(fakeDb.tasks);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const task = {
      id: createId("task"),
      clientName: String(data.clientName || "Cliente Demo"),
      titulo: String(data.titulo || "Nova tarefa"),
      dueDate: String(data.dueDate || new Date().toISOString()),
      status: data.status === "CONCLUIDA" ? "CONCLUIDA" : "PENDENTE"
    };

    fakeDb.tasks.unshift(task);
    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar tarefa." }, { status: 500 });
  }
}
