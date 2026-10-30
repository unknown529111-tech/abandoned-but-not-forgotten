// src/components/equipment/models/Viking1Model.tsx
// Procedural 3D model of Viking 1 Lander — first successful Mars lander, 1976.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#e0e0e0';
const LEG = '#777777';
const ACCENT = '#42BFFF';

export default function Viking1Model({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.5}>
      {/* Main body — hexagonal base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.4, 6]} />
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Biology experiment package */}
      <mesh position={[0.3, 0.5, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.25]} />
        <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* RTG (power source) — cylindrical */}
      <mesh position={[-0.5, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 12]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Solar panels — 2 panels */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.9, 0.35, 0]} rotation={[0, 0, side * 0.15]}>
          <boxGeometry args={[0.8, 0.03, 0.6]} />
          <meshStandardMaterial color="#1a3a5c" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* High-gain antenna — dish */}
      <mesh position={[0, 0.9, -0.4]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Antenna mast */}
      <mesh position={[0, 0.6, -0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color={LEG} roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Camera (imaging system) */}
      <mesh position={[0, 0.65, 0.5]}>
        <boxGeometry args={[0.15, 0.12, 0.15]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Landing legs — 3 legs */}
      {[0, 1, 2].map((i) => {
        const angle = (i * 2 * Math.PI) / 3;
        const x = Math.cos(angle) * 0.8;
        const z = Math.sin(angle) * 0.8;
        return (
          <group key={i}>
            <mesh position={[x * 0.4, -0.2, z * 0.4]} rotation={[0.3, angle, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
              <meshStandardMaterial color={LEG} roughness={0.6} metalness={0.3} />
            </mesh>
            <mesh position={[x, -0.6, z]}>
              <cylinderGeometry args={[0.1, 0.1, 0.03, 12]} />
              <meshStandardMaterial color={LEG} roughness={0.7} metalness={0.2} />
            </mesh>
          </group>
        );
      })}
      {/* Wireframe accent */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
