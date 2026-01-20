# GridFlip Component - Usage Guide

## Installation

Add the GridFlip component to your Next.js project using the apex-cli:

```bash
# Add the complete scene (recommended for quick start)
npx apex-codex-cli add grid-flip-scene

# Or add just the core component (if you have your own Three.js setup)
npx apex-codex-cli add grid-flip
```

This will install:
- `GridFlip.tsx` - Core animated grid component
- `GridFlipScene.tsx` - Complete Canvas wrapper (if using grid-flip-scene)
- `gridFlipUtils.ts` - Helper utilities and example data
- Required dependencies: `@react-three/fiber`, `@react-three/drei`, `three`, `gsap`

## Basic Usage

### Quick Start with GridFlipScene

```tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FLASK, GHOST } from "@/lib/gridFlipUtils";

// Dynamic import to avoid SSR issues with Three.js
const GridFlipScene = dynamic(() => import("@/components/GridFlipScene"), { 
  ssr: false 
});

export default function MyPage() {
  const [mode, setMode] = useState<"random" | "flip">("flip");

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[640px] h-[670px]">
        <GridFlipScene mode={mode} data={FLASK} />
      </div>
    </div>
  );
}
```

### Advanced Usage with Custom Three.js Setup

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import GridFlip from "@/components/GridFlip";
import { createGridData } from "@/lib/gridFlipUtils";

const myCustomGrid = createGridData([
  ["#ff0000", "#00ff00", "#0000ff"],
  ["#ffff00", "#ff00ff", "#00ffff"],
  ["#000000", "#ffffff", "#888888"],
]);

export default function CustomScene() {
  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
      <color attach="background" args={["#f0f0f0"]} />
      <ambientLight intensity={1} />
      
      <GridFlip 
        mode="random"
        data={myCustomGrid}
        cellSize={1.5}
        gap={0.1}
        showGridLines={true}
        lineColor="#333333"
      />
    </Canvas>
  );
}
```

## Props

### GridFlipScene Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"random" \| "flip"` | `"random"` | Animation mode |
| `data` | `GridData` | Required | Grid color map data |
| `cellSize` | `number` | `1` | Size of each grid cell |
| `gap` | `number` | `0.05` | Gap between cells |
| `showGridLines` | `boolean` | `true` | Show/hide grid lines |
| `lineThickness` | `number` | `0.02` | Grid line thickness |
| `lineColor` | `string` | `"#cfcfcf"` | Grid line color |
| `zoom` | `number` | `30` | Camera zoom level |
| `cameraPosition` | `[number, number, number]` | `[0, 0, 10]` | Camera position |
| `backgroundColor` | `string` | `"#ffffff"` | Canvas background color |

### GridFlip Props

Same as above, minus the camera and scene-specific props (`zoom`, `cameraPosition`, `backgroundColor`, etc.)

## Animation Modes

### Random Pop Mode
- Cells scale from 0 to 1 with elastic easing
- Y-axis rotation creates a "pop" effect
- Staggered delays based on position
- Perfect for playful, energetic reveals

### Flip-Dot Mode
- Mimics classic flip-dot displays
- X-axis rotation creates flip effect
- Color changes at 50% rotation
- Bottom-to-top sequential animation
- Great for retro/technical aesthetics

## Creating Custom Grid Data

### Simple Color Array

```tsx
import { createGridData } from "@/lib/gridFlipUtils";

const myGrid = createGridData([
  ["#ff0000", "#ff0000", "#ff0000"],
  ["#00ff00", "#00ff00", "#00ff00"],
  ["#0000ff", "#0000ff", "#0000ff"],
]);
```

### Pixel Art Design

```tsx
const heart = createGridData([
  ["#fff", "#f00", "#f00", "#fff", "#fff", "#f00", "#f00", "#fff"],
  ["#f00", "#f00", "#f00", "#f00", "#f00", "#f00", "#f00", "#f00"],
  ["#f00", "#f00", "#f00", "#f00", "#f00", "#f00", "#f00", "#f00"],
  ["#f00", "#f00", "#f00", "#f00", "#f00", "#f00", "#f00", "#f00"],
  ["#fff", "#f00", "#f00", "#f00", "#f00", "#f00", "#f00", "#fff"],
  ["#fff", "#fff", "#f00", "#f00", "#f00", "#f00", "#fff", "#fff"],
  ["#fff", "#fff", "#fff", "#f00", "#f00", "#fff", "#fff", "#fff"],
  ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff"],
]);
```

## Performance Tips

1. **Use Dynamic Imports**: Always use `dynamic(() => import(...), { ssr: false })` to avoid SSR issues
2. **Optimize Grid Size**: Larger grids (>50x50) may impact performance on lower-end devices
3. **Limit Concurrent Animations**: Avoid animating multiple large grids simultaneously
4. **Use Memoization**: Wrap grid data in `useMemo` if generating dynamically

## Examples

### Interactive Mode Switcher

```tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FLASK } from "@/lib/gridFlipUtils";

const GridFlipScene = dynamic(() => import("@/components/GridFlipScene"), { ssr: false });

export default function InteractiveGrid() {
  const [mode, setMode] = useState<"random" | "flip">("flip");
  const [key, setKey] = useState(0);

  const replay = () => setKey(prev => prev + 1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("random")}>Random Pop</button>
        <button onClick={() => setMode("flip")}>Flip Dot</button>
        <button onClick={replay}>Replay</button>
      </div>
      
      <div className="w-[640px] h-[670px]">
        <GridFlipScene key={key} mode={mode} data={FLASK} />
      </div>
    </div>
  );
}
```

### Custom Styling

```tsx
<GridFlipScene
  mode="flip"
  data={GHOST}
  cellSize={1.2}
  gap={0.08}
  lineThickness={0.03}
  lineColor="#000000"
  backgroundColor="#f5f5f5"
  zoom={28}
/>
```

## Troubleshooting

**Issue**: Component doesn't render
- **Solution**: Ensure you're using dynamic import with `ssr: false`

**Issue**: Dependencies not found
- **Solution**: Run `npm install` after adding the component

**Issue**: Animation doesn't play
- **Solution**: Check that the component is mounted and visible in the viewport

**Issue**: Performance issues
- **Solution**: Reduce grid size or disable grid lines with `showGridLines={false}`
