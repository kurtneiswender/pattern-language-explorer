import type { Pattern } from '../types/pattern';
import type { AIPatternMatch } from '../types/journal';

interface TermFreq {
  [term: string]: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'has',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'use', 'how', 'its',
  'him', 'his', 'she', 'they', 'this', 'that', 'with', 'have', 'from',
  'or', 'an', 'a', 'to', 'of', 'in', 'is', 'it', 'be', 'as', 'at',
  'so', 'if', 'do', 'by', 'on', 'we', 'more', 'also', 'each', 'into',
  'which', 'there', 'when', 'where', 'than', 'then', 'any', 'must',
  'will', 'make', 'made', 'been', 'such', 'some', 'what', 'every',
]);

function termFreq(tokens: string[]): TermFreq {
  const freq: TermFreq = {};
  for (const t of tokens) {
    if (!STOPWORDS.has(t)) {
      freq[t] = (freq[t] || 0) + 1;
    }
  }
  return freq;
}

function tfidfScore(query: string, pattern: Pattern, idf: Map<string, number>): number {
  const qTokens = tokenize(query).filter(t => !STOPWORDS.has(t));
  const docText = `${pattern.displayName} ${pattern.problem} ${pattern.solution}`;
  const docTokens = tokenize(docText);
  const docFreq = termFreq(docTokens);
  const docLen = docTokens.length || 1;

  let score = 0;
  for (const qt of qTokens) {
    const tf = (docFreq[qt] || 0) / docLen;
    const idfVal = idf.get(qt) || 0;
    score += tf * idfVal;
  }
  // Bonus for name match
  if (pattern.displayName.toLowerCase().includes(query.toLowerCase())) {
    score += 2;
  }
  return score;
}

let idfCache: Map<string, number> | null = null;

function buildIDF(patterns: Pattern[]): Map<string, number> {
  if (idfCache) return idfCache;
  const N = patterns.length;
  const docFreq = new Map<string, number>();

  for (const p of patterns) {
    const text = `${p.displayName} ${p.problem} ${p.solution}`;
    const tokens = new Set(tokenize(text).filter(t => !STOPWORDS.has(t)));
    for (const t of tokens) {
      docFreq.set(t, (docFreq.get(t) || 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  for (const [term, df] of docFreq) {
    idf.set(term, Math.log((N + 1) / (df + 1)) + 1);
  }

  idfCache = idf;
  return idf;
}

export function keywordSearch(query: string, patterns: Pattern[], maxResults = 5): AIPatternMatch[] {
  if (!query.trim() || patterns.length === 0) return [];

  const idf = buildIDF(patterns);

  const scored = patterns
    .map(p => ({ pattern: p, score: tfidfScore(query, p, idf) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored.map(({ pattern, score }) => ({
    patternId: pattern.id,
    patternName: pattern.displayName,
    relevanceReason: `Matched based on keywords in problem and solution text.`,
    confidence: score > 1 ? 'high' : score > 0.3 ? 'medium' : 'low',
  }));
}
