// src/components/equipment/models/Surveyor1Model.tsx
// Procedural 3D model of Surveyor 1 lunar lander (first U.S. soft landing on the Moon, 1966).
// Built with Three.js primitives following the actual spacecraft layout.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY_COLOR = '#c0c0c0';
const LEG_COLOR = '#888888';
const PANEL_COLOR = '#1a3a5c';
const ANTENNA_COLOR = '#aaaaaa';
const ACCENT = '#42BFFF';

export default function Surveyor1Model({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={0.6}>
      {/* Main body — central box */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Solar panel — flat panel on top, tilted */}
      <mesh position={[0, 0.8, -0.2]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.2, 0.03, 0.6]} />
        <meshStandardMaterial color={PANEL_COLOR} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Solar panel support struts */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.6, -0.2]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color={LEG_COLOR} roughness={0.6} metalness={0.3} />
        </mesh>
      ))}

      {/* Planar array antenna — dish on mast */}
      <mesh position={[0.6, 0.9, 0.2]} rotation={[0.5, 0, 0.3]}>
        <cylinderGeometry args={[0.35, 0.35, 0.02, 24]} />
        <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Antenna mast */}
      <mesh position={[0.6, 0.5, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color={LEG_COLOR} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* TV camera — small box on the body */}
      <mesh position={[-0.3, 0.65, 0.35]}>
        <boxGeometry args={[0.15, 0.12, 0.15]} />
        <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Camera lens */}
      <mesh position={[-0.3, 0.65, 0.43]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Retro rocket / vernier engine — below body */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 0.3, 12]} />
        <meshStandardMaterial color="#555555" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Tripod landing legs */}
      {[
        { angle: 0, pos: [0, -0.1, 0.7] },
        { angle: (2 * Math.PI) / 3, pos: [-0.6, -0.1, -0.35] },
        { angle: (4 * Math.PI) / 3, pos: [0.6, -0.1, -0.35] },
      ].map((leg, i) => (
        <group key={i}>
          {/* Leg strut */}
          <mesh position={leg.pos as [number, number, number]} rotation={[0.3, leg.angle, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
            <meshStandardMaterial color={LEG_COLOR} roughness={0.6} metalness={0.3} />
          </mesh>
          {/* Footpad */}
          <mesh position={[leg.pos[0] * 1.1, -0.55, leg.pos[2] * 1.1]}>
            <cylinderGeometry args={[0.12, 0.12, 0.03, 12]} />
            <meshStandardMaterial color={LEG_COLOR} roughness={0.7} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Wireframe accent sphere */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
