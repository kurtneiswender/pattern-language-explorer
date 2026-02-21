import { useMemo } from 'react';
import { usePatternStore } from '../store/usePatternStore';
import { useExplorerStore } from '../store/useExplorerStore';
import { patternsToGraph } from '../lib/graphData';
import { filterByScale, searchByKeyword } from '../lib/patternUtils';
import type { GraphData } from '../lib/graphData';

export function useGraphLayout(): GraphData {
  const { patterns } = usePatternStore();
  const { activeScales, searchQuery } = useExplorerStore();

  return useMemo(() => {
    let filtered = filterByScale(patterns, activeScales);
    if (searchQuery.trim()) {
      filtered = searchByKeyword(filtered, searchQuery);
    }
    return patternsToGraph(filtered);
  }, [patterns, activeScales, searchQuery]);
}
