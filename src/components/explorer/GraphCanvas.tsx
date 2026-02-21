import { useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useExplorerStore } from '../../store/useExplorerStore';
import { useGraphLayout } from '../../hooks/useGraphLayout';
import { SCALE_COLORS, SCALE_RADII, type PatternNode } from '../../types/pattern';

interface GraphCanvasProps {
  onZoomReset: (fn: () => void) => void;
}

export function GraphCanvas({ onZoomReset }: GraphCanvasProps) {
  const graphRef = useRef<any>(null);
  const { selectedPatternId, setSelectedPatternId } = useExplorerStore();
  const graphData = useGraphLayout();

  // Expose zoom reset
  useEffect(() => {
    onZoomReset(() => {
      graphRef.current?.zoomToFit(400, 40);
    });
  }, [onZoomReset]);

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const n = node as PatternNode;
      const radius = (SCALE_RADII[n.scale] || 5) * Math.min(1, globalScale * 0.5 + 0.5);
      const color = SCALE_COLORS[n.scale] || '#888';
      const isSelected = n.id === selectedPatternId;

      // Glow for selected
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI);
        ctx.fillStyle = color + '44';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 2, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? color : color + 'cc';
      ctx.fill();

      // Label at higher zoom levels
      if (globalScale > 2.5) {
        const label = `${n.id}`;
        ctx.font = `${Math.max(8, 10 / globalScale)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(240,232,216,0.9)';
        ctx.fillText(label, node.x, node.y);
      } else if (globalScale > 1.5 && isSelected) {
        const label = `#${n.id} ${n.displayName}`;
        ctx.font = `${10}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(240,232,216,0.9)';
        ctx.fillText(label, node.x, node.y + (SCALE_RADII[n.scale] || 5) + 2);
      }
    },
    [selectedPatternId]
  );

  const handleNodeClick = useCallback(
    (node: any) => {
      setSelectedPatternId(node.id);
    },
    [setSelectedPatternId]
  );

  return (
    <div className="w-full h-full bg-[var(--color-soil)]">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeId="id"
        nodeCanvasObject={nodeCanvasObject}
        nodeCanvasObjectMode={() => 'replace'}
        linkColor={() => 'rgba(61,61,56,0.6)'}
        linkWidth={0.5}
        linkDirectionalParticles={0}
        onNodeClick={handleNodeClick}
        onBackgroundClick={() => setSelectedPatternId(null)}
        backgroundColor="#1a1a18"
        nodeRelSize={1}
        cooldownTime={3000}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
