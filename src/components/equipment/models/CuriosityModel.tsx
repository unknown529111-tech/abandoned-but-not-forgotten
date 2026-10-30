// src/components/equipment/models/CuriosityModel.tsx
// Procedural 3D model of Curiosity (MSL) rover — Mars Science Laboratory, 2012.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#d4d4d4';
const WHEEL = '#333333';
const MAST = '#888888';
const ACCENT = '#42BFFF';

export default function CuriosityModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.45}>
      {/* Main body — rover chassis */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.4, 0.4, 1.0]} />
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* RTG (power) — rear cylinder */}
      <mesh position={[-0.8, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 12]} />
        <meshStandardMaterial color="#444444" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Mast — vertical pole */}
      <mesh position={[0.4, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshStandardMaterial color={MAST} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Mast camera (ChemCam) */}
      <mesh position={[0.4, 1.4, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.12]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* High-gain antenna */}
      <mesh position={[-0.2, 0.7, -0.3]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Robotic arm — simple box */}
      <mesh position={[0.6, 0.1, 0.3]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.6, 0.06, 0.06]} />
        <meshStandardMaterial color={MAST} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Wheels — 6 wheels */}
      {[-0.6, 0, 0.6].map((x, xi) =>
        [-0.55, 0.55].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, -0.15, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
            <meshStandardMaterial color={WHEEL} roughness={0.8} metalness={0.2} />
          </mesh>
        ))
      )}
      {/* Wireframe accent */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
