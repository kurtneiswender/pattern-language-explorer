import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useDiagramStore } from '../../store/useDiagramStore';
import { usePatternStore } from '../../store/usePatternStore';
import { getBlockDef } from './BlockRegistry';
import { IsometricBlock, type CompatibilityStatus } from './IsometricBlock';
import { sortBlocksByDepth } from '../../lib/isometricBlocks';

const SVG_WIDTH = 900;
const SVG_HEIGHT = 600;
const ORIGIN_X = SVG_WIDTH / 2;
const ORIGIN_Y = 80;

interface IsometricCanvasProps {
  onExportSvg: (fn: () => void) => void;
}

export function IsometricCanvas({ onExportSvg }: IsometricCanvasProps) {
  const { blocks, panX, panY, setPan, removeBlock } = useDiagramStore();
  const { patterns } = usePatternStore();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Compute compatibility status for each block based on pattern connection graph
  const compatibilityMap = useMemo<Map<string, CompatibilityStatus>>(() => {
    const map = new Map<string, CompatibilityStatus>();
    if (blocks.length <= 1) {
      blocks.forEach(b => map.set(b.id, 'neutral'));
      return map;
    }
    const placedIds = new Set(blocks.map(b => b.patternId));
    blocks.forEach(block => {
      const pattern = patterns.find(p => p.id === block.patternId);
      if (!pattern) { map.set(block.id, 'neutral'); return; }

      // Direct: this pattern connects to another placed pattern
      const ownConnIds = new Set((pattern.connections ?? []).map((c: { id: number }) => c.id));
      const hasDirect = blocks.some(b => b.id !== block.id && ownConnIds.has(b.patternId));

      // Inverse: another placed pattern connects to this one
      const hasInverse = blocks.some(b => {
        if (b.id === block.id) return false;
        const other = patterns.find(p => p.id === b.patternId);
        return other?.connections?.some((c: { id: number }) => c.id === block.patternId) ?? false;
      });

      map.set(block.id, hasDirect || hasInverse ? 'connected' : 'isolated');
    });
    // If only one block exists among placed and it has no peers, keep neutral
    if (placedIds.size === 1) blocks.forEach(b => map.set(b.id, 'neutral'));
    return map;
  }, [blocks, patterns]);

  // Pan state
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as SVGElement).closest('g[data-block]')) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    panOrigin.current = { x: panX, y: panY };
  }, [panX, panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan(panOrigin.current.x + dx, panOrigin.current.y + dy);
  }, [setPan]);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // SVG export
  const exportSvg = useCallback(() => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pattern-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Register export function with parent
  useEffect(() => {
    onExportSvg(exportSvg);
  }, [onExportSvg, exportSvg]);

  const sortedBlocks = sortBlocksByDepth(blocks);
  const transform = `translate(${ORIGIN_X + panX}, ${ORIGIN_Y + panY})`;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--color-soil)]">
      {/* Instructions overlay when empty */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-[var(--color-clay)] opacity-50">
            <div className="text-5xl mb-4">⬡</div>
            <p className="text-sm">Select patterns from the left panel</p>
            <p className="text-xs mt-1">to place isometric blocks</p>
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        xmlns="http://www.w3.org/2000/svg"
        style={{ background: '#1a1a18' }}
      >
        <defs>
          <filter id="glow-green" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#4ade80" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-orange" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#fb923c" floodOpacity="0.35" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid hint dots */}
        <g transform={transform} opacity="0.06">
          {Array.from({ length: 10 }, (_, i) => i - 5).flatMap(x =>
            Array.from({ length: 10 }, (_, z) => z - 5).map(z => {
              const cx = (x - z) * 30;
              const cy = (x + z) * 15;
              return <circle key={`${x}-${z}`} cx={cx} cy={cy} r={1.5} fill="#a0a090" />;
            })
          )}
        </g>

        {/* Blocks in painters order */}
        <g transform={transform}>
          {sortedBlocks.map(block => {
            const def = getBlockDef(block.patternId);
            if (!def) return null;
            return (
              <g key={block.id} data-block="true">
                <IsometricBlock
                  gridX={block.gridX}
                  gridZ={block.gridZ}
                  blockDef={def}
                  label={block.label}
                  isSelected={selectedBlockId === block.id}
                  status={compatibilityMap.get(block.id) ?? 'neutral'}
                  onClick={() => setSelectedBlockId(
                    selectedBlockId === block.id ? null : block.id
                  )}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Compatibility legend */}
      {blocks.length > 1 && (
        <div className="absolute top-3 right-3 flex flex-col gap-1 bg-[var(--color-bark)]/80 backdrop-blur-sm border border-[var(--color-stone)] rounded px-2.5 py-2 pointer-events-none">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-clay)] mb-0.5">Connection</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ boxShadow: '0 0 6px #4ade80', border: '1.5px solid #4ade80' }} />
            <span className="text-[10px] text-[var(--color-sand)]">Connected in language</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ border: '1.5px solid #fb923c' }} />
            <span className="text-[10px] text-[var(--color-sand)]">No relationship found</span>
          </div>
        </div>
      )}

      {/* Selected block controls */}
      {selectedBlockId && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <button
            onClick={() => {
              removeBlock(selectedBlockId);
              setSelectedBlockId(null);
            }}
            className="px-3 py-1.5 text-xs bg-[var(--color-bark)] border border-[var(--color-stone)] text-[var(--color-clay)] rounded hover:border-red-500 hover:text-red-400 transition-colors"
          >
            Remove block
          </button>
          <button
            onClick={() => setSelectedBlockId(null)}
            className="px-3 py-1.5 text-xs bg-[var(--color-bark)] border border-[var(--color-stone)] text-[var(--color-clay)] rounded hover:border-[var(--color-clay)] transition-colors"
          >
            Deselect
          </button>
        </div>
      )}
    </div>
  );
}
