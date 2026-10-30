// src/components/equipment/models/Voyager1Model.tsx
// Procedural 3D model of Voyager 1 — outer solar system probe, 1977.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#c8c8c8';
const DISH = '#aaaaaa';
const BOOM = '#666666';
const ACCENT = '#42BFFF';

export default function Voyager1Model({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.45}>
      {/* Main bus — central box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* High-gain antenna — large dish */}
      <mesh position={[0, 0.3, 0.6]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.03, 32]} />
        <meshStandardMaterial color={DISH} roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Dish support struts */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0.3]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {/* Magnetometer boom — long rod */}
      <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 3.0, 8]} />
        <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.3} />
      </mesh>
      {/* RTG (power) — cylindrical */}
      <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 12]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Camera / imaging science subsystem */}
      <mesh position={[0.3, 0.3, -0.3]}>
        <boxGeometry args={[0.15, 0.12, 0.15]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Wireframe accent */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
