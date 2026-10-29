// src/components/solar/SolarScene.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { Body } from '../../types';

interface Props {
  bodies: Body[];
  selectedIndex: number;
  reducedMotion: boolean;
}

const SPACING = 2.4;
const DEPTH = 1.6;

export default function SolarScene({ bodies, selectedIndex, reducedMotion }: Props) {
  const meshes = useRef<(Mesh | null)[]>([]);

  useFrame((_, delta) => {
    bodies.forEach((_, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      const offset = i - selectedIndex;
      const targetX = offset * SPACING;
      const targetZ = -Math.abs(offset) * DEPTH;
      const targetScale = offset === 0 ? 1.45 : Math.max(0.55, 0.9 - Math.abs(offset) * 0.12);
      const lerp = reducedMotion ? 1 : Math.min(1, delta * 6);
      mesh.position.x += (targetX - mesh.position.x) * lerp;
      mesh.position.z += (targetZ - mesh.position.z) * lerp;
      const cur = mesh.scale.x;
      const next = cur + (targetScale - cur) * lerp;
      mesh.scale.setScalar(next);
      if (!reducedMotion) {
        mesh.rotation.y += delta * 0.35;
      }
    });
  });

  return (
    <group>
      {bodies.map((body, i) => (
        <mesh
          key={body.id}
          ref={(el) => {
            meshes.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshStandardMaterial
            color={body.accent}
            roughness={0.35}
            metalness={0.15}
            emissive={body.accent}
            emissiveIntensity={i === selectedIndex ? 0.35 : 0.12}
          />
        </mesh>
      ))}
      {/* soft blur backdrop plane */}
      <mesh position={[0, 0, -12]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial color="#0B1424" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}
