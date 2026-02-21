import { create } from 'zustand';
import type { Pattern } from '../types/pattern';

interface PatternState {
  patterns: Pattern[];
  loading: boolean;
  error: string | null;
  setPatterns: (patterns: Pattern[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getById: (id: number) => Pattern | undefined;
}

export const usePatternStore = create<PatternState>((set, get) => ({
  patterns: [],
  loading: false,
  error: null,
  setPatterns: (patterns) => set({ patterns }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  getById: (id) => get().patterns.find(p => p.id === id),
}));
