"use client";

import { create } from "zustand";
import type { PipelineStage } from "@/lib/constants";

type OpportunityCard = {
  id: string;
  clientName: string;
  projectTitle: string;
  stage: PipelineStage;
};

type PipelineState = {
  cards: OpportunityCard[];
  setCards: (cards: OpportunityCard[]) => void;
  moveCard: (cardId: string, stage: PipelineStage) => void;
};

export const usePipelineStore = create<PipelineState>((set) => ({
  cards: [],
  setCards: (cards) => set({ cards }),
  moveCard: (cardId, stage) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === cardId ? { ...c, stage } : c))
    }))
}));
