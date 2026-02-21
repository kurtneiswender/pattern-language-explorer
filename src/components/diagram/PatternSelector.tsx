import { useState, useMemo } from 'react';
import { usePatternStore } from '../../store/usePatternStore';
import { useDiagramStore } from '../../store/useDiagramStore';
import { getBlockDef } from './BlockRegistry';
import type { ScaleLevel } from '../../types/pattern';

const DIAGRAM_SCALES: ScaleLevel[] = ['building', 'room', 'detail'];

export function PatternSelector() {
  const { patterns } = usePatternStore();
  const { addBlock } = useDiagramStore();
  const [search, setSearch] = useState('');
  const [activeScale, setActiveScale] = useState<ScaleLevel | 'all'>('all');

  const eligible = useMemo(() => {
    return patterns.filter(p => {
      const hasDef = !!getBlockDef(p.id);
      const scaleOk = activeScale === 'all' ? DIAGRAM_SCALES.includes(p.scale) : p.scale === activeScale;
      const searchOk = !search.trim() ||
        p.displayName.toLowerCase().includes(search.toLowerCase()) ||
        String(p.id).includes(search.trim());
      return hasDef && scaleOk && searchOk;
    });
  }, [patterns, search, activeScale]);

  const [nextGridX, setNextGridX] = useState(0);
  const [nextGridZ, setNextGridZ] = useState(0);

  const handleAdd = (patternId: number, displayName: string) => {
    const def = getBlockDef(patternId);
    if (!def) return;
    addBlock({
      patternId,
      gridX: nextGridX,
      gridZ: nextGridZ,
      label: displayName.split(' ').slice(0, 2).join(' '),
      blockType: def.type,
      w: def.w,
      d: def.d,
      h: def.h,
    });
    // Advance grid position
    setNextGridX(prev => {
      const next = prev + def.w + 1;
      if (next > 8) {
        setNextGridZ(z => z + 4);
        return 0;
      }
      return next;
    });
  };

  const scaleColors: Record<ScaleLevel, string> = {
    building: '#D4A574',
    room: '#C4955A',
    detail: '#B87840',
    region: '#2D5A27',
    town: '#4A7A3F',
    neighborhood: '#6B9B5E',
    cluster: '#A8B88A',
  };

  return (
    <div className="flex flex-col h-full border-r border-[var(--color-stone)] bg-[var(--color-bark)]" style={{ width: '280px', flexShrink: 0 }}>
      <div className="p-3 border-b border-[var(--color-stone)]">
        <h3 className="text-xs font-medium uppercase tracking-widest text-[var(--color-clay)] mb-2">
          Add Patterns
        </h3>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-full px-2.5 py-1.5 text-xs bg-[var(--color-soil)] border border-[var(--color-stone)] rounded text-[var(--color-linen)] placeholder-[var(--color-clay)] focus:outline-none focus:border-[var(--color-accent)]"
        />
        {/* Scale tabs */}
        <div className="flex gap-1 mt-2">
          {(['all', ...DIAGRAM_SCALES] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveScale(s)}
              style={s !== 'all' && activeScale === s ? { borderColor: scaleColors[s], color: scaleColors[s] } : {}}
              className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                activeScale === s
                  ? s === 'all' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : ''
                  : 'border-[var(--color-stone)] text-[var(--color-stone)] hover:border-[var(--color-clay)]'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {eligible.length === 0 ? (
          <p className="text-xs text-[var(--color-clay)] p-3">No patterns found</p>
        ) : (
          eligible.map(p => {
            const def = getBlockDef(p.id)!;
            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-stone)]/50 hover:bg-[var(--color-soil)]/50 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[var(--color-clay)] font-mono">#{p.id}</span>
                    <span
                      className="text-xs px-1 rounded"
                      style={{ color: scaleColors[p.scale], backgroundColor: scaleColors[p.scale] + '22' }}
                    >
                      {def.type}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-sand)] truncate">{p.displayName}</p>
                </div>
                <button
                  onClick={() => handleAdd(p.id, p.displayName)}
                  className="flex-shrink-0 ml-2 px-2 py-1 text-xs bg-[var(--color-soil)] border border-[var(--color-stone)] text-[var(--color-clay)] rounded opacity-0 group-hover:opacity-100 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                >
                  + Add
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
