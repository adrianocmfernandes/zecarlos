"use client";

import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { PIPELINE_STAGES, STAGE_LABELS } from "@/lib/constants";
import { usePipelineStore } from "@/store/pipeline-store";
import type { PipelineStage } from "@prisma/client";

type Props = {
  onStageChange?: (opportunityId: string, stage: PipelineStage) => Promise<void>;
};

export function PipelineBoard({ onStageChange }: Props) {
  const { cards, moveCard } = usePipelineStore();

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const stage = result.destination.droppableId as PipelineStage;
    const cardId = result.draggableId;

    moveCard(cardId, stage);
    if (onStageChange) await onStageChange(cardId, stage);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {PIPELINE_STAGES.map((stage) => (
          <Droppable key={stage} droppableId={stage}>
            {(provided) => (
              <section ref={provided.innerRef} {...provided.droppableProps} className="rounded border bg-white p-2">
                <h3 className="mb-2 text-sm font-semibold">{STAGE_LABELS[stage]}</h3>
                <div className="space-y-2 min-h-20">
                  {cards
                    .filter((card) => card.stage === stage)
                    .map((card, index) => (
                      <Draggable draggableId={card.id} index={index} key={card.id}>
                        {(dragProvided) => (
                          <article
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className="rounded border p-2 text-sm"
                          >
                            <p className="font-medium">{card.clientName}</p>
                            <p className="text-xs text-slate-600">{card.projectTitle}</p>
                          </article>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
