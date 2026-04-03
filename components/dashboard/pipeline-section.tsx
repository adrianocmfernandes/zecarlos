import { prisma } from "@/lib/prisma";
import { PipelineClient } from "./pipeline.client";

export async function PipelineSection() {
  const opportunities = await prisma.opportunity.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const cards = opportunities.map((opp) => ({
    id: opp.id,
    clientName: opp.client.nome,
    projectTitle: opp.tituloProjeto,
    stage: opp.stage
  }));

  return <PipelineClient initialCards={cards} />;
}
