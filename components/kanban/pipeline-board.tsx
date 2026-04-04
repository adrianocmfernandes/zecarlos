"use client";

import { PIPELINE_STAGE_LABELS, PIPELINE_STAGES, type Opportunity, type PipelineStage } from "@/types";

type Props = {
  opportunities: Opportunity[];
  onDrop: (opportunityId: string, stage: PipelineStage) => void;
  getClientName: (clientId: string) => string;
};

export function PipelineBoard({ opportunities, onDrop, getClientName }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      {PIPELINE_STAGES.map((stage) => (
        <section
          key={stage}
          className="rounded-2xl bg-card p-3"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const opportunityId = event.dataTransfer.getData("opportunity_id");
            if (opportunityId) onDrop(opportunityId, stage);
          }}
        >
          <h3 className="mb-2 text-xs font-semibold text-foreground">{PIPELINE_STAGE_LABELS[stage]}</h3>
          <div className="min-h-20 space-y-2">
            {opportunities
              .filter((item) => item.stage === stage)
              .map((item) => (
                <article
                  key={item.id}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("opportunity_id", item.id)}
                  className="rounded-xl border border-border bg-background p-2 text-xs cursor-move"
                >
                  <p className="font-semibold text-foreground">{getClientName(item.client_id)}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}