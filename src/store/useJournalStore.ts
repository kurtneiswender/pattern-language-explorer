import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalEntry } from '../types/journal';

interface JournalState {
  entries: JournalEntry[];
  activeEntryId: string | null;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  setActiveEntryId: (id: string | null) => void;
  getActiveEntry: () => JournalEntry | undefined;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      activeEntryId: null,
      addEntry: (entry) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        set((state) => ({
          entries: [
            { ...entry, id, createdAt: now, updatedAt: now },
            ...state.entries,
          ],
          activeEntryId: id,
        }));
        return id;
      },
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map(e =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter(e => e.id !== id),
          activeEntryId: state.activeEntryId === id ? null : state.activeEntryId,
        })),
      setActiveEntryId: (id) => set({ activeEntryId: id }),
      getActiveEntry: () => {
        const { entries, activeEntryId } = get();
        return entries.find(e => e.id === activeEntryId);
      },
    }),
    {
      name: 'pattern-journal-entries',
    }
  )
);
