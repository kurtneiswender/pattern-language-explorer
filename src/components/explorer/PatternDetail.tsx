import { usePatternStore } from '../../store/usePatternStore';
import { useExplorerStore } from '../../store/useExplorerStore';
import { ConnectionList } from './ConnectionList';
import { starsDisplay } from '../../lib/patternUtils';
import { SCALE_COLORS, SCALE_LABELS } from '../../types/pattern';

export function PatternDetail() {
  const { selectedPatternId, setSelectedPatternId } = useExplorerStore();
  const { getById } = usePatternStore();

  if (!selectedPatternId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 text-[var(--color-clay)]">
        <span className="text-4xl mb-4 opacity-30">◉</span>
        <p className="text-sm">Click any node in the graph to explore a pattern</p>
      </div>
    );
  }

  const pattern = getById(selectedPatternId);
  if (!pattern) return null;

  const stars = starsDisplay(pattern.stars);
  const scaleColor = SCALE_COLORS[pattern.scale];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-[var(--color-stone)]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium"
                style={{ backgroundColor: scaleColor + '33', color: scaleColor }}
              >
                {SCALE_LABELS[pattern.scale]}
              </span>
              {stars && (
                <span className="text-xs text-[var(--color-amber)]">{stars}</span>
              )}
            </div>
            <h2 className="font-['DM_Serif_Display'] text-lg text-[var(--color-linen)] leading-tight">
              <span className="text-[var(--color-clay)] text-base mr-1">#{pattern.id}</span>
              {pattern.displayName}
            </h2>
            <p className="text-xs text-[var(--color-clay)] mt-0.5">{pattern.subsection}</p>
          </div>
          <button
            onClick={() => setSelectedPatternId(null)}
            className="flex-shrink-0 text-[var(--color-clay)] hover:text-[var(--color-linen)] text-lg leading-none transition-colors"
            aria-label="Close detail panel"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {pattern.problem && (
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-[var(--color-clay)] mb-2">
              Problem
            </h3>
            <p className="text-sm text-[var(--color-sand)] leading-relaxed italic border-l-2 border-[var(--color-stone)] pl-3">
              {pattern.problem}
            </p>
          </div>
        )}

        {pattern.solution && (
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-[var(--color-clay)] mb-2">
              Solution
            </h3>
            <p className="text-sm text-[var(--color-linen)] leading-relaxed">
              {pattern.solution}
            </p>
          </div>
        )}

        <ConnectionList
          patternIds={pattern.higherPatterns}
          label="Higher patterns"
        />
        <ConnectionList
          patternIds={pattern.lowerPatterns}
          label="Lower patterns"
        />
      </div>
    </div>
  );
}
