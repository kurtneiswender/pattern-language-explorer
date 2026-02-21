export type ScaleLevel = 'region' | 'town' | 'neighborhood' | 'cluster' | 'building' | 'room' | 'detail';
export type ConfidenceStars = 0 | 1 | 2;
export type SectionType = 'towns' | 'buildings' | 'construction';

export interface PatternConnection {
  id: number;
  direction: 'higher' | 'lower';
  origin: 'start' | 'end';
}

export interface Pattern {
  id: number;
  name: string;           // ALL CAPS (as in book)
  displayName: string;    // Title Case
  stars: ConfidenceStars;
  scale: ScaleLevel;
  section: SectionType;
  subsection: string;
  problem: string;
  solution: string;
  body: string;           // '' until OCR pass
  connections: PatternConnection[];
  higherPatterns: number[];
  lowerPatterns: number[];
}

// For force-graph
export interface PatternNode {
  id: number;
  name: string;
  displayName: string;
  scale: ScaleLevel;
  stars: ConfidenceStars;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface PatternLink {
  source: number;
  target: number;
  origin: 'start' | 'end';
}

export const SCALE_COLORS: Record<ScaleLevel, string> = {
  region:       '#2D5A27',
  town:         '#4A7A3F',
  neighborhood: '#6B9B5E',
  cluster:      '#A8B88A',
  building:     '#D4A574',
  room:         '#C4955A',
  detail:       '#B87840',
};

export const SCALE_RADII: Record<ScaleLevel, number> = {
  region:       12,
  town:         10,
  neighborhood: 8,
  cluster:      6,
  building:     6,
  room:         5,
  detail:       4,
};

export const SCALE_LABELS: Record<ScaleLevel, string> = {
  region:       'Region',
  town:         'Town',
  neighborhood: 'Neighborhood',
  cluster:      'Cluster',
  building:     'Building',
  room:         'Room',
  detail:       'Detail',
};

export const ALL_SCALES: ScaleLevel[] = [
  'region', 'town', 'neighborhood', 'cluster', 'building', 'room', 'detail'
];
