import { makeTopFace, makeLeftFace, makeRightFace } from '../../lib/isometricBlocks';
import { BLOCK_FACE_COLORS, type BlockDef } from './BlockRegistry';
import { worldToScreen } from '../../lib/isometricBlocks';

export type CompatibilityStatus = 'connected' | 'isolated' | 'neutral';

interface IsometricBlockProps {
  gridX: number;
  gridZ: number;
  blockDef: BlockDef;
  label: string;
  isSelected?: boolean;
  status?: CompatibilityStatus;
  onClick?: () => void;
}

const STATUS_STROKE: Record<CompatibilityStatus, string> = {
  connected: '#4ade80',  // green-400
  isolated:  '#fb923c',  // orange-400
  neutral:   'rgba(255,255,255,0.08)',
};

const STATUS_FILTER: Record<CompatibilityStatus, string | undefined> = {
  connected: 'url(#glow-green)',
  isolated:  'url(#glow-orange)',
  neutral:   undefined,
};

export function IsometricBlock({ gridX, gridZ, blockDef, label, isSelected, status = 'neutral', onClick }: IsometricBlockProps) {
  const { w, d, h, type } = blockDef;
  const block = { gridX, gridZ, w, d, h };
  const colors = BLOCK_FACE_COLORS[type];

  const topFace = makeTopFace(block);
  const leftFace = makeLeftFace(block);
  const rightFace = makeRightFace(block);

  // Label position — top face center
  const topCenter = worldToScreen(gridX + w / 2, gridZ + d / 2, h + 0.1);

  const strokeColor = isSelected ? '#D4A574' : STATUS_STROKE[status];
  const strokeWidth = isSelected ? 1.5 : status !== 'neutral' ? 1.2 : 0.5;
  const filterAttr = isSelected ? undefined : STATUS_FILTER[status];

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      style={{ filter: isSelected ? 'brightness(1.2)' : filterAttr }}
    >
      {/* Right face (depth) */}
      {colors.right !== 'transparent' && (
        <polygon
          points={rightFace}
          fill={colors.right}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      )}
      {/* Left face (width) */}
      {colors.left !== 'transparent' && (
        <polygon
          points={leftFace}
          fill={colors.left}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      )}
      {/* Top face */}
      <polygon
        points={topFace}
        fill={colors.top}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fillOpacity={type === 'open' ? 0.3 : 1}
      />
      {/* Label */}
      <text
        x={topCenter.x}
        y={topCenter.y - 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7"
        fill="rgba(240,232,216,0.85)"
        fontFamily="Inter, sans-serif"
        pointerEvents="none"
      >
        {label}
      </text>
    </g>
  );
}
