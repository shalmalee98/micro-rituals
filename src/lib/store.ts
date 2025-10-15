import { create } from "zustand";

interface RitualState {
  mood: string | null;
  ritual: any | null;
  setMood: (m: string) => void;
  setRitual: (r: any) => void;
  completed: any[];
  addCompleted: (r: any) => void;
}

export const useRitualStore = create<RitualState>((set) => ({
  mood: null,
  ritual: null,
  completed: [],
  setMood: (m) => set({ mood: m }),
  setRitual: (r) => set({ ritual: r }),
  addCompleted: (r) =>
    set((s) => ({ completed: [...s.completed, r] })),
}));
