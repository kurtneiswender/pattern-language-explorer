import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const patterns = JSON.parse(
  readFileSync(join(process.cwd(), 'scripts/patterns-merged.json'), 'utf-8')
);

let errors: string[] = [];
let warnings: string[] = [];

// Assert exactly 253 patterns
if (patterns.length !== 253) {
  errors.push(`Expected 253 patterns, got ${patterns.length}`);
}

const ids = new Set<number>(patterns.map((p: any) => p.id));

// Assert IDs 1–253 with no gaps
for (let i = 1; i <= 253; i++) {
  if (!ids.has(i)) {
    errors.push(`Missing pattern ID ${i}`);
  }
}

for (const p of patterns) {
  // Assert stars valid
  if (![0, 1, 2].includes(p.stars)) {
    errors.push(`Pattern ${p.id}: invalid stars value ${p.stars}`);
  }

  // Assert scale valid
  const validScales = ['region', 'town', 'neighborhood', 'cluster', 'building', 'room', 'detail'];
  if (!validScales.includes(p.scale)) {
    errors.push(`Pattern ${p.id}: invalid scale ${p.scale}`);
  }

  // Assert connection IDs reference valid patterns
  for (const conn of p.connections || []) {
    if (!ids.has(conn.id)) {
      errors.push(`Pattern ${p.id}: connection references invalid ID ${conn.id}`);
    }
  }
  for (const hid of p.higherPatterns || []) {
    if (!ids.has(hid)) {
      errors.push(`Pattern ${p.id}: higherPatterns references invalid ID ${hid}`);
    }
  }
  for (const lid of p.lowerPatterns || []) {
    if (!ids.has(lid)) {
      errors.push(`Pattern ${p.id}: lowerPatterns references invalid ID ${lid}`);
    }
  }

  // Warn on empty problem/solution (don't error since some may be legitimately sparse)
  if (!p.problem) {
    warnings.push(`Pattern ${p.id} (${p.name}): empty problem`);
  }
  if (!p.solution) {
    warnings.push(`Pattern ${p.id} (${p.name}): empty solution`);
  }
}

// Check all 7 scale levels covered
const validScales = ['region', 'town', 'neighborhood', 'cluster', 'building', 'room', 'detail'];
for (const scale of validScales) {
  const count = patterns.filter((p: any) => p.scale === scale).length;
  console.log(`  ${scale}: ${count} patterns`);
}

if (warnings.length > 0) {
  console.warn(`\n⚠ ${warnings.length} warnings:`);
  warnings.slice(0, 10).forEach(w => console.warn(' ', w));
  if (warnings.length > 10) console.warn(`  ... and ${warnings.length - 10} more`);
}

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} errors:`);
  errors.forEach(e => console.error(' ', e));
  process.exit(1);
} else {
  console.log('\n✓ All validations passed!');
  const outputPath = join(process.cwd(), 'public/patterns.json');
  writeFileSync(outputPath, JSON.stringify(patterns, null, 2));
  console.log(`Wrote ${patterns.length} patterns to public/patterns.json`);
}
