// Isometric projection helpers
// Uses a standard 2:1 isometric projection
// World coords: x (right), y (up), z (depth)

export interface Point2D {
  x: number;
  y: number;
}

export interface IsoBlock {
  gridX: number;  // tile column
  gridZ: number;  // tile row (depth)
  w: number;      // width in grid units
  d: number;      // depth in grid units
  h: number;      // height in grid units
}

const TILE_W = 60;  // pixels per grid unit (horizontal)
const TILE_H = 30;  // pixels per grid unit (vertical)

export function worldToScreen(gridX: number, gridZ: number, elevY = 0): Point2D {
  return {
    x: (gridX - gridZ) * (TILE_W / 2),
    y: (gridX + gridZ) * (TILE_H / 2) - elevY * TILE_H,
  };
}

export function makeTopFace(block: IsoBlock): string {
  const { gridX, gridZ, w, d, h } = block;
  const origin = worldToScreen(gridX, gridZ, h);
  const right = worldToScreen(gridX + w, gridZ, h);
  const back = worldToScreen(gridX, gridZ + d, h);
  const center = worldToScreen(gridX + w, gridZ + d, h);
  return `${origin.x},${origin.y} ${right.x},${right.y} ${center.x},${center.y} ${back.x},${back.y}`;
}

export function makeLeftFace(block: IsoBlock): string {
  const { gridX, gridZ, d, h } = block;
  const topLeft = worldToScreen(gridX, gridZ, h);
  const topRight = worldToScreen(gridX, gridZ + d, h);
  const botRight = worldToScreen(gridX, gridZ + d, 0);
  const botLeft = worldToScreen(gridX, gridZ, 0);
  return `${topLeft.x},${topLeft.y} ${topRight.x},${topRight.y} ${botRight.x},${botRight.y} ${botLeft.x},${botLeft.y}`;
}

export function makeRightFace(block: IsoBlock): string {
  const { gridX, gridZ, w, d, h } = block;
  const topLeft = worldToScreen(gridX, gridZ + d, h);
  const topRight = worldToScreen(gridX + w, gridZ + d, h);
  const botRight = worldToScreen(gridX + w, gridZ + d, 0);
  const botLeft = worldToScreen(gridX, gridZ + d, 0);
  return `${topLeft.x},${topLeft.y} ${topRight.x},${topRight.y} ${botRight.x},${botRight.y} ${botLeft.x},${botLeft.y}`;
}

// Sort blocks for painters algorithm (back to front)
export function sortBlocksByDepth<T extends { gridX: number; gridZ: number }>(blocks: T[]): T[] {
  return [...blocks].sort((a, b) => (a.gridX + a.gridZ) - (b.gridX + b.gridZ));
}
