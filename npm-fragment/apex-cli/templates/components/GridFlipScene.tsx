"use client";

import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import GridFlip, { GridFlipProps } from "./GridFlip";

export interface GridFlipSceneProps extends GridFlipProps {
  /** Camera zoom level (default: 30) */
  zoom?: number;
  /** Camera position (default: [0, 0, 10]) */
  cameraPosition?: [number, number, number];
  /** Background color (default: #ffffff) */
  backgroundColor?: string;
  /** Ambient light intensity (default: 1) */
  ambientIntensity?: number;
  /** Directional light intensity (default: 1) */
  directionalIntensity?: number;
  /** Directional light position (default: [10, 10, 5]) */
  directionalPosition?: [number, number, number];
}

/**
 * GridFlipScene - Complete Three.js scene wrapper for GridFlip component
 * 
 * Provides a ready-to-use Canvas with camera, lighting, and the GridFlip component.
 * Perfect for drop-in usage without needing to set up Three.js infrastructure.
 * 
 * @example
 * ```tsx
 * import GridFlipScene from '@/components/GridFlipScene';
 * import { FLASK } from '@/lib/gridFlipUtils';
 * 
 * export default function MyPage() {
 *   return (
 *     <div className="w-full h-screen">
 *       <GridFlipScene mode="flip" data={FLASK} />
 *     </div>
 *   );
 * }
 * ```
 */
export default function GridFlipScene({
  zoom = 30,
  cameraPosition = [0, 0, 10],
  backgroundColor = "#ffffff",
  ambientIntensity = 1,
  directionalIntensity = 1,
  directionalPosition = [10, 10, 5],
  ...gridFlipProps
}: GridFlipSceneProps) {
  return (
    <Canvas flat>
      <OrthographicCamera makeDefault position={cameraPosition} zoom={zoom} />
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={directionalPosition} intensity={directionalIntensity} />
      <GridFlip {...gridFlipProps} />
    </Canvas>
  );
}
