// src/components/equipment/models/GenericLanderModel.tsx
// Generic lander model for lunar/Mars landers without a specific model.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const BODY = '#c8c8c8';
const LEG = '#777777';
const ACCENT = '#42BFFF';
export default function GenericLanderModel({ reducedMotion }) {
    const groupRef = useRef(null);
    useFrame((_, delta) => {
        if (groupRef.current && !reducedMotion)
            groupRef.current.rotation.y += delta * 0.3;
    });
    return (<group ref={groupRef} scale={0.5}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.6]}/>
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4}/>
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 24]}/>
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide}/>
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]}/>
        <meshStandardMaterial color={LEG} roughness={0.6} metalness={0.3}/>
      </mesh>
      {[0, 1, 2].map((i) => {
            const angle = (i * 2 * Math.PI) / 3;
            const x = Math.cos(angle) * 0.7;
            const z = Math.sin(angle) * 0.7;
            return (<group key={i}>
            <mesh position={[x * 0.4, -0.15, z * 0.4]} rotation={[0.3, angle, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.7, 8]}/>
              <meshStandardMaterial color={LEG} roughness={0.6} metalness={0.3}/>
            </mesh>
            <mesh position={[x, -0.55, z]}>
              <cylinderGeometry args={[0.1, 0.1, 0.03, 12]}/>
              <meshStandardMaterial color={LEG} roughness={0.7} metalness={0.2}/>
            </mesh>
          </group>);
        })}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 0.25, 12]}/>
        <meshStandardMaterial color="#555555" roughness={0.6} metalness={0.4}/>
      </mesh>
      <mesh scale={1.7}>
        <sphereGeometry args={[1.4, 16, 16]}/>
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05}/>
      </mesh>
    </group>);
}
