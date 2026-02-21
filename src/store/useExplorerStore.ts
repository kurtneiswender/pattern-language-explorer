import { create } from 'zustand';
import type { ScaleLevel } from '../types/pattern';

interface ExplorerState {
  selectedPatternId: number | null;
  activeScales: Set<ScaleLevel>;
  searchQuery: string;
  setSelectedPatternId: (id: number | null) => void;
  toggleScale: (scale: ScaleLevel) => void;
  setAllScales: (scales: ScaleLevel[]) => void;
  clearScaleFilter: () => void;
  setSearchQuery: (query: string) => void;
}

const ALL_SCALES: ScaleLevel[] = ['region', 'town', 'neighborhood', 'cluster', 'building', 'room', 'detail'];

export const useExplorerStore = create<ExplorerState>((set) => ({
  selectedPatternId: null,
  activeScales: new Set(ALL_SCALES),
  searchQuery: '',
  setSelectedPatternId: (id) => set({ selectedPatternId: id }),
  toggleScale: (scale) =>
    set((state) => {
      const next = new Set(state.activeScales);
      if (next.has(scale)) {
        if (next.size > 1) next.delete(scale); // keep at least one
      } else {
        next.add(scale);
      }
      return { activeScales: next };
    }),
  setAllScales: (scales) => set({ activeScales: new Set(scales) }),
  clearScaleFilter: () => set({ activeScales: new Set(ALL_SCALES) }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
