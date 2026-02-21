import type { Pattern, PatternNode, PatternLink } from '../types/pattern';

export interface GraphData {
  nodes: PatternNode[];
  links: PatternLink[];
}

export function patternsToGraph(patterns: Pattern[]): GraphData {
  const nodes: PatternNode[] = patterns.map(p => ({
    id: p.id,
    name: p.name,
    displayName: p.displayName,
    scale: p.scale,
    stars: p.stars,
  }));

  // Deduplicate edges
  const edgeSet = new Set<string>();
  const links: PatternLink[] = [];

  for (const p of patterns) {
    for (const conn of p.connections) {
      const key = `${p.id}-${conn.id}`;
      const reverseKey = `${conn.id}-${p.id}`;
      if (!edgeSet.has(key) && !edgeSet.has(reverseKey)) {
        edgeSet.add(key);
        links.push({
          source: p.id,
          target: conn.id,
          origin: conn.origin,
        });
      }
    }
  }

  return { nodes, links };
}
