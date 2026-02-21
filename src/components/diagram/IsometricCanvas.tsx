import { useRef, useState, useCallback, useEffect } from 'react';
import { useDiagramStore } from '../../store/useDiagramStore';
import { getBlockDef } from './BlockRegistry';
import { IsometricBlock } from './IsometricBlock';
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
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
                  onClick={() => setSelectedBlockId(
                    selectedBlockId === block.id ? null : block.id
                  )}
                />
              </g>
            );
          })}
        </g>
      </svg>

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
