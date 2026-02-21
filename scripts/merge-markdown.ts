import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const graphJson = JSON.parse(
  readFileSync(join(process.cwd(), 'scripts/patterns-graph.json'), 'utf-8')
);

const patternMap = new Map<number, any>();
for (const p of graphJson) {
  patternMap.set(p.id, p);
}

const mdDir = join(process.cwd(), 'data/apl-md/Patterns');
const files = readdirSync(mdDir).filter(f => f.endsWith('.md'));

let merged = 0;
let missing = 0;

for (const file of files) {
  // Extract pattern ID from filename like "Agricultural Valleys (4).md"
  const match = file.match(/\((\d+)\)\.md$/);
  if (!match) {
    console.warn(`Skipping file with unexpected name: ${file}`);
    continue;
  }
  const id = Number(match[1]);
  const pattern = patternMap.get(id);
  if (!pattern) {
    console.warn(`No pattern found for ID ${id} (file: ${file})`);
    missing++;
    continue;
  }

  const content = readFileSync(join(mdDir, file), 'utf-8');

  function extractSection(content: string, header: string): string {
    // Match section content (blockquote or indented code block style)
    const regex = new RegExp(`###\\s+${header}\\s*\\n([\\s\\S]*?)(?=\\n###|\\n---)`, '');
    const match = content.match(regex);
    if (!match) return '';
    const raw = match[1].trim();
    // Remove blockquote markers and indentation
    return raw
      .split('\n')
      .map(line => line.replace(/^>\s*/, '').replace(/^    /, '').trim())
      .filter(line => line.length > 0)
      .join(' ')
      .trim();
  }

  const problem = extractSection(content, 'Problem');
  const solution = extractSection(content, 'Solution');

  pattern.problem = problem;
  pattern.solution = solution;
  merged++;
}

const patterns = Array.from(patternMap.values()).sort((a, b) => a.id - b.id);

const outputPath = join(process.cwd(), 'scripts/patterns-merged.json');
writeFileSync(outputPath, JSON.stringify(patterns, null, 2));
console.log(`Merged ${merged} patterns, ${missing} missing. Wrote patterns-merged.json`);
