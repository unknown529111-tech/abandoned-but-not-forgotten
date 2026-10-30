// src/components/planet/PlanetScene.tsx
import * as THREE from 'three';
import { Html, useTexture } from '@react-three/drei';
import type { Body, Equipment } from '../../types';

interface Props {
  body: Body;
  points: Equipment[];
  reducedMotion: boolean;
  onHover: (eq: Equipment | null) => void;
  onClickPoint: (id: string) => void;
  hoveredId: string | null;
  portalRef?: any;
}

const RADIUS = 2;

const TEXTURES = {
  mercury: '/textures/2k_mercury.jpg',
  venus: '/textures/2k_venus_surface.jpg',
  earth: '/textures/2k_earth_daymap.jpg',
  mars: '/textures/2k_mars.jpg',
  jupiter: '/textures/2k_jupiter.jpg',
  saturn: '/textures/2k_saturn.jpg',
  uranus: '/textures/2k_uranus.jpg',
  neptune: '/textures/2k_neptune.jpg',
  moon: '/textures/2k_moon.jpg',
  sun: '/textures/2k_sun.jpg',
  ceres: '/textures/2k_ceres_fictional.jpg',
  saturnRing: '/textures/2k_saturn_ring_alpha.png',
  stars: '/textures/2k_stars.jpg',
};

function coordToVec3(eq: Equipment, noCoordIndex: number, totalNoCoord: number): [number, number, number] {
  if (eq.coord) {
    const lat = eq.coord.lat;
    const lon = eq.coord.lon;
    const latR = (lat * Math.PI) / 180;
    const lonR = (lon * Math.PI) / 180;
    const r = RADIUS + 0.06;
    return [
      r * Math.cos(latR) * Math.cos(lonR),
      r * Math.sin(latR),
      r * Math.cos(latR) * Math.sin(lonR),
    ];
  }
  // Fibonacci-ish spread for items without coordinates.
  const i = noCoordIndex;
  const n = Math.max(1, totalNoCoord);
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
  const r = RADIUS + 0.06;
  return [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}

export default function PlanetScene({ body, points, onHover, onClickPoint, hoveredId, portalRef }: Props) {
  const textures = useTexture(TEXTURES);
  const tex = (textures as any)[body.id] as THREE.Texture | undefined;
  // Precompute positions.
  const noCoordItems = points.filter((p) => !p.coord);
  const positions = points.map((eq) => {
    const noCoordIndex = noCoordItems.indexOf(eq);
    return coordToVec3(eq, noCoordIndex, noCoordItems.length);
  });

  return (
    <group>
      {/* Starfield removed: in orthographic view the sphere edge showed as a
          "lightning ring" around the planet. Stars live on the Solar page. */}

      {/* Planet surface */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={tex}
          color="#ffffff"
          roughness={0.75}
          metalness={0.1}
          emissive={body.accent}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Saturn rings */}
      {body.id === 'saturn' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[RADIUS + 0.3, RADIUS + 1.6, 64]} />
          <meshStandardMaterial
            map={textures.saturnRing}
            transparent
            side={THREE.DoubleSide}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Equipment points */}
      {points.map((eq, i) => {
        const pos = positions[i];
        const name = eq.name.en;
        const isHovered = hoveredId === eq.id;
        return (
          <group key={eq.id} position={pos}>
            <mesh
              onPointerOver={() => onHover(eq)}
              onPointerOut={() => onHover(null)}
              onClick={() => onClickPoint(eq.id)}
              onPointerDown={(e: any) => e.stopPropagation()}
            >
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#42BFFF" />
            </mesh>
            <Html center distanceFactor={1}            portal={portalRef as any} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                className={`planet-point${isHovered ? ' planet-point--hover' : ''}`}
                aria-label={`${name}${eq.launchDate ? ' ' + eq.launchDate : ''}`}
                onMouseEnter={() => onHover(eq)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(eq)}
                onBlur={() => onHover(null)}
                onClick={() => onClickPoint(eq.id)}
                onPointerDown={(e: any) => e.stopPropagation()}
              >
                <span className="planet-point__dot" />
              </button>
              {isHovered && (
                <div className="planet-tooltip motion-tooltip" role="tooltip">
                  <span className="planet-tooltip__name">{name}</span>
                  {eq.launchDate && <span className="planet-tooltip__date">• {eq.launchDate}</span>}
                </div>
              )}
            </Html>
          </group>
        );
      })}
    </group>
  );
}