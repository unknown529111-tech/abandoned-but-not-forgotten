// src/components/equipment/EquipmentScene.tsx
// Renders either a GLB model (if equipment.modelUrl) or a procedural
// placeholder mesh so the viewer is always interactive.
import { useGLTF } from '@react-three/drei';
import type { Equipment } from '../../types';
import Surveyor1Model from './models/Surveyor1Model';
import Apollo11LMModel from './models/Apollo11LMModel';
import Viking1Model from './models/Viking1Model';
import CuriosityModel from './models/CuriosityModel';
import Voyager1Model from './models/Voyager1Model';
import PerseveranceModel from './models/PerseveranceModel';
import GenericRoverModel from './models/GenericRoverModel';
import GenericLanderModel from './models/GenericLanderModel';
import GenericOrbiterModel from './models/GenericOrbiterModel';
import GenericTelescopeModel from './models/GenericTelescopeModel';

interface Props {
  equipment: Equipment;
  reducedMotion: boolean;
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function getModelForEquipment(id: string, reducedMotion: boolean) {
  // Specific models
  if (id === 'surveyor-1') return <Surveyor1Model reducedMotion={reducedMotion} />;
  if (id === 'apollo-11-lm') return <Apollo11LMModel reducedMotion={reducedMotion} />;
  if (id === 'viking-1') return <Viking1Model reducedMotion={reducedMotion} />;
  if (id === 'curiosity') return <CuriosityModel reducedMotion={reducedMotion} />;
  if (id === 'voyager-1') return <Voyager1Model reducedMotion={reducedMotion} />;
  if (id === 'perseverance') return <PerseveranceModel reducedMotion={reducedMotion} />;

  // Category-based generic models
  const rovers = new Set(['mars-pathfinder', 'spirit', 'opportunity', 'zhurong', 'ingenuity', 'mars-2', 'mars-3']);
  const landers = new Set(['viking-2', 'phoenix', 'beagle-2', 'schiaparelli', 'mars-polar-lander', 'surveyor-3', 'surveyor-6', 'lunokhod-1', 'lunokhod-2', 'chang-e-3', 'chang-e-4', 'chandrayaan-3', 'slim', 'beresheet', 'peregrine-m1', 'im-1-odysseus', 'philae', 'apollo-15-lrv', 'apollo-17-lrv']);
  const telescopes = new Set(['hubble', 'jwst', 'kepler', 'spitzer', 'chandra']);

  if (rovers.has(id)) return <GenericRoverModel reducedMotion={reducedMotion} />;
  if (landers.has(id)) return <GenericLanderModel reducedMotion={reducedMotion} />;
  if (telescopes.has(id)) return <GenericTelescopeModel reducedMotion={reducedMotion} />;
  return <GenericOrbiterModel reducedMotion={reducedMotion} />;
}

export default function EquipmentScene({ equipment, reducedMotion }: Props) {
  const accent = '#42BFFF';
  return (
    <group>
      {equipment.modelUrl ? (
        <GLTFModel url={equipment.modelUrl} />
      ) : (
        getModelForEquipment(equipment.id, reducedMotion)
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
