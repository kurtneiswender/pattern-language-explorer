import type { Pattern, ScaleLevel } from '../types/pattern';

export function filterByScale(patterns: Pattern[], scales: Set<ScaleLevel>): Pattern[] {
  return patterns.filter(p => scales.has(p.scale));
}

export function searchByKeyword(patterns: Pattern[], query: string): Pattern[] {
  if (!query.trim()) return patterns;
  const q = query.toLowerCase().trim();
  // Check numeric ID first
  const numId = parseInt(q, 10);
  if (!isNaN(numId)) {
    const exact = patterns.filter(p => p.id === numId);
    if (exact.length) return exact;
  }
  return patterns.filter(p =>
    p.displayName.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q) ||
    p.problem.toLowerCase().includes(q) ||
    p.solution.toLowerCase().includes(q)
  );
}

export function getById(patterns: Pattern[], id: number): Pattern | undefined {
  return patterns.find(p => p.id === id);
}

export function starsDisplay(stars: 0 | 1 | 2): string {
  if (stars === 2) return '✦✦';
  if (stars === 1) return '✦';
  return '';
}
