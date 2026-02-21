import { makeTopFace, makeLeftFace, makeRightFace } from '../../lib/isometricBlocks';
import { BLOCK_FACE_COLORS, type BlockDef } from './BlockRegistry';
import { worldToScreen } from '../../lib/isometricBlocks';

interface IsometricBlockProps {
  gridX: number;
  gridZ: number;
  blockDef: BlockDef;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function IsometricBlock({ gridX, gridZ, blockDef, label, isSelected, onClick }: IsometricBlockProps) {
  const { w, d, h, type } = blockDef;
  const block = { gridX, gridZ, w, d, h };
  const colors = BLOCK_FACE_COLORS[type];

  const topFace = makeTopFace(block);
  const leftFace = makeLeftFace(block);
  const rightFace = makeRightFace(block);

  // Label position — top face center
  const topCenter = worldToScreen(gridX + w / 2, gridZ + d / 2, h + 0.1);

  const strokeColor = isSelected ? '#D4A574' : 'rgba(255,255,255,0.08)';
  const strokeWidth = isSelected ? 1.5 : 0.5;

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      style={{ filter: isSelected ? 'brightness(1.2)' : undefined }}
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
