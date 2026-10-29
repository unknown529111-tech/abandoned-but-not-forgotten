// src/components/solar/SolarCanvas.tsx
// Lazy-loaded 3D canvas for the Solar System landing scene.
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useMemo } from 'react';
import type { Body } from '../../types';
import SolarScene from './SolarScene';

interface Props {
  bodies: Body[];
  selectedIndex: number;
  reducedMotion: boolean;
}

export default function SolarCanvas({ bodies, selectedIndex, reducedMotion }: Props) {
  const dpr = useMemo(() => [1, 2] as [number, number], []);
  return (
    <Canvas
      className="solar-canvas"
      camera={{ position: [0, 0, 9], fov: 48 }}
      dpr={dpr}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#050811']} />
      <fog attach="fog" args={['#050811', 9, 28]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 6, 6]} intensity={1.1} />
      <pointLight position={[-6, -4, -4]} intensity={0.4} color="#42BFFF" />
      <Stars radius={90} depth={60} count={4000} factor={4} saturation={0} fade speed={reducedMotion ? 0 : 0.4} />
      <SolarScene bodies={bodies} selectedIndex={selectedIndex} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
