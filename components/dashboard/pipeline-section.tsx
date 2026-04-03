import { getPipelineData } from "@/lib/mockData";
import { PipelineClient } from "./pipeline.client";

export function PipelineSection() {
  const cards = getPipelineData().map((opp) => ({
    id: opp.id,
    clientName: opp.clientName,
    projectTitle: opp.projectTitle,
    stage: opp.stage
  }));

  return <PipelineClient initialCards={cards} />;
}
