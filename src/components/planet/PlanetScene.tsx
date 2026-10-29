// src/components/planet/PlanetScene.tsx
import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
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
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, body.accent);
      grad.addColorStop(0.5, '#1a2a4a');
      grad.addColorStop(1, '#050811');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
      // subtle noise
      for (let i = 0; i < 1200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const a = Math.random() * 0.08;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [body.accent]);

  // Precompute positions.
  const noCoordItems = points.filter((p) => !p.coord);
  const positions = points.map((eq) => {
    const noCoordIndex = noCoordItems.indexOf(eq);
    return coordToVec3(eq, noCoordIndex, noCoordItems.length);
  });

  return (
    <group>
      {/* Planet surface */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          color={body.accent}
          roughness={0.75}
          metalness={0.1}
          emissive={body.accent}
          emissiveIntensity={0.08}
        />
      </mesh>

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
            >
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#42BFFF" />
            </mesh>
            <Html center distanceFactor={8}            portal={portalRef as any} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                className={`planet-point${isHovered ? ' planet-point--hover' : ''}`}
                aria-label={`${name}${eq.launchDate ? ' ' + eq.launchDate : ''}`}
                onMouseEnter={() => onHover(eq)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(eq)}
                onBlur={() => onHover(null)}
                onClick={() => onClickPoint(eq.id)}
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