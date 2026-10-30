// src/components/equipment/models/Apollo11LMModel.tsx
// Procedural 3D model of Apollo 11 Lunar Module (Eagle) — first crewed Moon landing, 1969.
// Descent stage (gold Kapton foil) + ascent stage (crew cabin, hatch, windows, docking tunnel),
// 4 A-frame landing legs with footpads, rendezvous radar, S-band and EVA antennas.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#d3d3d3';
const FOIL = '#c99a2e';
const LEG = '#8a8a8a';
const DARK = '#3a3a3a';
const GLASS = '#141a20';
const ACCENT = '#42BFFF';

const UP = new THREE.Vector3(0, 1, 0);

// Crinkled Kapton foil: grayscale crease lines multiplied by the gold base color.
function makeFoilTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 128, 128);
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 300; i++) {
    const x = rnd() * 128;
    const y = rnd() * 128;
    const len = 5 + rnd() * 22;
    const angle = rnd() * Math.PI;
    ctx.strokeStyle = rnd() > 0.5 ? 'rgba(255,255,255,0.65)' : 'rgba(70,50,10,0.35)';
    ctx.lineWidth = 0.8 + rnd() * 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Cylinder placed between two local points — used for struts, booms and masts.
function Strut({
  a,
  b,
  r = 0.022,
  color = LEG,
}: {
  a: [number, number, number];
  b: [number, number, number];
  r?: number;
  color?: string;
}) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const dir = end.clone().sub(start);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  return (
    <mesh position={start.add(end).multiplyScalar(0.5)} quaternion={quaternion}>
      <cylinderGeometry args={[r, r, dir.length(), 8]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.5} />
    </mesh>
  );
}

// Shallow parabolic dish (rendezvous radar, S-band, EVA antenna), opening toward +Y.
function Dish({ r, color = '#b0b0b0' }: { r: number; color?: string }) {
  return (
    <mesh>
      <sphereGeometry args={[r, 20, 12, 0, Math.PI * 2, 0, Math.PI / 3]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function Apollo11LMModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const foil = useMemo(() => (typeof document === 'undefined' ? null : makeFoilTexture()), []);

  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.5}>
      {/* ─────────── Descent stage ─────────── */}
      <mesh position={[0, -0.18, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.0, 1.06, 0.62, 8]} />
        <meshStandardMaterial color="#9d9d9d" roughness={0.55} metalness={0.6} />
      </mesh>
      {/* Gold foil thermal blanket wrapped around the octagonal body */}
      <mesh position={[0, -0.18, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.005, 1.065, 0.6, 8, 1, true]} />
        <meshStandardMaterial
          color={FOIL}
          map={foil}
          bumpMap={foil}
          bumpScale={0.02}
          roughness={0.45}
          metalness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Foil seam bands */}
      {[-0.02, -0.35].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, Math.PI / 8, 0]}>
          <cylinderGeometry args={[1.06, 1.07, 0.025, 8]} />
          <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
      {/* Upper deck ring and lower skirt */}
      <mesh position={[0, 0.135, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.05, 8]} />
        <meshStandardMaterial color="#c4c4c4" roughness={0.35} metalness={0.75} />
      </mesh>
      <mesh position={[0, -0.49, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.06, 1.0, 0.06, 8]} />
        <meshStandardMaterial color="#7d7d7d" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* MESA — modular equipment stowage bay (left side) */}
      <group position={[-0.9, -0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[0.46, 0.34, 0.06]} />
          <meshStandardMaterial color="#b8b8b8" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.24, 0.09]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.44, 0.02, 0.26]} />
          <meshStandardMaterial color="#9c9c9c" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>
      {/* ALSEP stowage bay (right side) */}
      <group position={[0.9, -0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[0.4, 0.3, 0.06]} />
          <meshStandardMaterial color={FOIL} roughness={0.5} metalness={0.8} />
        </mesh>
      </group>
      {/* PLSS backpacks stowed on the rear face */}
      <group position={[0, -0.16, -0.9]} rotation={[0, Math.PI, 0]}>
        {[-0.14, 0.14].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.22, 0.32, 0.08]} />
            <meshStandardMaterial color="#cfcfcf" roughness={0.6} metalness={0.3} />
          </mesh>
        ))}
      </group>
      {/* Landing radar plates on the underside */}
      {[-0.16, 0.16].map((x, i) => (
        <mesh key={i} position={[x, -0.52, 0.52]} rotation={[0.45, 0, 0]}>
          <boxGeometry args={[0.16, 0.02, 0.1]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      {/* Descent engine — gimbal housing, bell, nozzle lip */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.28, 0.1, 0.28]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, -0.73, 0]}>
        <cylinderGeometry args={[0.14, 0.42, 0.46, 24, 1, true]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.35} metalness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.955, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.03, 24, 1, true]} />
        <meshStandardMaterial color="#2e2e2e" roughness={0.4} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Interstage struts between the two stages */}
      {[0, 1, 2, 3].map((i) => {
        const angle = Math.PI / 4 + (i * Math.PI) / 2;
        const x = Math.cos(angle) * 0.5;
        const z = Math.sin(angle) * 0.5;
        return <Strut key={i} a={[x, 0.15, z]} b={[x * 0.92, 0.21, z * 0.92]} r={0.025} />;
      })}

      {/* ─────────── Ascent stage ─────────── */}
      {/* Tapered four-sided cabin */}
      <mesh position={[0, 0.46, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.52, 0.62, 0.52, 4]} />
        <meshStandardMaterial color={BODY} roughness={0.42} metalness={0.55} />
      </mesh>
      {/* Thermal blanket on the rear face */}
      <mesh position={[0, 0.45, -0.4]} rotation={[-0.13, 0, 0]}>
        <boxGeometry args={[0.74, 0.46, 0.03]} />
        <meshStandardMaterial color="#bfc2c4" roughness={0.7} metalness={0.25} />
      </mesh>
      {/* Flat top deck */}
      <mesh position={[0, 0.715, 0]}>
        <boxGeometry args={[0.72, 0.04, 0.72]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Propellant tanks on the rear deck */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.62, -0.24]}>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial color="#a8a8a8" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* Forward face: slanted plate carrying hatch, porch and windows */}
      <group position={[0, 0.46, 0.432]} rotation={[-0.134, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.78, 0.52, 0.03]} />
          <meshStandardMaterial color="#d8d8d8" roughness={0.45} metalness={0.5} />
        </mesh>
        {/* Hatch frame, door and handle */}
        <mesh position={[-0.17, -0.05, 0.02]}>
          <boxGeometry args={[0.3, 0.34, 0.02]} />
          <meshStandardMaterial color="#9a9a9a" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[-0.17, -0.05, 0.035]}>
          <boxGeometry args={[0.26, 0.3, 0.02]} />
          <meshStandardMaterial color="#c2c2c2" roughness={0.4} metalness={0.65} />
        </mesh>
        <mesh position={[-0.06, -0.05, 0.055]}>
          <boxGeometry args={[0.025, 0.07, 0.02]} />
          <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Porch and handrails outside the hatch */}
        <mesh position={[-0.17, -0.26, 0.1]}>
          <boxGeometry args={[0.36, 0.025, 0.2]} />
          <meshStandardMaterial color="#b0b0b0" roughness={0.5} metalness={0.6} />
        </mesh>
        {[-0.33, -0.01].map((x, i) => (
          <mesh key={i} position={[x, -0.16, 0.17]}>
            <boxGeometry args={[0.02, 0.2, 0.02]} />
            <meshStandardMaterial color={LEG} roughness={0.5} metalness={0.6} />
          </mesh>
        ))}
        {/* Two triangular forward windows */}
        {[
          { x: 0.04, y: 0.12, r: 0.08 },
          { x: 0.27, y: 0.1, r: 0.07 },
        ].map((w, i) => (
          <mesh key={i} position={[w.x, w.y, 0.025]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[w.r, w.r, 0.02, 3]} />
            <meshStandardMaterial color={GLASS} roughness={0.15} metalness={0.9} />
          </mesh>
        ))}
        {/* Rendezvous window on the left cheek */}
        <mesh position={[-0.36, 0.1, 0.025]}>
          <boxGeometry args={[0.09, 0.07, 0.02]} />
          <meshStandardMaterial color={GLASS} roughness={0.15} metalness={0.9} />
        </mesh>
      </group>
      {/* Overhead window (crew looked up through it during docking) */}
      <mesh position={[0, 0.735, 0.12]} rotation={[-0.13, 0, 0]}>
        <boxGeometry args={[0.17, 0.02, 0.13]} />
        <meshStandardMaterial color={GLASS} roughness={0.15} metalness={0.9} />
      </mesh>

      {/* Docking tunnel, drogue and docking target */}
      <mesh position={[0, 0.79, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.14, 20, 1, true]} />
        <meshStandardMaterial color="#bdbdbd" roughness={0.35} metalness={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.862, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.018, 8, 24]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.775, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.13, 0.14, 14, 1, true]} />
        <meshStandardMaterial color="#4d4d4d" roughness={0.5} metalness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.872, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.012, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.4} metalness={0.5} />
      </mesh>
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh key={i} position={[0, 0.878, 0]} rotation={[0, rot, 0]}>
          <boxGeometry args={[0.1, 0.008, 0.014]} />
          <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Rendezvous radar — boom + dish on the right rear of the ascent stage */}
      <group>
        <Strut a={[0.26, 0.71, -0.26]} b={[0.38, 0.9, -0.33]} r={0.018} />
        <mesh position={[0.38, 0.92, -0.34]} rotation={[-0.6, 0.4, 0]}>
          <Dish r={0.105} />
        </mesh>
        <mesh position={[0.38, 0.9, -0.33]}>
          <sphereGeometry args={[0.035, 10, 8]} />
          <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* S-band steerable antenna — left rear mast */}
      <group>
        <Strut a={[-0.3, 0.72, -0.14]} b={[-0.36, 0.88, -0.18]} r={0.015} />
        <mesh position={[-0.37, 0.9, -0.19]} rotation={[-0.5, -0.4, 0]}>
          <Dish r={0.12} />
        </mesh>
      </group>

      {/* EVA antenna — small dish with feed on the front left */}
      <group position={[-0.3, 0.73, 0.2]}>
        <Strut a={[0, 0, 0]} b={[0.02, 0.12, 0.02]} r={0.012} />
        <mesh position={[0.02, 0.14, 0.02]} rotation={[-0.9, 0, 0]}>
          <Dish r={0.07} color="#cccccc" />
        </mesh>
        <mesh position={[0.02, 0.19, 0.03]}>
          <sphereGeometry args={[0.015, 8, 6]} />
          <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* RCS thruster quads at the four upper corners */}
      {[
        [0.3, 0.3],
        [-0.3, 0.3],
        [0.3, -0.3],
        [-0.3, -0.3],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.6, z]} rotation={[0, Math.atan2(x, z), 0]}>
          <mesh>
            <boxGeometry args={[0.09, 0.12, 0.09]} />
            <meshStandardMaterial color="#b5b5b5" roughness={0.4} metalness={0.7} />
          </mesh>
          {[0.04, -0.04].map((y, j) => (
            <mesh key={j} position={[0.07, y, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.028, 0.06, 8, 1, true]} />
              <meshStandardMaterial color="#2f2f2f" roughness={0.5} metalness={0.7} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ─────────── Landing legs (A-frame at the four diagonals) ─────────── */}
      {[45, 135, 225, 315].map((deg, i) => {
        const angle = (deg * Math.PI) / 180;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            {/* Primary strut with shock absorber */}
            <Strut a={[0.88, -0.12, 0]} b={[1.34, -0.72, 0]} r={0.035} />
            <Strut a={[0.9, -0.18, 0]} b={[1.06, -0.42, 0]} r={0.052} />
            {/* Two secondary struts forming the A-frame */}
            <Strut a={[0.6, -0.32, 0.16]} b={[1.3, -0.7, 0]} r={0.017} />
            <Strut a={[0.6, -0.32, -0.16]} b={[1.3, -0.7, 0]} r={0.017} />
            {/* Footpad, crushable honeycomb pad, contact probe */}
            <mesh position={[1.34, -0.72, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.045, 16]} />
              <meshStandardMaterial color="#c4c4c4" roughness={0.45} metalness={0.65} />
            </mesh>
            <mesh position={[1.34, -0.765, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.05, 16]} />
              <meshStandardMaterial color="#8e8e8e" roughness={0.85} metalness={0.2} />
            </mesh>
            <mesh position={[1.34, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.022, 0.14, 8]} />
              <meshStandardMaterial color="#9c9c9c" roughness={0.5} metalness={0.6} />
            </mesh>
            {/* Ladder on the forward-right leg */}
            {i === 0 &&
              [0.3, 0.5, 0.7].map((t, j) => (
                <mesh key={j} position={[0.88 + 0.46 * t + 0.05, -0.12 - 0.6 * t + 0.04, 0]}>
                  <boxGeometry args={[0.02, 0.02, 0.19]} />
                  <meshStandardMaterial color="#a8a8a8" roughness={0.5} metalness={0.6} />
                </mesh>
              ))}
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
