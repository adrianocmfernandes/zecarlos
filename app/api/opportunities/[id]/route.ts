import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PIPELINE_STAGES } from "@/lib/constants";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

    if (!PIPELINE_STAGES.includes(data.stage)) {
      return NextResponse.json({ erro: "Estado inválido." }, { status: 400 });
    }

    const updated = await prisma.opportunity.update({
      where: { id: params.id },
      data: { stage: data.stage }
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ erro: "Erro ao atualizar oportunidade." }, { status: 500 });
  }
}
