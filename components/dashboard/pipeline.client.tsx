"use client";

import { useEffect } from "react";
import { PipelineBoard } from "@/components/kanban/pipeline-board";
import { usePipelineStore } from "@/store/pipeline-store";
import type { PipelineStage } from "@prisma/client";

type Card = {
  id: string;
  clientName: string;
  projectTitle: string;
  stage: PipelineStage;
};

export function PipelineClient({ initialCards }: { initialCards: Card[] }) {
  const { setCards } = usePipelineStore();

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards, setCards]);

  async function onStageChange(opportunityId: string, stage: PipelineStage) {
    await fetch(`/api/opportunities/${opportunityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage })
    });
  }

  return (
    <section className="space-y-2">
      <h2 className="text-base font-semibold">Pipeline de vendas</h2>
      <PipelineBoard onStageChange={onStageChange} />
    </section>
  );
}
