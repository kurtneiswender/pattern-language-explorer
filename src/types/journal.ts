export interface AIPatternMatch {
  patternId: number;
  patternName: string;
  relevanceReason: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface JournalEntry {
  id: string;            // crypto.randomUUID()
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
  title: string;
  observation: string;
  location?: string;
  taggedPatterns: number[];
  aiMatches?: AIPatternMatch[];
  aiQuery?: string;
}
