import { useJournalStore } from '../../store/useJournalStore';
import { EntryCard } from './EntryCard';

interface EntryListProps {
  onNewEntry: () => void;
}

export function EntryList({ onNewEntry }: EntryListProps) {
  const { entries } = useJournalStore();

  // Sorted newest-first (already sorted on insert, but make explicit)
  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col h-full border-r border-[var(--color-stone)] bg-[var(--color-bark)]" style={{ width: '280px', flexShrink: 0 }}>
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-stone)]">
        <h3 className="text-xs font-medium uppercase tracking-widest text-[var(--color-clay)]">
          Entries ({entries.length})
        </h3>
        <button
          onClick={onNewEntry}
          className="px-2.5 py-1 text-xs bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 text-[var(--color-sprout)] rounded hover:bg-[var(--color-accent)]/30 transition-colors"
        >
          + New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 text-[var(--color-clay)] opacity-60">
            <span className="text-3xl mb-3">◈</span>
            <p className="text-xs">No entries yet.</p>
            <p className="text-xs mt-1">Click + New to start a field journal entry.</p>
          </div>
        ) : (
          sorted.map(entry => <EntryCard key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}
