// src/components/equipment/models/GenericOrbiterModel.tsx
// Generic orbiter/spacecraft model for probes without a specific model.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
const BODY = '#c8c8c8';
const PANEL = '#1a3a5c';
const BOOM = '#666666';
const ACCENT = '#42BFFF';
export default function GenericOrbiterModel({ reducedMotion }) {
    const groupRef = useRef(null);
    useFrame((_, delta) => {
        if (groupRef.current && !reducedMotion)
            groupRef.current.rotation.y += delta * 0.3;
    });
    return (<group ref={groupRef} scale={0.5}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.5]}/>
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4}/>
      </mesh>
      {/* Solar panels */}
      {[-1, 1].map((side, i) => (<mesh key={i} position={[side * 0.9, 0, 0]} rotation={[0, 0, side * 0.1]}>
          <boxGeometry args={[0.7, 0.02, 0.5]}/>
          <meshStandardMaterial color={PANEL} roughness={0.3} metalness={0.6}/>
        </mesh>))}
      {/* Antenna */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]}/>
        <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.3}/>
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.05, 8, 8]}/>
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.7}/>
      </mesh>
      {/* Engine nozzle */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.2, 12]}/>
        <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.4}/>
      </mesh>
      <mesh scale={1.7}>
        <sphereGeometry args={[1.5, 16, 16]}/>
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05}/>
      </mesh>
    </group>);
}
