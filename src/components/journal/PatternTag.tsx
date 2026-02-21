import { useState, useMemo } from 'react';
import { usePatternStore } from '../../store/usePatternStore';

interface PatternTagProps {
  taggedPatterns: number[];
  onAdd: (patternId: number) => void;
  onRemove: (patternId: number) => void;
}

export function PatternTag({ taggedPatterns, onAdd, onRemove }: PatternTagProps) {
  const { patterns } = usePatternStore();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return patterns
      .filter(p =>
        !taggedPatterns.includes(p.id) &&
        (p.displayName.toLowerCase().includes(q) || String(p.id).startsWith(q))
      )
      .slice(0, 8);
  }, [patterns, search, taggedPatterns]);

  return (
    <div>
      {/* Tagged patterns */}
      {taggedPatterns.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {taggedPatterns.map(id => {
            const p = patterns.find(x => x.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 text-[var(--color-sprout)] rounded-full"
              >
                <span className="text-[var(--color-clay)]">#{id}</span>
                {p?.displayName}
                <button
                  onClick={() => onRemove(id)}
                  className="ml-0.5 text-[var(--color-clay)] hover:text-[var(--color-linen)] leading-none"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Search to add */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Add pattern tag…"
          className="w-full px-2.5 py-1.5 text-xs bg-[var(--color-soil)] border border-[var(--color-stone)] rounded text-[var(--color-linen)] placeholder-[var(--color-clay)] focus:outline-none focus:border-[var(--color-accent)]"
        />
        {open && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-[var(--color-bark)] border border-[var(--color-stone)] rounded shadow-lg z-20 max-h-48 overflow-y-auto">
            {suggestions.map(p => (
              <button
                key={p.id}
                onMouseDown={() => { onAdd(p.id); setSearch(''); setOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--color-soil)] text-[var(--color-sand)] flex items-center gap-2"
              >
                <span className="text-[var(--color-clay)] font-mono">#{p.id}</span>
                {p.displayName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
