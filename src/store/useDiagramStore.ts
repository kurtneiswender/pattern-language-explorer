import { create } from 'zustand';

export interface PlacedBlock {
  id: string;           // unique placement id
  patternId: number;
  gridX: number;        // isometric grid position
  gridZ: number;
  label: string;
  blockType: string;    // from BlockRegistry
  w: number;
  d: number;
  h: number;
}

interface DiagramState {
  blocks: PlacedBlock[];
  panX: number;
  panY: number;
  addBlock: (block: Omit<PlacedBlock, 'id'>) => void;
  removeBlock: (id: string) => void;
  clearBlocks: () => void;
  setPan: (x: number, y: number) => void;
}

export const useDiagramStore = create<DiagramState>((set) => ({
  blocks: [],
  panX: 0,
  panY: 0,
  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks, { ...block, id: crypto.randomUUID() }],
    })),
  removeBlock: (id) =>
    set((state) => ({ blocks: state.blocks.filter(b => b.id !== id) })),
  clearBlocks: () => set({ blocks: [] }),
  setPan: (panX, panY) => set({ panX, panY }),
}));
