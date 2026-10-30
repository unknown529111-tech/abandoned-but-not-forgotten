// src/components/equipment/EquipmentScene.tsx
// Renders either a GLB model (if equipment.modelUrl) or a procedural
// placeholder mesh so the viewer is always interactive.
import { useGLTF } from '@react-three/drei';
import type { Equipment } from '../../types';
import Surveyor1Model from './models/Surveyor1Model';

interface Props {
  equipment: Equipment;
  reducedMotion: boolean;
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function EquipmentScene({ equipment, reducedMotion }: Props) {
  const accent = '#42BFFF';
  return (
    <group>
      {equipment.modelUrl ? (
        <GLTFModel url={equipment.modelUrl} />
      ) : equipment.id === 'surveyor-1' ? (
        <Surveyor1Model reducedMotion={reducedMotion} />
      ) : (
        <mesh rotation={[0.3, 0.4, 0]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial
            color={accent}
            roughness={0.4}
            metalness={0.3}
            emissive={accent}
            emissiveIntensity={0.15}
          />
        </mesh>
      )}
      {!reducedMotion && (
        <mesh scale={1.6}>
          <sphereGeometry args={[1.25, 24, 24]} />
          <meshBasicMaterial color={accent} wireframe transparent opacity={0.08} />
        </mesh>
      )}
    </group>
  );
}
