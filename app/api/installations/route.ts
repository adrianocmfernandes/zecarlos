import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.installation.findMany({ include: { client: true }, orderBy: { installDate: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const installation = await prisma.installation.create({
      data: {
        clientId: data.clientId,
        opportunityId: data.opportunityId || null,
        installDate: new Date(data.installDate),
        teamName: data.teamName,
        status: data.status || "AGENDADA",
        notes: data.notes || null
      }
    });

    return NextResponse.json(installation, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao agendar instalação." }, { status: 500 });
  }
}
