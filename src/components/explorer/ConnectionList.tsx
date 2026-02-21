import { usePatternStore } from '../../store/usePatternStore';
import { useExplorerStore } from '../../store/useExplorerStore';

interface ConnectionListProps {
  patternIds: number[];
  label: string;
}

export function ConnectionList({ patternIds, label }: ConnectionListProps) {
  const { getById } = usePatternStore();
  const { setSelectedPatternId } = useExplorerStore();

  if (patternIds.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-xs font-medium uppercase tracking-widest text-[var(--color-clay)] mb-2">
        {label}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {patternIds.map(id => {
          const p = getById(id);
          if (!p) return null;
          return (
            <button
              key={id}
              onClick={() => setSelectedPatternId(id)}
              className="text-xs px-2 py-1 bg-[var(--color-soil)] border border-[var(--color-stone)] rounded hover:border-[var(--color-accent)] hover:text-[var(--color-linen)] text-[var(--color-sand)] transition-colors text-left"
            >
              <span className="text-[var(--color-clay)] mr-1">#{id}</span>
              {p.displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
