"use client";

import { PIPELINE_STAGES, STAGE_LABELS, type PipelineStage } from "@/lib/constants";
import { usePipelineStore } from "@/store/pipeline-store";

type Props = {
  onStageChange?: (opportunityId: string, stage: PipelineStage) => Promise<void>;
};

export function PipelineBoard({ onStageChange }: Props) {
  const { cards, moveCard } = usePipelineStore();

  async function handleDrop(stage: PipelineStage, cardId: string) {
    moveCard(cardId, stage);
    if (onStageChange) await onStageChange(cardId, stage);
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      {PIPELINE_STAGES.map((stage) => (
        <section
          key={stage}
          className="rounded border bg-white p-2"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const cardId = event.dataTransfer.getData("cardId");
            if (cardId) {
              void handleDrop(stage, cardId);
            }
          }}
        >
          <h3 className="mb-2 text-sm font-semibold">{STAGE_LABELS[stage]}</h3>
          <div className="min-h-20 space-y-2">
            {cards
              .filter((card) => card.stage === stage)
              .map((card) => (
                <article
                  key={card.id}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("cardId", card.id)}
                  className="cursor-move rounded border p-2 text-sm"
                >
                  <p className="font-medium">{card.clientName}</p>
                  <p className="text-xs text-slate-600">{card.projectTitle}</p>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
