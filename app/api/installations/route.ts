import { NextResponse } from "next/server";
import { createId, fakeDb } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(fakeDb.installations);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const installation = {
      id: createId("inst"),
      clientName: String(data.clientName || "Cliente Demo"),
      installDate: String(data.installDate || new Date().toISOString()),
      teamName: String(data.teamName || "Equipa A"),
      status: "AGENDADA" as const
    };

    fakeDb.installations.unshift(installation);
    return NextResponse.json(installation, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao agendar instalação." }, { status: 500 });
  }
}
