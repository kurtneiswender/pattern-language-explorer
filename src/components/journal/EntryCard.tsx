import { usePatternStore } from '../../store/usePatternStore';
import { useJournalStore } from '../../store/useJournalStore';
import type { JournalEntry } from '../../types/journal';

interface EntryCardProps {
  entry: JournalEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const { activeEntryId, setActiveEntryId, deleteEntry } = useJournalStore();
  const { patterns } = usePatternStore();
  const isActive = activeEntryId === entry.id;

  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => setActiveEntryId(isActive ? null : entry.id)}
      className={`p-3 cursor-pointer border-b border-[var(--color-stone)]/50 hover:bg-[var(--color-soil)]/30 transition-colors ${
        isActive ? 'bg-[var(--color-soil)]/50 border-l-2 border-l-[var(--color-accent)]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-linen)] truncate">
            {entry.title || <span className="italic text-[var(--color-clay)]">Untitled</span>}
          </p>
          {entry.observation && (
            <p className="text-xs text-[var(--color-clay)] mt-0.5 line-clamp-2">
              {entry.observation}
            </p>
          )}
          {entry.location && (
            <p className="text-xs text-[var(--color-stone)] mt-0.5">📍 {entry.location}</p>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); deleteEntry(entry.id); }}
          className="flex-shrink-0 text-[var(--color-stone)] hover:text-red-400 text-sm transition-colors"
          aria-label="Delete entry"
        >
          ×
        </button>
      </div>

      {/* Tags */}
      {entry.taggedPatterns.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {entry.taggedPatterns.slice(0, 4).map(id => {
            const p = patterns.find(x => x.id === id);
            return (
              <span
                key={id}
                className="text-xs px-1.5 py-0.5 bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 text-[var(--color-sprout)] rounded-full"
              >
                #{id} {p?.displayName?.split(' ')[0]}
              </span>
            );
          })}
          {entry.taggedPatterns.length > 4 && (
            <span className="text-xs text-[var(--color-clay)]">+{entry.taggedPatterns.length - 4}</span>
          )}
        </div>
      )}

      <p className="text-xs text-[var(--color-stone)] mt-1.5">{date}</p>
    </div>
  );
}
