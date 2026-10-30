// src/components/equipment/models/GenericRoverModel.tsx
// Generic rover model for Mars rovers without a specific model.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#d0d0d0';
const WHEEL = '#333333';
const MAST = '#888888';
const ACCENT = '#42BFFF';

export default function GenericRoverModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.5}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.35, 0.8]} />
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.3, 0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        <meshStandardMaterial color={MAST} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.3, 1.05, 0]}>
        <boxGeometry args={[0.15, 0.1, 0.1]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
      </mesh>
      {[-0.5, 0, 0.5].map((x, xi) =>
        [-0.45, 0.45].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, -0.1, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 12]} />
            <meshStandardMaterial color={WHEEL} roughness={0.8} metalness={0.2} />
          </mesh>
        ))
      )}
      <mesh scale={1.6}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
