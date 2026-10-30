// src/components/equipment/models/GenericTelescopeModel.tsx
// Generic telescope/observatory model.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#c8c8c8';
const MIRROR = '#aaaaaa';
const BOOM = '#666666';
const ACCENT = '#42BFFF';

export default function GenericTelescopeModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.5}>
      {/* Main tube */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.35, 1.2, 24]} />
        <meshStandardMaterial color={BODY} roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Primary mirror (front) */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 24]} />
        <meshStandardMaterial color={MIRROR} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Solar panels */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[0, side * 0.8, 0]} rotation={[side * 0.1, 0, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.5]} />
          <meshStandardMaterial color="#1a3a5c" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Support struts */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.4]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      <mesh scale={1.7}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
