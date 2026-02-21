import { XMLParser } from 'fast-xml-parser';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCALE_LOOKUP: Array<[number, number, string]> = [
  [1,   8,   'region'],
  [9,   46,  'town'],
  [47,  94,  'neighborhood'],
  [95,  130, 'cluster'],
  [131, 159, 'building'],
  [160, 204, 'room'],
  [205, 253, 'detail'],
];

function getScale(id: number): string {
  for (const [min, max, scale] of SCALE_LOOKUP) {
    if (id >= min && id <= max) return scale;
  }
  return 'detail';
}

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}

function normalizeSection(s: string): 'towns' | 'buildings' | 'construction' {
  const lower = s.toLowerCase();
  if (lower.includes('town')) return 'towns';
  if (lower.includes('building')) return 'buildings';
  if (lower.includes('construction')) return 'construction';
  return 'towns';
}

function normalizeStars(s: string | number): 0 | 1 | 2 {
  const n = Number(s);
  if (n === 0) return 0;
  if (n === 1) return 1;
  return 2;
}

const graphmlPath = join(process.cwd(), 'data/graphml/patterns.graphml');
const xml = readFileSync(graphmlPath, 'utf-8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => ['node', 'edge', 'data'].includes(name),
});

const parsed = parser.parse(xml);
const graph = parsed.graphml.graph;
const nodes: any[] = graph.node;
const edges: any[] = graph.edge || [];

// Build pattern map from nodes
const patternMap = new Map<number, any>();

for (const node of nodes) {
  const id = Number(node['@_id']);
  const dataArr: any[] = node.data || [];
  const dataMap: Record<string, string> = {};
  for (const d of dataArr) {
    dataMap[d['@_key']] = String(d['#text'] ?? d);
  }
  patternMap.set(id, {
    id,
    name: dataMap.name || '',
    displayName: toTitleCase(dataMap.name || ''),
    stars: normalizeStars(dataMap.stars ?? 0),
    scale: getScale(id),
    section: normalizeSection(dataMap.section || 'towns'),
    subsection: dataMap.subsection || '',
    problem: '',
    solution: '',
    body: '',
    connections: [] as any[],
    higherPatterns: [] as number[],
    lowerPatterns: [] as number[],
  });
}

// Process edges
// direction: if origin === 'start', source is higher and target is lower (source→target means source links to lower pattern)
// Actually per Alexander: edges FROM a pattern go to patterns it references;
// "start" means it's listed at the start (higher patterns that lead to this one)
// "end" means it's listed at the end (lower patterns that this one leads to)
// Edge source→target with origin=start means: target is a lower-level pattern from source's perspective
// Edge source→target with origin=end means: target is a lower-level pattern reached after this pattern

for (const edge of edges) {
  const source = Number(edge['@_source']);
  const target = Number(edge['@_target']);
  if (source === target) continue; // skip self-loops

  const dataArr: any[] = edge.data || [];
  let origin = 'start';
  for (const d of dataArr) {
    if (d['@_key'] === 'origin') {
      origin = String(d['#text'] ?? d);
    }
  }

  // In Alexander's notation:
  // Higher patterns (mentioned before the problem) have origin 'start'
  // Lower patterns (mentioned after the solution) have origin 'end'
  // The edge direction source→target in the graphml means source mentions target

  const sourcePattern = patternMap.get(source);
  const targetPattern = patternMap.get(target);

  if (!sourcePattern || !targetPattern) continue;

  if (origin === 'start') {
    // target is a higher pattern for source (source says "see pattern X" at the start)
    // Actually, re-reading: origin=start means the edge origin is in the "start" list of source
    // The "start" of a pattern chapter lists higher patterns that lead here
    // So: target is higher than source → source.higherPatterns includes target
    if (!sourcePattern.higherPatterns.includes(target)) {
      sourcePattern.higherPatterns.push(target);
    }
    sourcePattern.connections.push({ id: target, direction: 'higher', origin: 'start' });

    // Reciprocally: source is a lower pattern of target
    if (!targetPattern.lowerPatterns.includes(source)) {
      targetPattern.lowerPatterns.push(source);
    }
  } else {
    // origin=end: target is a lower pattern for source
    if (!sourcePattern.lowerPatterns.includes(target)) {
      sourcePattern.lowerPatterns.push(target);
    }
    sourcePattern.connections.push({ id: target, direction: 'lower', origin: 'end' });

    // Reciprocally: source is a higher pattern of target
    if (!targetPattern.higherPatterns.includes(source)) {
      targetPattern.higherPatterns.push(source);
    }
  }
}

// Add any missing patterns as stubs (fallback for GraphML gaps)
const MISSING_STUBS: Array<{ id: number; name: string; section: string; subsection: string; stars: number }> = [
  { id: 75,  name: 'THE FAMILY',                  section: 'TOWNS',        subsection: 'SOCIAL INSTITUTIONS',    stars: 1 },
  { id: 211, name: 'THICKENING THE OUTER WALLS',  section: 'CONSTRUCTION', subsection: 'STRUCTURAL LAYOUT',      stars: 1 },
];
for (const stub of MISSING_STUBS) {
  if (!patternMap.has(stub.id)) {
    console.log(`Adding missing stub for pattern ${stub.id}: ${stub.name}`);
    patternMap.set(stub.id, {
      id: stub.id,
      name: stub.name,
      displayName: toTitleCase(stub.name),
      stars: normalizeStars(stub.stars),
      scale: getScale(stub.id),
      section: normalizeSection(stub.section),
      subsection: stub.subsection,
      problem: '',
      solution: '',
      body: '',
      connections: [],
      higherPatterns: [],
      lowerPatterns: [],
    });
  }
}

// Convert to sorted array
const patterns = Array.from(patternMap.values()).sort((a, b) => a.id - b.id);

const outputPath = join(process.cwd(), 'scripts/patterns-graph.json');
writeFileSync(outputPath, JSON.stringify(patterns, null, 2));
console.log(`Wrote ${patterns.length} patterns to patterns-graph.json`);
