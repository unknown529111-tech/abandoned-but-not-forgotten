// src/components/equipment/EquipmentCanvas.tsx
// Lazy-loaded 3D canvas for the Equipment Detail viewer. OrbitControls provide
// rotate/zoom/reset. Auto-rotates unless reduced motion is requested.
import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { Equipment } from '../../types';
import EquipmentScene from './EquipmentScene';

interface Props {
  equipment: Equipment;
  reducedMotion: boolean;
  resetKey: number;
}

export default function EquipmentCanvas({ equipment, reducedMotion, resetKey }: Props) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    try {
      controls.reset();
    } catch {
      /* ignore */
    }
    if (controls.object) {
      controls.object.position.set(0, 0, 5);
    }
    if (controls.target) {
      controls.target.set(0, 0, 0);
    }
    controls.update?.();
  }, [resetKey]);

  return (
    <Canvas
      className="eq-canvas"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#050811']} />
      <fog attach="fog" args={['#050811', 6, 18]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <pointLight position={[-5, -3, -3]} intensity={0.4} color="#42BFFF" />
      {!reducedMotion && (
        <Stars radius={60} depth={40} count={1200} factor={3} saturation={0} fade speed={0.2} />
      )}
      <EquipmentScene equipment={equipment} reducedMotion={reducedMotion} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableRotate
        enableZoom
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.6}
        minDistance={2}
        maxDistance={12}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
      />
    </Canvas>
  );
}
