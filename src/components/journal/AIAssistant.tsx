import { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import type { AIPatternMatch } from '../../types/journal';

interface AIAssistantProps {
  observation: string;
  onAddPattern: (patternId: number) => void;
}

const CONFIDENCE_COLOR: Record<AIPatternMatch['confidence'], string> = {
  high: '#6B9B5E',
  medium: '#D4A574',
  low: '#8b7355',
};

export function AIAssistant({ observation, onAddPattern }: AIAssistantProps) {
  const [matches, setMatches] = useState<AIPatternMatch[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const { suggest, loading } = useAI();

  const handleSuggest = async () => {
    if (!observation.trim()) return;
    const results = await suggest(observation);
    setMatches(results);
    setHasRun(true);
  };

  return (
    <div className="border border-[var(--color-stone)] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-soil)]/50 border-b border-[var(--color-stone)]">
        <div>
          <span className="text-xs font-medium text-[var(--color-sand)]">AI Pattern Matching</span>
          <span className="ml-2 text-xs text-[var(--color-clay)]">claude-haiku-4-5</span>
        </div>
        <button
          onClick={handleSuggest}
          disabled={loading || !observation.trim()}
          className="px-3 py-1 text-xs bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 text-[var(--color-sprout)] rounded hover:bg-[var(--color-accent)]/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="animate-pulse">◉</span> Thinking…
            </span>
          ) : (
            'Suggest Patterns'
          )}
        </button>
      </div>

      {hasRun && matches.length === 0 && !loading && (
        <p className="text-xs text-[var(--color-clay)] p-3 italic">
          No pattern matches found. Try adding more detail to your observation.
        </p>
      )}

      {matches.length > 0 && (
        <div className="divide-y divide-[var(--color-stone)]/50">
          {matches.map(match => (
            <div key={match.patternId} className="flex items-start gap-3 p-3 hover:bg-[var(--color-soil)]/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-[var(--color-clay)]">#{match.patternId}</span>
                  <span className="text-xs font-medium text-[var(--color-sand)]">{match.patternName}</span>
                  <span
                    className="text-xs px-1 rounded"
                    style={{ color: CONFIDENCE_COLOR[match.confidence], backgroundColor: CONFIDENCE_COLOR[match.confidence] + '22' }}
                  >
                    {match.confidence}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-clay)] leading-relaxed">{match.relevanceReason}</p>
              </div>
              <button
                onClick={() => onAddPattern(match.patternId)}
                className="flex-shrink-0 px-2 py-1 text-xs border border-[var(--color-stone)] text-[var(--color-clay)] rounded hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}

      {!hasRun && !loading && (
        <p className="text-xs text-[var(--color-clay)] p-3">
          Write your observation above, then click Suggest Patterns to find relevant patterns using AI or keyword matching.
        </p>
      )}
    </div>
  );
}
