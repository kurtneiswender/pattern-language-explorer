export interface BlockDef {
  w: number;  // width in grid units
  d: number;  // depth in grid units
  h: number;  // height in grid units
  type: 'room' | 'wall' | 'column' | 'detail' | 'open';
  label: string;
}

// Maps pattern IDs → isometric block definitions
// Covers building (131-159), room (160-204), and detail (205-253) scale patterns
export const BLOCK_REGISTRY: Record<number, BlockDef> = {
  // Building scale
  131: { w: 4, d: 4, h: 3, type: 'room', label: 'Main Building' },          // Intimacy Gradient
  132: { w: 5, d: 3, h: 3, type: 'room', label: 'Building' },               // Building Mix
  133: { w: 3, d: 3, h: 3, type: 'room', label: 'Passage' },                // Street Café
  134: { w: 2, d: 2, h: 3, type: 'room', label: 'Stair' },                  // Zen View
  135: { w: 3, d: 4, h: 3, type: 'room', label: 'Tapestry' },               // Tapestry of Light
  136: { w: 3, d: 3, h: 2, type: 'room', label: 'Couple Realm' },           // Couple's Realm
  137: { w: 4, d: 3, h: 2, type: 'room', label: 'Children Realm' },         // Children's Realm
  138: { w: 2, d: 3, h: 2, type: 'room', label: 'Sleeping East' },          // Sleeping to the East
  139: { w: 4, d: 4, h: 2, type: 'room', label: 'Kitchen' },                // Farmhouse Kitchen
  140: { w: 3, d: 3, h: 2, type: 'room', label: 'Kitchen Table' },          // Kitchen Table
  141: { w: 2, d: 2, h: 2, type: 'room', label: 'Own Room' },               // A Room of One's Own
  142: { w: 4, d: 2, h: 2, type: 'room', label: 'Sitting' },                // Sequence of Sitting Spaces
  143: { w: 3, d: 4, h: 2, type: 'room', label: 'Bed Cluster' },            // Bed Cluster
  144: { w: 2, d: 3, h: 2, type: 'room', label: 'Bathing' },                // Bathing Room
  145: { w: 1, d: 2, h: 2, type: 'room', label: 'Bulk Storage' },           // Bulk Storage
  146: { w: 4, d: 4, h: 2, type: 'room', label: 'Office' },                 // Flexible Office Space
  147: { w: 4, d: 3, h: 2, type: 'room', label: 'Communal Dining' },        // Communal Eating
  148: { w: 3, d: 2, h: 2, type: 'room', label: 'Small Work Group' },       // Small Work Groups
  149: { w: 2, d: 2, h: 2, type: 'room', label: 'Reception' },              // Receptionist's Throne
  150: { w: 2, d: 2, h: 2, type: 'room', label: 'Waiting' },                // A Place to Wait
  151: { w: 3, d: 3, h: 2, type: 'room', label: 'Meeting Rm' },             // Small Meeting Rooms
  152: { w: 2, d: 2, h: 2, type: 'room', label: 'Half-Private' },           // Half-Private Office
  153: { w: 2, d: 2, h: 2, type: 'room', label: 'Rooms to Rent' },          // Rooms to Rent
  154: { w: 2, d: 2, h: 2, type: 'room', label: 'Teen Cottage' },           // Teenager's Cottage
  155: { w: 2, d: 2, h: 2, type: 'room', label: 'Old Age Cottage' },        // Old Age Cottage
  156: { w: 3, d: 2, h: 2, type: 'room', label: 'Workshop' },               // Settled Work
  157: { w: 2, d: 1, h: 2, type: 'room', label: 'Home Workshop' },          // Home Workshop
  158: { w: 2, d: 1, h: 2, type: 'room', label: 'Teenager Studio' },        // Teenager's Place
  159: { w: 3, d: 2, h: 2, type: 'room', label: 'Light Interior' },         // Light on 2 Sides

  // Room scale
  160: { w: 4, d: 1, h: 2, type: 'wall', label: 'Building Edge' },           // Building Edge
  161: { w: 3, d: 1, h: 1, type: 'open', label: 'Sunny Place' },            // Sunny Place
  162: { w: 3, d: 3, h: 2, type: 'open', label: 'North Face' },              // North Face
  163: { w: 3, d: 2, h: 2, type: 'open', label: 'Outdoor Rm' },             // Outdoor Room
  164: { w: 2, d: 2, h: 1, type: 'open', label: 'Street Windows' },         // Street Windows
  165: { w: 4, d: 3, h: 1, type: 'open', label: 'Opening Into St.' },       // Opening Into Street
  166: { w: 3, d: 2, h: 2, type: 'room', label: 'Gallery' },                // Gallery Surround
  167: { w: 2, d: 2, h: 1, type: 'open', label: 'Balcony' },                // Balcony
  168: { w: 2, d: 3, h: 2, type: 'room', label: 'Connection to Earth' },    // Connection to the Earth
  169: { w: 2, d: 2, h: 1, type: 'open', label: 'Terraced Slope' },         // Terraced Slope
  170: { w: 2, d: 2, h: 1, type: 'open', label: 'Fruit Trees' },            // Fruit Trees
  171: { w: 2, d: 2, h: 1, type: 'open', label: 'Tree Places' },            // Tree Places
  172: { w: 3, d: 3, h: 1, type: 'open', label: 'Garden' },                 // Garden Growing Wild
  173: { w: 4, d: 1, h: 2, type: 'wall', label: 'Garden Wall' },            // Garden Wall
  174: { w: 2, d: 3, h: 2, type: 'open', label: 'Trellised Walk' },         // Trellised Walk
  175: { w: 2, d: 2, h: 1, type: 'open', label: 'Greenhouse' },             // Greenhouse
  176: { w: 3, d: 2, h: 1, type: 'open', label: 'Garden Seat' },            // Garden Seat
  177: { w: 2, d: 2, h: 1, type: 'open', label: 'Vegetable Garden' },       // Vegetable Garden
  178: { w: 1, d: 1, h: 1, type: 'detail', label: 'Compost' },              // Compost
  179: { w: 2, d: 1, h: 2, type: 'room', label: 'Alcove' },                 // Alcoves
  180: { w: 2, d: 2, h: 2, type: 'room', label: 'Window Place' },           // Window Place
  181: { w: 1, d: 2, h: 2, type: 'room', label: 'Fire' },                   // The Fire
  182: { w: 3, d: 2, h: 2, type: 'room', label: 'Eating Atmosphere' },      // Eating Atmosphere
  183: { w: 2, d: 2, h: 2, type: 'room', label: 'Workspace Enclosure' },    // Workspace Enclosure
  184: { w: 1, d: 1, h: 2, type: 'room', label: 'Cooking Layout' },         // Cooking Layout
  185: { w: 2, d: 2, h: 2, type: 'room', label: 'Sitting Circle' },         // Sitting Circle
  186: { w: 3, d: 2, h: 2, type: 'room', label: 'Communal Sleeping' },      // Communal Sleeping
  187: { w: 2, d: 3, h: 2, type: 'room', label: 'Marriage Bed' },           // Marriage Bed
  188: { w: 2, d: 2, h: 2, type: 'room', label: 'Bed Alcove' },             // Bed Alcove
  189: { w: 2, d: 3, h: 2, type: 'room', label: 'Dressing Room' },          // Dressing Room
  190: { w: 3, d: 3, h: 3, type: 'room', label: 'Ceiling Height' },         // Ceiling Height Variety
  191: { w: 3, d: 3, h: 2, type: 'room', label: 'Indoor Space' },           // Shape of Indoor Space
  192: { w: 3, d: 3, h: 2, type: 'room', label: 'Window Shapes' },          // Window Shapes
  193: { w: 2, d: 1, h: 1, type: 'wall', label: 'Half-Open Wall' },         // Half-Open Wall
  194: { w: 2, d: 1, h: 2, type: 'wall', label: 'Interior Windows' },       // Interior Windows
  195: { w: 2, d: 1, h: 2, type: 'wall', label: 'Staircase Volume' },       // Staircase Volume
  196: { w: 1, d: 1, h: 2, type: 'column', label: 'Corner Doors' },         // Corner Doors
  197: { w: 2, d: 1, h: 2, type: 'wall', label: 'Thick Walls' },            // Thick Walls
  198: { w: 3, d: 2, h: 2, type: 'room', label: 'Closets' },                // Closets Between Rooms
  199: { w: 2, d: 1, h: 1, type: 'detail', label: 'Sunny Counter' },        // Sunny Counter
  200: { w: 2, d: 1, h: 2, type: 'wall', label: 'Open Shelves' },           // Open Shelves
  201: { w: 2, d: 1, h: 1, type: 'detail', label: 'Waist Shelf' },          // Waist-High Shelf
  202: { w: 2, d: 1, h: 1, type: 'detail', label: 'Built-in Seats' },       // Built-in Seats
  203: { w: 1, d: 1, h: 1, type: 'room', label: 'Child Caves' },            // Child Caves
  204: { w: 1, d: 1, h: 2, type: 'room', label: 'Secret Place' },           // Secret Place

  // Detail scale (selected structural ones)
  205: { w: 3, d: 3, h: 2, type: 'detail', label: 'Structure Plan' },       // Structure Follows Social Spaces
  206: { w: 2, d: 2, h: 3, type: 'column', label: 'Efficient Structure' },  // Efficient Structure
  207: { w: 3, d: 2, h: 2, type: 'wall', label: 'Good Materials' },         // Good Materials
  208: { w: 2, d: 2, h: 3, type: 'column', label: 'Gradual Stiffening' },   // Gradual Stiffening
  209: { w: 4, d: 3, h: 1, type: 'detail', label: 'Roof Layout' },          // Roof Layout
  210: { w: 4, d: 3, h: 1, type: 'detail', label: 'Floor Layout' },         // Floor and Ceiling Layout
  211: { w: 2, d: 1, h: 2, type: 'wall', label: 'Outer Walls' },            // Thickening the Outer Walls
  212: { w: 1, d: 1, h: 3, type: 'column', label: 'Columns at Corners' },   // Columns at the Corners
  213: { w: 1, d: 1, h: 3, type: 'column', label: 'Final Column' },         // Final Column Distribution
  214: { w: 3, d: 2, h: 1, type: 'detail', label: 'Root Foundation' },      // Root Foundation
  215: { w: 2, d: 2, h: 2, type: 'wall', label: 'Ground Floor Slab' },      // Ground Floor Slab
  216: { w: 1, d: 1, h: 3, type: 'column', label: 'Box Column' },           // Box Columns
  217: { w: 3, d: 2, h: 1, type: 'detail', label: 'Perimeter Beam' },       // Perimeter Beams
  218: { w: 3, d: 3, h: 1, type: 'detail', label: 'Wall Membrane' },        // Wall Membranes
  219: { w: 4, d: 3, h: 1, type: 'detail', label: 'Floor Vault' },          // Floor-Ceiling Vaults
  220: { w: 4, d: 3, h: 1, type: 'detail', label: 'Roof Vault' },           // Roof Vaults
  221: { w: 2, d: 1, h: 2, type: 'wall', label: 'Natural Doors+Windows' },  // Natural Doors and Windows
  222: { w: 2, d: 1, h: 2, type: 'wall', label: 'Low Doorway' },            // Low Doorway
  223: { w: 2, d: 1, h: 2, type: 'detail', label: 'Deep Reveal' },          // Deep Reveals
  224: { w: 2, d: 1, h: 2, type: 'detail', label: 'Low Sill' },             // Low Sill
  225: { w: 2, d: 1, h: 2, type: 'detail', label: 'Window Frames' },        // Frames as Thickened Edges
  226: { w: 1, d: 1, h: 3, type: 'column', label: 'Column Place' },         // Column Place
  227: { w: 2, d: 1, h: 2, type: 'wall', label: 'Column Connection' },      // Column Connection
  228: { w: 2, d: 1, h: 1, type: 'detail', label: 'Column Cap' },           // Column Cap
  229: { w: 2, d: 2, h: 2, type: 'wall', label: 'Corner Columns' },         // Long Thin House
  230: { w: 2, d: 1, h: 2, type: 'detail', label: 'Ceiling Height' },       // Radiant Heat
  231: { w: 1, d: 1, h: 1, type: 'detail', label: 'Dormer' },               // Dormer Windows
  232: { w: 2, d: 1, h: 1, type: 'detail', label: 'Roof Caps' },            // Roof Caps
  233: { w: 2, d: 1, h: 2, type: 'detail', label: 'Floor Surface' },        // Floor Surface
  234: { w: 2, d: 1, h: 2, type: 'detail', label: 'Lapped Panels' },        // Lapped Outside Walls
  235: { w: 2, d: 1, h: 2, type: 'detail', label: 'Soft Inside Walls' },    // Soft Inside Walls
  236: { w: 2, d: 1, h: 1, type: 'detail', label: 'Windows Overlooking' },  // Windows Which Open Wide
  237: { w: 2, d: 1, h: 1, type: 'detail', label: 'Solid Doors' },          // Solid Doors with Glass
  238: { w: 2, d: 1, h: 2, type: 'detail', label: 'Filtered Light' },       // Filtered Light
  239: { w: 2, d: 1, h: 1, type: 'detail', label: 'Small Panes' },          // Small Panes
  240: { w: 2, d: 1, h: 1, type: 'detail', label: 'Half-Inch Trim' },       // Half-Inch Trim
  241: { w: 1, d: 1, h: 2, type: 'detail', label: 'Seat Spots' },           // Seat Spots
  242: { w: 2, d: 1, h: 1, type: 'detail', label: 'Front Door Bench' },     // Front Door Bench
  243: { w: 1, d: 1, h: 1, type: 'detail', label: 'Sitting Wall' },         // Sitting Wall
  244: { w: 2, d: 1, h: 1, type: 'detail', label: 'Canvas Roofs' },         // Canvas Roofs
  245: { w: 2, d: 2, h: 1, type: 'detail', label: 'Raised Flowers' },       // Raised Flowers
  246: { w: 2, d: 2, h: 1, type: 'detail', label: 'Plant Climbing' },       // Climbing Plants
  247: { w: 2, d: 2, h: 1, type: 'detail', label: 'Paving with Cracks' },   // Paving with Cracks
  248: { w: 2, d: 1, h: 1, type: 'detail', label: 'Soft Tile/Brick' },      // Soft Tile and Brick
  249: { w: 2, d: 1, h: 1, type: 'detail', label: 'Ornament' },             // Ornament
  250: { w: 1, d: 1, h: 2, type: 'column', label: 'Warm Colors' },          // Warm Colors
  251: { w: 2, d: 1, h: 1, type: 'detail', label: 'Different Chairs' },     // Different Chairs
  252: { w: 2, d: 1, h: 1, type: 'detail', label: 'Pools of Light' },       // Pools of Light
  253: { w: 1, d: 1, h: 1, type: 'detail', label: 'Things From Your Life' },// Things from Your Life
};

export const BLOCK_FACE_COLORS: Record<BlockDef['type'], { top: string; left: string; right: string }> = {
  room:   { top: '#4A7A3F', left: '#2D5A27', right: '#1e3d1a' },
  wall:   { top: '#8b7355', left: '#6b5840', right: '#4a3d2c' },
  column: { top: '#A8B88A', left: '#7a8a66', right: '#5a6a48' },
  detail: { top: '#D4A574', left: '#b87840', right: '#8a5a2c' },
  open:   { top: '#6B9B5E44', left: 'transparent', right: 'transparent' },
};

export function getBlockDef(patternId: number): BlockDef | null {
  return BLOCK_REGISTRY[patternId] || null;
}
