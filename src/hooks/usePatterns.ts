import { useEffect } from 'react';
import { usePatternStore } from '../store/usePatternStore';
import type { Pattern } from '../types/pattern';

export function usePatterns() {
  const { patterns, loading, error, setPatterns, setLoading, setError } = usePatternStore();

  useEffect(() => {
    if (patterns.length > 0 || loading) return;

    setLoading(true);
    fetch(import.meta.env.BASE_URL + 'patterns.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load patterns: ${res.status}`);
        return res.json() as Promise<Pattern[]>;
      })
      .then(data => {
        setPatterns(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { patterns, loading, error };
}
