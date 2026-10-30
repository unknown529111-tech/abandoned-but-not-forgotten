// src/components/equipment/models/PerseveranceModel.tsx
// Procedural 3D model of Perseverance rover (Mars 2020) with Ingenuity helicopter.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#e8e8e8';
const WHEEL = '#2a2a2a';
const MAST = '#777777';
const ACCENT = '#42BFFF';

export default function PerseveranceModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.4}>
      {/* Chassis */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.45, 1.1]} />
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* RTG */}
      <mesh position={[-0.9, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 12]} />
        <meshStandardMaterial color="#444444" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Mast */}
      <mesh position={[0.5, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshStandardMaterial color={MAST} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Mastcam-Z (camera) */}
      <mesh position={[0.5, 1.4, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* High-gain antenna */}
      <mesh position={[-0.3, 0.75, -0.4]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 24]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Robotic arm */}
      <mesh position={[0.7, 0.1, 0.4]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.7, 0.06, 0.06]} />
        <meshStandardMaterial color={MAST} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Sample caching system (drill) */}
      <mesh position={[0.9, -0.1, 0.4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 12]} />
        <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Wheels — 6 wheels */}
      {[-0.7, 0, 0.7].map((x, xi) =>
        [-0.6, 0.6].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, -0.15, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
            <meshStandardMaterial color={WHEEL} roughness={0.8} metalness={0.2} />
          </mesh>
        ))
      )}
      {/* Ingenuity helicopter — small on deck */}
      <group position={[0.3, 0.6, -0.3]}>
        <mesh>
          <boxGeometry args={[0.15, 0.08, 0.15]} />
          <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Rotor blades */}
        <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.01, 0.04]} />
          <meshStandardMaterial color="#555555" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.6, 0.01, 0.04]} />
          <meshStandardMaterial color="#555555" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Legs */}
        {[-0.1, 0.1].map((x, i) => (
          <mesh key={i} position={[x, -0.08, 0]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.15, 6]} />
            <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.3} />
          </mesh>
        ))}
      </group>
      {/* Wireframe accent */}
      <mesh scale={1.8}>
        <sphereGeometry args={[2.0, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
