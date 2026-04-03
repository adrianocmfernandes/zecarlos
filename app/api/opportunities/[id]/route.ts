import { NextResponse } from "next/server";
import { PIPELINE_STAGES } from "@/lib/constants";
import { moveOpportunity } from "@/lib/mockData";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    if (!PIPELINE_STAGES.includes(data.stage)) {
      return NextResponse.json({ erro: "Estado inválido." }, { status: 400 });
    }

    const updated = moveOpportunity(params.id, data.stage);
    if (!updated) return NextResponse.json({ erro: "Oportunidade não encontrada." }, { status: 404 });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ erro: "Erro ao atualizar oportunidade." }, { status: 500 });
  }
}
