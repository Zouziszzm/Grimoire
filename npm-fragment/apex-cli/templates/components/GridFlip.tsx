"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const DEFAULT_CELL_SIZE = 1;
const DEFAULT_GAP = 0.05;
const DEFAULT_LINE_THICKNESS = 0.02;

export interface GridData {
  config: {
    rows: number;
    cols: number;
    blockSize?: number;
  };
  map: string[][];
}

export interface GridFlipProps {
  /** Animation mode: 'random' for pop effect, 'flip' for flip-dot display */
  mode?: "random" | "flip";
  /** Grid data with color map */
  data: GridData;
  /** Size of each cell (default: 1) */
  cellSize?: number;
  /** Gap between cells (default: 0.05) */
  gap?: number;
  /** Show grid lines (default: true) */
  showGridLines?: boolean;
  /** Grid line thickness (default: 0.02) */
  lineThickness?: number;
  /** Grid line color (default: #cfcfcf) */
  lineColor?: string;
  /** Animation duration for random mode (default: 1.2) */
  randomDuration?: number;
  /** Animation duration for flip mode (default: 0.6) */
  flipDuration?: number;
}

/**
 * GridFlip - Animated grid component with flip-dot and random pop effects
 * 
 * Features:
 * - Two animation modes: random pop and flip-dot display
 * - Instanced mesh rendering for performance
 * - Configurable cell size, gaps, and grid lines
 * - GSAP-powered smooth animations
 * 
 * @example
 * ```tsx
 * import GridFlip from '@/components/GridFlip';
 * 
 * const data = {
 *   config: { rows: 10, cols: 10 },
 *   map: [
 *     ["#ff0000", "#00ff00", ...],
 *     ...
 *   ]
 * };
 * 
 * <Canvas>
 *   <GridFlip mode="flip" data={data} />
 * </Canvas>
 * ```
 */
export default function GridFlip({
  mode = "random",
  data,
  cellSize = DEFAULT_CELL_SIZE,
  gap = DEFAULT_GAP,
  showGridLines = true,
  lineThickness = DEFAULT_LINE_THICKNESS,
  lineColor = "#cfcfcf",
  randomDuration = 1.2,
  flipDuration = 0.6,
}: GridFlipProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const vLinesRef = useRef<THREE.InstancedMesh>(null);
  const hLinesRef = useRef<THREE.InstancedMesh>(null);

  const colorRef = useRef(new THREE.Color());
  const dummyRef = useRef(new THREE.Object3D());

  // Calculate grid data
  const gridData = useRef<Array<{ x: number; y: number; color: string; originalX: number; originalY: number }>>([]);
  const progressRefsRef = useRef<Float32Array>(new Float32Array(0));
  const sourceColorsRef = useRef<Float32Array>(new Float32Array(0));

  // Initialize grid data
  useLayoutEffect(() => {
    const gridArray = [];
    const rows = data.map.length;
    const cols = data.map[0].length;
    const centerX = ((cols - 1) * (cellSize + gap)) / 2;
    const centerY = ((rows - 1) * (cellSize + gap)) / 2;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const colorHex = data.map[i][j];
        const x = j * (cellSize + gap) - centerX;
        const y = (rows - 1 - i) * (cellSize + gap) - centerY;
        gridArray.push({ x, y, color: colorHex, originalX: j, originalY: i });
      }
    }

    gridData.current = gridArray;
    progressRefsRef.current = new Float32Array(gridArray.length).fill(0);
    sourceColorsRef.current = new Float32Array(gridArray.length * 3);
  }, [data, cellSize, gap]);

  // Calculate grid line positions
  useLayoutEffect(() => {
    if (!showGridLines || !vLinesRef.current || !hLinesRef.current) return;

    const rows = data.map.length;
    const cols = data.map[0].length;
    const step = cellSize + gap;
    const centerX = ((cols - 1) * step) / 2;
    const centerY = ((rows - 1) * step) / 2;

    const lineObj = new THREE.Object3D();

    // Vertical lines
    const x0 = 0 * step - centerX;
    const startX = x0 - (cellSize + gap) / 2;

    for (let i = 0; i <= cols; i++) {
      const lx = startX + i * step;
      lineObj.position.set(lx, 0, 0);
      lineObj.scale.set(1, 1, 1);
      lineObj.updateMatrix();
      vLinesRef.current.setMatrixAt(i, lineObj.matrix);
    }
    vLinesRef.current.instanceMatrix.needsUpdate = true;

    // Horizontal lines
    const totalGridHeight = rows * step;
    const startY = -totalGridHeight / 2;

    for (let i = 0; i <= rows; i++) {
      const ly = startY + i * step;
      lineObj.position.set(0, ly, 0);
      lineObj.updateMatrix();
      hLinesRef.current.setMatrixAt(i, lineObj.matrix);
    }
    hLinesRef.current.instanceMatrix.needsUpdate = true;
  }, [data, cellSize, gap, showGridLines]);

  // Initialize colors and animation
  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const tempColor = new THREE.Color();
    for (let i = 0; i < gridData.current.length; i++) {
      if (meshRef.current.instanceColor) {
        meshRef.current.getColorAt(i, tempColor);
        sourceColorsRef.current[i * 3] = tempColor.r;
        sourceColorsRef.current[i * 3 + 1] = tempColor.g;
        sourceColorsRef.current[i * 3 + 2] = tempColor.b;
      } else {
        tempColor.set("#ffffff");
        sourceColorsRef.current[i * 3] = tempColor.r;
        sourceColorsRef.current[i * 3 + 1] = tempColor.g;
        sourceColorsRef.current[i * 3 + 2] = tempColor.b;
      }
    }

    gridData.current.forEach((d, i) => {
      dummyRef.current.position.set(d.x, d.y, 0);
      dummyRef.current.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummyRef.current.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    progressRefsRef.current.fill(0);

    const ctx = gsap.context(() => {
      gridData.current.forEach((d, i) => {
        let delay = 0;
        let duration = randomDuration;
        let ease = "elastic.out(1, 0.5)";

        if (mode === "random") {
          delay = Math.random() * 0.5 + Math.abs(d.x) * 0.05 + Math.abs(d.y) * 0.05;
        } else {
          const rows = data.map.length;
          delay = (rows - 1 - d.originalY) * 0.05;
          duration = flipDuration;
          ease = "back.out(1.7)";
        }

        gsap.to(progressRefsRef.current, {
          [i]: 1,
          duration: duration,
          delay: delay,
          ease: ease,
        });
      });
    });

    return () => ctx.revert();
  }, [data, mode, randomDuration, flipDuration]);

  // Animation frame
  useFrame(() => {
    if (!meshRef.current) return;

    let colorsNeedUpdate = false;

    for (let i = 0; i < gridData.current.length; i++) {
      const p = progressRefsRef.current[i];
      const d = gridData.current[i];

      dummyRef.current.position.set(d.x, d.y, 0);

      if (mode === "random") {
        dummyRef.current.rotation.y = (1 - p) * Math.PI;
        dummyRef.current.rotation.x = 0;
        const scale = p;
        dummyRef.current.scale.set(scale, scale, scale);

        meshRef.current.setColorAt(i, colorRef.current.set(d.color));
        colorsNeedUpdate = true;
      } else {
        dummyRef.current.rotation.x = (1 - p) * Math.PI * -1;
        dummyRef.current.rotation.y = 0;
        dummyRef.current.scale.set(1, 1, 1);

        if (p < 0.5) {
          colorRef.current.setRGB(
            sourceColorsRef.current[i * 3],
            sourceColorsRef.current[i * 3 + 1],
            sourceColorsRef.current[i * 3 + 2]
          );
        } else {
          colorRef.current.set(d.color);
        }
        meshRef.current.setColorAt(i, colorRef.current);
        colorsNeedUpdate = true;
      }

      dummyRef.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummyRef.current.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (colorsNeedUpdate && meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  const rows = data.map.length;
  const cols = data.map[0].length;
  const step = cellSize + gap;
  const totalH = rows * step;
  const totalW = cols * step;

  return (
    <group>
      {showGridLines && (
        <>
          {/* Vertical Lines */}
          <instancedMesh
            ref={vLinesRef}
            args={[undefined, undefined, cols + 1]}
            position={[0, 0, -0.05]}
          >
            <boxGeometry args={[lineThickness, totalH, 0.01]} />
            <meshBasicMaterial color={lineColor} />
          </instancedMesh>

          {/* Horizontal Lines */}
          <instancedMesh
            ref={hLinesRef}
            args={[undefined, undefined, rows + 1]}
            position={[0, 0, -0.05]}
          >
            <boxGeometry args={[totalW, lineThickness, 0.01]} />
            <meshBasicMaterial color={lineColor} />
          </instancedMesh>
        </>
      )}

      {/* Grid Cells */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, gridData.current.length || 1]}
      >
        <planeGeometry args={[cellSize, cellSize]} />
        <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
