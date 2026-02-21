# Pattern Language Explorer — Claude Context

## Project Overview

A standalone React SPA deployed to Vercel at `pattern-language-explorer.vercel.app`, surfaced via redirect at `kurtneiswender.com/tools/pattern-explorer`. It provides three interactive views of Christopher Alexander's *A Pattern Language* (1977):

1. **Explorer** — Force-directed network graph of all 253 patterns using `react-force-graph-2d`
2. **Diagram** — Isometric 2.5D spatial diagram composer using hand-crafted SVG polygons
3. **Journal** — Field journal with AI-assisted pattern matching via a Vercel Edge Function proxy to `claude-haiku-4-5`, with TF-IDF keyword fallback

## Stack

- **Vite 6** + **React 18** + **TypeScript** + **Tailwind CSS 4**
- **react-force-graph-2d** — canvas graph (60fps, 253 nodes, ~1,800 edges)
- **Zustand** — 4 stores: `usePatternStore`, `useExplorerStore`, `useDiagramStore`, `useJournalStore`
- **React Router v6** with `HashRouter` — avoids Vercel SPA routing conflicts
- **Vercel Edge Function** — `api/claude-proxy.ts` proxies to Anthropic API
- `vite.config.ts` base is `'/'` — required for assets to resolve at the Vercel root deployment

## Data Sources & Citations

The primary dataset `public/patterns.json` (253 patterns, ~408KB) was assembled from two open-source repositories:

### 1. Pattern Graph (structure, connections, metadata)
- **Repository:** https://github.com/BeksOmega/pattern-language-graph
- **Author:** Beka Westberg (bekawestberg@gmail.com)
- **License:** MIT
- **Contents:** GraphML file with all 253 pattern nodes (id, name, section, subsection, stars) and ~1,800 directed edges representing inter-pattern connections
- **Notes:** Patterns 75 (*The Family*) and 211 (*Thickening the Outer Walls*) are absent from the GraphML and were added as stubs in `scripts/parse-graphml.ts`

### 2. Pattern Text (problem & solution)
- **Repository:** https://github.com/zenodotus280/apl-md
- **Live site:** https://patternlanguage.cc (built with Quartz)
- **Author:** zenodotus280
- **License:** Copyleft (see repo LICENSE.md)
- **Contents:** 253 Markdown files, each containing the Problem and Solution text transcribed by hand from the original book over 2020–2024
- **Notes:** Patterns 26 (*Life Cycle*) and 144 (*Bathing Room*) use indented code blocks instead of blockquotes for the Problem section — handled in `scripts/merge-markdown.ts`

### 3. Original Work
- **Book:** Alexander, Christopher, Sara Ishikawa, and Murray Silverstein. *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press, 1977.
- **Wikipedia:** https://en.wikipedia.org/wiki/A_Pattern_Language

## Data Pipeline

Run once in this order to regenerate `public/patterns.json`:

```bash
# Clone source data (not committed to repo)
git clone https://github.com/BeksOmega/pattern-language-graph data/graphml
git clone https://github.com/zenodotus280/apl-md data/apl-md

# Build pipeline
npm run data:parse     # GraphML → scripts/patterns-graph.json
npm run data:merge     # Merge markdown → scripts/patterns-merged.json
npm run data:validate  # Validate + emit → public/patterns.json
```

Expected output: 253 patterns, all IDs 1–253 present, 3 warnings (patterns 26, 144 have sparse problem text).

## Key Architectural Decisions

- `base: '/'` in `vite.config.ts` — the Vercel deployment serves from root; the kurtneiswender.com redirect is transparent to the browser
- `HashRouter` — avoids 404s on direct URL access without server-side catch-all complexity
- `ANTHROPIC_API_KEY` is **never in source code** — set only in Vercel dashboard environment variables
- AI proxy caps input at 1,000 chars and `max_tokens: 1024` to control costs
- If proxy returns non-200, `useAI.ts` falls back silently to `keywordSearch()` (TF-IDF)
- Journal entries persist via Zustand `persist` middleware to `localStorage` under key `pattern-journal-entries`

## Scale Ranges (Alexander's original structure)

| Range | Scale |
|-------|-------|
| 1–8 | Region |
| 9–46 | Town |
| 47–94 | Neighborhood |
| 95–130 | Cluster |
| 131–159 | Building |
| 160–204 | Room |
| 205–253 | Detail |

## Deploy

- **Vercel project:** `pattern-language-explorer` (team: `kurt-neiswenders-projects`)
- **GitHub:** https://github.com/kurtneiswender/pattern-language-explorer
- **Production URL:** https://pattern-language-explorer.vercel.app
- **Integrated at:** https://kurtneiswender.com/tools/pattern-explorer (redirect in `kurtneiswender.com/vercel.json`)
- **Required env var:** `ANTHROPIC_API_KEY` (set in Vercel dashboard, Production only)
