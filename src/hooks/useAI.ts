import { useState } from 'react';
import { usePatternStore } from '../store/usePatternStore';
import { keywordSearch } from '../lib/keywordSearch';
import type { AIPatternMatch } from '../types/journal';

interface UseAIReturn {
  suggest: (observation: string) => Promise<AIPatternMatch[]>;
  loading: boolean;
  error: string | null;
}

export function useAI(): UseAIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { patterns } = usePatternStore();

  const suggest = async (observation: string): Promise<AIPatternMatch[]> => {
    setLoading(true);
    setError(null);

    // Trim input to 1000 chars as per spec
    const trimmedInput = observation.slice(0, 1000);

    try {
      const res = await fetch('/api/claude-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observation: trimmedInput }),
      });

      if (!res.ok) {
        throw new Error(`Proxy returned ${res.status}`);
      }

      const data = await res.json() as { matches: AIPatternMatch[] };
      setLoading(false);
      return data.matches || [];
    } catch (err) {
      // Fall back to keyword search
      console.warn('AI proxy failed, falling back to keyword search:', err);
      setError(null); // Don't show error to user — fallback is seamless
      const fallback = keywordSearch(trimmedInput, patterns, 5);
      setLoading(false);
      return fallback;
    }
  };

  return { suggest, loading, error };
}
