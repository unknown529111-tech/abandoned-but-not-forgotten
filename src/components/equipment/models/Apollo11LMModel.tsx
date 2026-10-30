// src/components/equipment/models/Apollo11LMModel.tsx
// Procedural 3D model of Apollo 11 Lunar Module (Eagle) — first crewed Moon landing, 1969.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#c8c8c8';
const GOLD = '#b8860b';
const LEG = '#888888';
const ACCENT = '#42BFFF';

export default function Apollo11LMModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.5}>
      {/* Descent stage — octagonal base */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[1.0, 1.1, 0.5, 8]} />
        <meshStandardMaterial color={GOLD} roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Ascent stage — boxy upper */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.7, 0.6, 0.7]} />
        <meshStandardMaterial color={BODY} roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Cabin windows — dark rectangles */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0.36]}>
          <boxGeometry args={[0.12, 0.08, 0.02]} />
          <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.8} />
        </mesh>
      ))}
      {/* Rendezvous radar antenna */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color={LEG} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Landing legs — 4 legs */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 0.9;
        const z = Math.sin(angle) * 0.9;
        return (
          <group key={i}>
            <mesh position={[x * 0.5, -0.5, z * 0.5]} rotation={[0.4, angle, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
              <meshStandardMaterial color={LEG} roughness={0.6} metalness={0.3} />
            </mesh>
            <mesh position={[x, -0.9, z]}>
              <cylinderGeometry args={[0.08, 0.08, 0.03, 12]} />
              <meshStandardMaterial color={LEG} roughness={0.7} metalness={0.2} />
            </mesh>
          </group>
        );
      })}
      {/* Engine nozzle */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 0.3, 12]} />
        <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Wireframe accent */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
