// src/components/equipment/models/Surveyor1Model.tsx
// Procedural 3D model of Surveyor 1, the first U.S. soft landing on the Moon (June 1966).
// Layout follows the flight article: a hexagonal aluminum spaceframe wrapped in thermal
// blankets, a solid-propellant main retro motor on the centerline, three throttleable
// vernier engines, two spherical vernier propellant tanks on outriggers, a flat solar
// array on the upper deck, a gimballed planar-array high-gain antenna, a scanning TV
// camera on a mast, and three crushable landing legs with honeycomb shock absorbers and
// footpad crush pads.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BLANKET_COLOR = '#c9cdd2'; // thermal blanket over the bus
const BLANKET_ALT_COLOR = '#b6bbc1'; // overlapping blanket panel, slightly darker
const PANEL_COLOR = '#c2c6cb'; // painted equipment panels
const FRAME_COLOR = '#8d939a'; // exposed aluminum spaceframe tubing
const FRAME_DARK_COLOR = '#6d7278'; // fittings, clamps, brackets
const CELL_COLOR = '#16324f'; // solar cell, dark face
const CELL_ALT_COLOR = '#1d4266'; // solar cell, alternate shade
const GRID_COLOR = '#9aa3ab'; // cell interconnects and busbars
const PANEL_FRAME_COLOR = '#a7adb3'; // array substrate, rails and junction box
const ANTENNA_COLOR = '#b6bcc2'; // antenna hardware
const ENGINE_COLOR = '#5a5f66'; // motor and vernier cases
const NOZZLE_COLOR = '#3f4348'; // nozzle bells and throats
const NOZZLE_DARK_COLOR = '#484c52'; // nozzle exit cone
const TANK_COLOR = '#c3c9cf'; // propellant tank shells
const CRUSH_COLOR = '#b08a3e'; // aluminum honeycomb crush cartridges
const CRUSH_DARK_COLOR = '#8d6d31'; // crush cartridge banding
const DARK_COLOR = '#22262b'; // optics, sensors, connectors
const ACCENT = '#42BFFF';

type Vec3 = [number, number, number];

const rad = (deg: number) => (deg * Math.PI) / 180;

const polar = (deg: number, radius: number, y: number): Vec3 => {
  const t = rad(deg);
  return [Math.sin(t) * radius, y, Math.cos(t) * radius];
};

const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const offset = (p: Vec3, d: Vec3): Vec3 => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];

/** Cylinder stretched between two points — used for struts, braces, feed lines and tubes. */
function Strut({ a, b, radius, color }: { a: Vec3; b: Vec3; radius: number; color: string }) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const dir = end.clone().sub(start);
  const length = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize()
  );

  return (
    <mesh position={start.clone().add(end).multiplyScalar(0.5)} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.45} />
    </mesh>
  );
}

// Legs sit on the hex vertices, verniers between them, tanks on two outriggers.
const LEG_ANGLES = [0, 120, 240];
const VERNIER_ANGLES = [60, 180, 300];
const TANK_ANGLES = [90, 270];
const LOUVER_FACES = [0, 2, 4]; // 30°, 150°, 270° bus faces carry thermal louvers
const SENSOR_ANGLES = [90, 210, 330]; // micrometeoroid detector plates on the frame

// Solar array: 13 x 7 cells. The gaps in the substrate form the grid; the thin strips
// are the series interconnects and the wider runs are the string busbars.
const CELLS: { x: number; z: number; alt: boolean }[] = [];
for (let c = 0; c < 13; c++) {
  for (let r = 0; r < 7; r++) {
    CELLS.push({
      x: 0.02 + (c - 6) * 0.094,
      z: 0.02 + (r - 3) * 0.094,
      alt: (c + r) % 2 === 0,
    });
  }
}

const GRID_X: number[] = [];
for (let c = 0; c < 14; c++) GRID_X.push(0.02 + (c - 6.5) * 0.094);

const GRID_Z: number[] = [];
for (let r = 0; r < 8; r++) GRID_Z.push(0.02 + (r - 3.5) * 0.094);

// Planar array radiating elements: 6 x 5 patch grid.
const ELEMENTS: { x: number; z: number }[] = [];
for (let ex = 0; ex < 6; ex++) {
  for (let ez = 0; ez < 5; ez++) {
    ELEMENTS.push({ x: (ex - 2.5) * 0.072, z: (ez - 2) * 0.072 });
  }
}

export default function Surveyor1Model({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={0.6}>
      {/* ---------- Hexagonal bus: blankets, face panels, louvers ---------- */}
      <mesh position={[0, 0.31, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.46, 6]} />
        <meshStandardMaterial color={BLANKET_COLOR} roughness={0.68} metalness={0.16} />
      </mesh>

      {[0, 1, 2, 3, 4, 5].map((i) => {
        const face = i * 60 + 30;
        const louvered = LOUVER_FACES.includes(i);
        return (
          <group
            key={`face-${face}`}
            position={polar(face, 0.487, 0.31)}
            rotation={[0, rad(face), 0]}
          >
            {/* Painted equipment panel */}
            <mesh>
              <boxGeometry args={[0.50, 0.40, 0.016]} />
              <meshStandardMaterial color={PANEL_COLOR} roughness={0.58} metalness={0.24} />
            </mesh>
            {/* Blanket seams / stiffener ribs */}
            {[-0.10, 0.10].map((dy, j) => (
              <mesh key={`rib-${j}`} position={[0, dy, 0.012]}>
                <boxGeometry args={[0.50, 0.016, 0.018]} />
                <meshStandardMaterial color={FRAME_COLOR} roughness={0.42} metalness={0.6} />
              </mesh>
            ))}
            {/* Overlapping blanket patch, offset so the faces do not read as identical */}
            <mesh position={[i % 2 === 0 ? -0.13 : 0.13, 0, 0.010]}>
              <boxGeometry args={[0.21, 0.12, 0.006]} />
              <meshStandardMaterial color={BLANKET_ALT_COLOR} roughness={0.82} metalness={0.1} />
            </mesh>
            {/* Thermal louver bank: slats over a dark backing plate */}
            {louvered && (
              <group position={[0, 0, 0.016]}>
                <mesh position={[0, 0, -0.004]}>
                  <boxGeometry args={[0.46, 0.28, 0.008]} />
                  <meshStandardMaterial color={DARK_COLOR} roughness={0.62} metalness={0.35} />
                </mesh>
                {[0, 1, 2, 3, 4, 5].map((s) => (
                  <mesh key={`slat-${s}`} position={[0, -0.12 + s * 0.048, 0.008]}>
                    <boxGeometry args={[0.44, 0.026, 0.014]} />
                    <meshStandardMaterial
                      color={s % 2 === 0 ? '#9fa4aa' : '#6d7278'}
                      roughness={0.35}
                      metalness={0.68}
                    />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        );
      })}

      {/* ---------- External spaceframe: longerons, rings, X-bracing, gussets ---------- */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`longeron-${i}`} position={polar(i * 60, 0.60, 0.31)}>
          <cylinderGeometry args={[0.020, 0.020, 0.50, 8]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.58} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Strut
          key={`ring-top-${i}`}
          a={polar(i * 60, 0.60, 0.555)}
          b={polar((i + 1) * 60, 0.60, 0.555)}
          radius={0.016}
          color={FRAME_COLOR}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Strut
          key={`ring-bottom-${i}`}
          a={polar(i * 60, 0.60, 0.065)}
          b={polar((i + 1) * 60, 0.60, 0.065)}
          radius={0.016}
          color={FRAME_COLOR}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Strut
          key={`ring-mid-${i}`}
          a={polar(i * 60, 0.60, 0.31)}
          b={polar((i + 1) * 60, 0.60, 0.31)}
          radius={0.010}
          color={FRAME_COLOR}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group key={`bay-${i}`}>
          <Strut
            a={polar(i * 60, 0.60, 0.545)}
            b={polar((i + 1) * 60, 0.60, 0.315)}
            radius={0.009}
            color={FRAME_COLOR}
          />
          <Strut
            a={polar((i + 1) * 60, 0.60, 0.545)}
            b={polar(i * 60, 0.60, 0.315)}
            radius={0.009}
            color={FRAME_COLOR}
          />
          <Strut
            a={polar(i * 60, 0.60, 0.305)}
            b={polar((i + 1) * 60, 0.60, 0.075)}
            radius={0.009}
            color={FRAME_COLOR}
          />
          <Strut
            a={polar((i + 1) * 60, 0.60, 0.305)}
            b={polar(i * 60, 0.60, 0.075)}
            radius={0.009}
            color={FRAME_COLOR}
          />
          {/* Corner gusset plates where the longeron meets the top ring */}
          <mesh position={polar(i * 60, 0.615, 0.545)} rotation={[0, rad(i * 60), 0]}>
            <boxGeometry args={[0.075, 0.022, 0.05]} />
            <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.4} metalness={0.65} />
          </mesh>
        </group>
      ))}

      {/* Upper deck plate, edge ring and bolt circle */}
      <mesh position={[0, 0.585, 0]}>
        <cylinderGeometry args={[0.63, 0.63, 0.035, 6]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.42} metalness={0.62} />
      </mesh>
      <mesh position={[0, 0.604, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.012, 6]} />
        <meshStandardMaterial color="#9ba1a7" roughness={0.5} metalness={0.55} />
      </mesh>
      {Array.from({ length: 18 }).map((_, i) => {
        const p = polar(i * 20, 0.515, 0.607);
        return (
          <mesh key={`deck-bolt-${i}`} position={p}>
            <cylinderGeometry args={[0.009, 0.009, 0.010, 6]} />
            <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.35} metalness={0.8} />
          </mesh>
        );
      })}

      {/* Tapered lower structure from the bus down to the retro-motor mount */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.55, 0.30, 0.14, 6]} />
        <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.48} metalness={0.58} />
      </mesh>
      <mesh position={[0, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.235, 0.014, 8, 26]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.65} />
      </mesh>

      {/* ---------- Deck equipment: radio, battery, signal conditioner, sensors ---------- */}
      <group position={[-0.26, 0.662, 0.42]} rotation={[0, 0.16, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 0.13, 0.16]} />
          <meshStandardMaterial color="#767c83" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.072, 0]}>
          <boxGeometry args={[0.20, 0.014, 0.14]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0.06, 0.06, -0.075]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 8]} />
          <meshStandardMaterial color={DARK_COLOR} roughness={0.4} metalness={0.65} />
        </mesh>
        {/* Mounting feet */}
        {[-0.08, 0.08].map((dx, k) => (
          <mesh key={`radio-foot-${k}`} position={[dx, -0.073, 0]}>
            <boxGeometry args={[0.03, 0.016, 0.05]} />
            <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.45} metalness={0.6} />
          </mesh>
        ))}
      </group>
      <mesh position={[-0.02, 0.655, 0.53]}>
        <boxGeometry args={[0.20, 0.105, 0.13]} />
        <meshStandardMaterial color="#5f656c" roughness={0.55} metalness={0.45} />
      </mesh>
      <mesh position={[0.47, 0.653, 0.16]}>
        <boxGeometry args={[0.14, 0.09, 0.18]} />
        <meshStandardMaterial color="#6b7178" roughness={0.5} metalness={0.55} />
      </mesh>
      {/* Small electronics boxes tucked under the array */}
      <mesh position={[0.10, 0.652, 0.20]}>
        <boxGeometry args={[0.16, 0.055, 0.12]} />
        <meshStandardMaterial color="#7b8188" roughness={0.52} metalness={0.48} />
      </mesh>
      <mesh position={[-0.30, 0.648, 0.16]}>
        <boxGeometry args={[0.12, 0.05, 0.16]} />
        <meshStandardMaterial color="#71777e" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Sun sensors: three canisters looking sideways off the bus faces */}
      {[90, 210, 330].map((angle) => {
        const p = polar(angle, 0.54, 0.30);
        return (
          <group key={`sun-${angle}`} position={p} rotation={[0, rad(angle), 0]}>
            <Strut a={[0, 0, -0.048]} b={[0, 0, -0.02]} radius={0.008} color={FRAME_DARK_COLOR} />
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.030, 0.034, 0.055, 12]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.45} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.030]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.008, 12]} />
              <meshStandardMaterial color={DARK_COLOR} roughness={0.15} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.014, 0.012]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[0.036, 0.004, 0.030]} />
              <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.65} />
            </mesh>
          </group>
        );
      })}
      {/* Canopus star tracker on the aft deck */}
      <group position={[0.18, 0.70, -0.50]} rotation={[0.55, 0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.034, 0.038, 0.16, 14]} />
          <meshStandardMaterial color={ENGINE_COLOR} roughness={0.4} metalness={0.62} />
        </mesh>
        <mesh position={[0, 0.082, 0]}>
          <cylinderGeometry args={[0.030, 0.030, 0.010, 14]} />
          <meshStandardMaterial color={DARK_COLOR} roughness={0.1} metalness={0.85} />
        </mesh>
        <mesh position={[0, 0.092, 0.024]}>
          <boxGeometry args={[0.044, 0.006, 0.030]} />
          <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>
        <Strut a={[0, -0.08, 0]} b={[0, -0.14, 0.02]} radius={0.012} color={FRAME_COLOR} />
      </group>

      {/* Cable runs: antenna mast to radio, camera to conditioner */}
      <Strut a={[0.04, 0.62, -0.44]} b={[-0.20, 0.63, 0.34]} radius={0.007} color={DARK_COLOR} />
      <Strut a={[0.26, 0.72, 0.44]} b={[0.42, 0.64, 0.24]} radius={0.006} color={DARK_COLOR} />
      <Strut a={[0.42, 0.64, 0.24]} b={[0.47, 0.655, 0.16]} radius={0.006} color={DARK_COLOR} />

      {/* ---------- Solar array on the upper deck ---------- */}
      <mesh position={[0.02, 0.72, 0.02]}>
        <boxGeometry args={[1.34, 0.030, 0.70]} />
        <meshStandardMaterial color={PANEL_FRAME_COLOR} roughness={0.42} metalness={0.55} />
      </mesh>
      {CELLS.map((cell, i) => (
        <mesh key={`cell-${i}`} position={[cell.x, 0.7405, cell.z]}>
          <boxGeometry args={[0.084, 0.009, 0.084]} />
          <meshStandardMaterial
            color={cell.alt ? CELL_COLOR : CELL_ALT_COLOR}
            roughness={0.18}
            metalness={0.72}
          />
        </mesh>
      ))}
      {/* Series interconnects between cells */}
      {GRID_X.map((x, i) => (
        <mesh key={`grid-x-${i}`} position={[x, 0.7395, 0.02]}>
          <boxGeometry args={[0.006, 0.005, 0.66]} />
          <meshStandardMaterial color={GRID_COLOR} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      {GRID_Z.map((z, i) => (
        <mesh key={`grid-z-${i}`} position={[0.02, 0.7395, z]}>
          <boxGeometry args={[1.26, 0.005, 0.006]} />
          <meshStandardMaterial color={GRID_COLOR} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      {/* String busbars and their junction tabs */}
      {[-0.208, 0.248].map((z, i) => (
        <mesh key={`busbar-${i}`} position={[0.02, 0.7455, z]}>
          <boxGeometry args={[1.22, 0.004, 0.012]} />
          <meshStandardMaterial color="#c8ced4" roughness={0.22} metalness={0.85} />
        </mesh>
      ))}
      {[-0.52, -0.20, 0.12, 0.44].map((x, i) => (
        <mesh key={`busbar-tab-${i}`} position={[x, 0.7455, 0.248]}>
          <boxGeometry args={[0.022, 0.006, 0.028]} />
          <meshStandardMaterial color={DARK_COLOR} roughness={0.35} metalness={0.7} />
        </mesh>
      ))}
      {/* Cover glass over the cell field */}
      <mesh position={[0.02, 0.748, 0.02]}>
        <boxGeometry args={[1.32, 0.004, 0.68]} />
        <meshStandardMaterial
          color="#a9c7e0"
          roughness={0.06}
          metalness={0.35}
          transparent
          opacity={0.16}
        />
      </mesh>
      {/* Array rails */}
      {[-0.67, 0.71].map((x, i) => (
        <mesh key={`rail-x-${i}`} position={[x, 0.726, 0.02]}>
          <boxGeometry args={[0.04, 0.058, 0.74]} />
          <meshStandardMaterial color={PANEL_FRAME_COLOR} roughness={0.36} metalness={0.65} />
        </mesh>
      ))}
      {[-0.35, 0.39].map((z, i) => (
        <mesh key={`rail-z-${i}`} position={[0.02, 0.726, z]}>
          <boxGeometry args={[1.42, 0.058, 0.04]} />
          <meshStandardMaterial color={PANEL_FRAME_COLOR} roughness={0.36} metalness={0.65} />
        </mesh>
      ))}
      {/* Underside ribs */}
      {[-0.24, 0.02, 0.28].map((z, i) => (
        <mesh key={`panel-rib-${i}`} position={[0.02, 0.698, z]}>
          <boxGeometry args={[1.28, 0.026, 0.022]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.6} />
        </mesh>
      ))}
      {/* Junction box and connectors */}
      <mesh position={[0.60, 0.756, -0.30]}>
        <boxGeometry args={[0.11, 0.062, 0.10]} />
        <meshStandardMaterial color={PANEL_FRAME_COLOR} roughness={0.4} metalness={0.55} />
      </mesh>
      {[-0.025, 0.025].map((dx, i) => (
        <mesh key={`jbox-conn-${i}`} position={[0.60 + dx, 0.79, -0.30]}>
          <cylinderGeometry args={[0.013, 0.013, 0.03, 8]} />
          <meshStandardMaterial color={DARK_COLOR} roughness={0.35} metalness={0.7} />
        </mesh>
      ))}
      <Strut a={[0.55, 0.74, -0.30]} b={[0.55, 0.64, -0.22]} radius={0.006} color={DARK_COLOR} />

      {/* Array support posts down to the top frame ring */}
      {[
        [0.55, -0.24],
        [0.55, 0.24],
        [-0.51, -0.24],
        [-0.51, 0.24],
      ].map(([x, z], i) => (
        <group key={`panel-post-${i}`}>
          <mesh position={[x, 0.64, z]}>
            <cylinderGeometry args={[0.016, 0.016, 0.14, 8]} />
            <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.6} />
          </mesh>
          <mesh position={[x, 0.575, z]}>
            <cylinderGeometry args={[0.030, 0.032, 0.022, 8]} />
            <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.6} />
          </mesh>
          <Strut a={[x, 0.70, z]} b={[x * 0.86, 0.735, z]} radius={0.010} color={FRAME_COLOR} />
        </group>
      ))}

      {/* ---------- Planar-array high-gain antenna (aft mast, two-axis gimbal) ---------- */}
      <mesh position={[0, 0.78, -0.46]}>
        <cylinderGeometry args={[0.026, 0.034, 0.40, 12]} />
        <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.60, -0.46]}>
        <cylinderGeometry args={[0.055, 0.058, 0.026, 12]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.45} metalness={0.6} />
      </mesh>
      {/* Mast clamps and a cable run clipped to the tube */}
      {[0.70, 0.84, 0.95].map((y, i) => (
        <mesh key={`mast-clamp-${i}`} position={[0, y, -0.46]}>
          <cylinderGeometry args={[0.034, 0.034, 0.014, 10]} />
          <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      {/* Azimuth bearing housing and its drive motor */}
      <mesh position={[0, 0.995, -0.46]}>
        <cylinderGeometry args={[0.058, 0.058, 0.055, 14]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
      </mesh>
      <mesh position={[0.085, 0.985, -0.46]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 0.075, 10]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
      </mesh>
      <mesh position={[0, 0.962, -0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.062, 0.008, 6, 20]} />
        <meshStandardMaterial color={DARK_COLOR} roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Elevation trunnion and yoke arms */}
      <mesh position={[0, 1.045, -0.46]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.20, 10]} />
        <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.35} metalness={0.75} />
      </mesh>
      {[-0.095, 0.095].map((dx, i) => (
        <mesh key={`yoke-${i}`} position={[dx, 1.035, -0.46]}>
          <boxGeometry args={[0.018, 0.06, 0.05]} />
          <meshStandardMaterial color={ENGINE_COLOR} roughness={0.45} metalness={0.6} />
        </mesh>
      ))}
      <group position={[0, 1.10, -0.48]} rotation={[-0.5, 0.22, 0]}>
        {/* Array plate and rim */}
        <mesh>
          <boxGeometry args={[0.50, 0.026, 0.44]} />
          <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.42} metalness={0.62} />
        </mesh>
        <mesh position={[0, 0.014, 0]}>
          <boxGeometry args={[0.46, 0.006, 0.40]} />
          <meshStandardMaterial color="#8e949a" roughness={0.3} metalness={0.8} />
        </mesh>
        {[-0.235, 0.235].map((dx, i) => (
          <mesh key={`array-rim-x-${i}`} position={[dx, 0.018, 0]}>
            <boxGeometry args={[0.018, 0.014, 0.44]} />
            <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.38} metalness={0.7} />
          </mesh>
        ))}
        {ELEMENTS.map((el, i) => (
          <mesh key={`element-${i}`} position={[el.x, 0.020, el.z]}>
            <boxGeometry args={[0.048, 0.006, 0.048]} />
            <meshStandardMaterial color="#9aa0a6" roughness={0.28} metalness={0.82} />
          </mesh>
        ))}
        {/* Feed horn on a tripod above the array face */}
        <mesh position={[0, 0.155, 0]}>
          <cylinderGeometry args={[0.018, 0.055, 0.10, 14]} />
          <meshStandardMaterial
            color={ENGINE_COLOR}
            roughness={0.32}
            metalness={0.78}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.212, 0]}>
          <cylinderGeometry args={[0.020, 0.020, 0.024, 12]} />
          <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.118, 0]}>
          <torusGeometry args={[0.050, 0.005, 6, 16]} />
          <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.35} metalness={0.75} />
        </mesh>
        {[
          [0.20, 0.17],
          [-0.20, 0.17],
          [0, -0.20],
        ].map(([x, z], i) => (
          <Strut
            key={`feed-strut-${i}`}
            a={[x, 0.014, z]}
            b={[0, 0.108, 0]}
            radius={0.006}
            color={ANTENNA_COLOR}
          />
        ))}
        {/* Waveguide from the plate back to the gimbal */}
        <Strut a={[0, -0.018, 0.14]} b={[0, -0.06, 0.02]} radius={0.017} color={DARK_COLOR} />
        <Strut a={[0, -0.06, 0.02]} b={[0.035, -0.10, 0.10]} radius={0.017} color={DARK_COLOR} />
      </group>
      {/* Azimuth cable wrap and the wave-guide down the mast */}
      <Strut a={[0.03, 0.96, -0.46]} b={[0.05, 0.66, -0.44]} radius={0.012} color={DARK_COLOR} />
      <Strut a={[0.05, 0.66, -0.44]} b={[-0.10, 0.62, -0.38]} radius={0.010} color={DARK_COLOR} />

      {/* ---------- Scanning TV camera on a mast ---------- */}
      <mesh position={[0.26, 0.755, 0.44]}>
        <cylinderGeometry args={[0.026, 0.030, 0.31, 10]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0.26, 0.612, 0.44]}>
        <cylinderGeometry args={[0.055, 0.060, 0.022, 10]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.6} />
      </mesh>
      {/* Mast clamps and tripod braces */}
      {[0.68, 0.79, 0.89].map((y, i) => (
        <mesh key={`cam-clamp-${i}`} position={[0.26, y, 0.44]}>
          <cylinderGeometry args={[0.031, 0.031, 0.012, 10]} />
          <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.42} metalness={0.68} />
        </mesh>
      ))}
      <Strut a={[0.10, 0.62, 0.40]} b={[0.26, 0.78, 0.44]} radius={0.010} color={FRAME_COLOR} />
      <Strut a={[0.40, 0.62, 0.36]} b={[0.26, 0.78, 0.44]} radius={0.010} color={FRAME_COLOR} />
      {/* Brackets tying the mast to the front array rail */}
      <Strut a={[0.14, 0.750, 0.40]} b={[0.26, 0.80, 0.44]} radius={0.008} color={FRAME_COLOR} />
      <Strut a={[0.38, 0.750, 0.40]} b={[0.26, 0.80, 0.44]} radius={0.008} color={FRAME_COLOR} />
      <Strut a={[0.26, 0.62, 0.30]} b={[0.26, 0.70, 0.44]} radius={0.010} color={FRAME_COLOR} />
      {/* Azimuth drive at the top of the mast */}
      <mesh position={[0.26, 0.925, 0.44]}>
        <cylinderGeometry args={[0.050, 0.056, 0.040, 14]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh position={[0.26, 0.905, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.050, 0.007, 6, 18]} />
        <meshStandardMaterial color={DARK_COLOR} roughness={0.45} metalness={0.55} />
      </mesh>
      {/* Camera yoke and housing */}
      {[-0.10, 0.10].map((dx, i) => (
        <mesh key={`cam-yoke-${i}`} position={[0.26 + dx, 0.945, 0.44]}>
          <boxGeometry args={[0.018, 0.07, 0.055]} />
          <meshStandardMaterial color={ENGINE_COLOR} roughness={0.45} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0.26, 0.955, 0.44]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.014, 0.22, 10]} />
        <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.35} metalness={0.75} />
      </mesh>
      <mesh position={[0.26, 0.955, 0.44]}>
        <boxGeometry args={[0.19, 0.17, 0.22]} />
        <meshStandardMaterial color="#3a3f45" roughness={0.42} metalness={0.55} />
      </mesh>
      <mesh position={[0.26, 0.955, 0.325]}>
        <boxGeometry args={[0.15, 0.13, 0.02]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.5} metalness={0.55} />
      </mesh>
      {/* Lens barrel, aperture and hood */}
      <mesh position={[0.26, 0.955, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.050, 0.10, 16]} />
        <meshStandardMaterial color={NOZZLE_COLOR} roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0.26, 0.955, 0.612]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.040, 0.040, 0.010, 16]} />
        <meshStandardMaterial color="#0b0d10" roughness={0.08} metalness={0.9} />
      </mesh>
      <mesh position={[0.26, 0.955, 0.635]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.072, 0.078, 0.065, 16, 1, true]} />
        <meshStandardMaterial
          color={DARK_COLOR}
          roughness={0.5}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Steerable scan mirror in front of the lens, with its elevation drive */}
      <group position={[0.26, 0.905, 0.615]} rotation={[-0.7, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.175, 0.016, 0.145]} />
          <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.45} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.011, 0]}>
          <boxGeometry args={[0.160, 0.006, 0.130]} />
          <meshStandardMaterial color="#cfd6dd" roughness={0.06} metalness={1} />
        </mesh>
      </group>
      <mesh position={[0.26, 0.878, 0.615]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.19, 10]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.65} />
      </mesh>
      <mesh position={[0.345, 0.90, 0.615]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.026, 0.055, 10]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.45} metalness={0.6} />
      </mesh>
      <Strut a={[0.26, 0.955, 0.34]} b={[0.10, 0.66, 0.40]} radius={0.007} color={DARK_COLOR} />

      {/* ---------- Vernier propellant tanks on the outriggers ---------- */}
      {TANK_ANGLES.map((angle) => {
        const c = polar(angle, 0.72, 0.46);
        const cRad = rad(angle);
        return (
          <group key={`tank-${angle}`}>
            <mesh position={c}>
              <sphereGeometry args={[0.125, 20, 16]} />
              <meshStandardMaterial color={TANK_COLOR} roughness={0.3} metalness={0.55} />
            </mesh>
            {/* Girth band and meridian weld straps */}
            <mesh position={c} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.127, 0.008, 6, 24]} />
              <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.6} />
            </mesh>
            <mesh position={c} rotation={[0, cRad, 0]}>
              <torusGeometry args={[0.127, 0.005, 6, 24]} />
              <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.6} />
            </mesh>
            {/* Fill / vent bosses and the pressurant valve */}
            <mesh position={[c[0], c[1] + 0.125, c[2]]}>
              <cylinderGeometry args={[0.022, 0.026, 0.028, 10]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.4} metalness={0.65} />
            </mesh>
            <mesh position={[c[0], c[1] - 0.125, c[2]]}>
              <cylinderGeometry args={[0.020, 0.020, 0.026, 8]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.4} metalness={0.65} />
            </mesh>
            <mesh position={[c[0], c[1] + 0.150, c[2]]} rotation={[0, cRad, 0]}>
              <boxGeometry args={[0.045, 0.040, 0.045]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
            </mesh>
            {/* Cradle brackets back to the top and middle frame rings */}
            <Strut
              a={polar(angle, 0.60, 0.53)}
              b={[c[0], c[1] + 0.075, c[2]]}
              radius={0.011}
              color={FRAME_COLOR}
            />
            <Strut
              a={polar(angle, 0.60, 0.40)}
              b={[c[0] * 0.86, c[1], c[2] * 0.86]}
              radius={0.011}
              color={FRAME_COLOR}
            />
            <mesh
              position={[c[0] * 0.84, c[1], c[2] * 0.84]}
              rotation={[0, cRad, 0]}
            >
              <boxGeometry args={[0.09, 0.085, 0.024]} />
              <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.45} metalness={0.62} />
            </mesh>
            {/* Feed line down to the vernier manifold */}
            <Strut
              a={[c[0], c[1] - 0.12, c[2]]}
              b={polar(angle, 0.46, 0.06)}
              radius={0.008}
              color="#6a7076"
            />
            <mesh position={polar(angle, 0.46, 0.06)}>
              <boxGeometry args={[0.055, 0.05, 0.055]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
            </mesh>
            <Strut
              a={polar(angle, 0.46, 0.04)}
              b={polar(angle > 180 ? 300 : 60, 0.42, 0.0)}
              radius={0.006}
              color={DARK_COLOR}
            />
          </group>
        );
      })}
      {/* Helium pressurant spheres, regulator and lines on the aft face */}
      {[-0.075, 0.075].map((dx, i) => (
        <mesh key={`helium-${i}`} position={[dx, 0.315, -0.72]}>
          <sphereGeometry args={[0.055, 16, 12]} />
          <meshStandardMaterial color="#c2c7cc" roughness={0.32} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.315, -0.665]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.030, 0.030, 0.055, 10]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
      </mesh>
      <mesh position={[0, 0.24, -0.72]}>
        <boxGeometry args={[0.26, 0.020, 0.11]} />
        <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.5} metalness={0.55} />
      </mesh>
      <Strut a={[-0.075, 0.315, -0.655]} b={[-0.34, 0.30, -0.50]} radius={0.007} color={FRAME_COLOR} />
      <Strut a={[0.075, 0.315, -0.655]} b={[0.34, 0.30, -0.50]} radius={0.007} color={FRAME_COLOR} />
      <mesh position={[-0.36, 0.30, -0.50]}>
        <cylinderGeometry args={[0.031, 0.031, 0.075, 10]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
      </mesh>
      <mesh position={[0.36, 0.30, -0.50]}>
        <cylinderGeometry args={[0.031, 0.031, 0.075, 10]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
      </mesh>
      <Strut a={[-0.42, 0.30, -0.62]} b={[-0.60, 0.315, -0.48]} radius={0.006} color={DARK_COLOR} />
      <Strut a={[0.42, 0.30, -0.62]} b={[0.60, 0.315, -0.48]} radius={0.006} color={DARK_COLOR} />

      {/* ---------- Solid-propellant main retro motor and nozzle ---------- */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.195, 0.195, 0.30, 22]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.5} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.115, 0]}>
        <cylinderGeometry args={[0.160, 0.196, 0.05, 22]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.62} />
      </mesh>
      <mesh position={[0, 0.100, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.198, 0.010, 7, 26]} />
        <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.4} metalness={0.65} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.200, 0.200, 0.016, 22]} />
        <meshStandardMaterial color="#4a4f55" roughness={0.45} metalness={0.6} />
      </mesh>
      {/* Separation clamp and bolts at the forward skirt */}
      {[0, 90, 180, 270].map((a) => {
        const p = polar(a, 0.200, 0.10);
        return (
          <mesh key={`sep-bolt-${a}`} position={p} rotation={[0, rad(a), 0]}>
            <boxGeometry args={[0.035, 0.030, 0.020]} />
            <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.4} metalness={0.7} />
          </mesh>
        );
      })}
      {/* Aft closure and nozzle throat */}
      <mesh position={[0, -0.225, 0]}>
        <cylinderGeometry args={[0.205, 0.220, 0.060, 22]} />
        <meshStandardMaterial color={NOZZLE_COLOR} roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.260, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.098, 0.014, 8, 24]} />
        <meshStandardMaterial color={NOZZLE_COLOR} roughness={0.45} metalness={0.55} />
      </mesh>
      {/* Two-stage bell: throat section then exit cone */}
      <mesh position={[0, -0.310, 0]}>
        <cylinderGeometry args={[0.098, 0.190, 0.100, 24, 1, true]} />
        <meshStandardMaterial
          color={NOZZLE_COLOR}
          roughness={0.55}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.460, 0]}>
        <cylinderGeometry args={[0.190, 0.275, 0.200, 28, 1, true]} />
        <meshStandardMaterial
          color={NOZZLE_DARK_COLOR}
          roughness={0.55}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {[
        [0.214, -0.400],
        [0.245, -0.480],
        [0.268, -0.550],
      ].map(([r, y], i) => (
        <mesh key={`nozzle-ring-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.008, 6, 28]} />
          <meshStandardMaterial color={NOZZLE_COLOR} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, -0.563, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.272, 0.012, 8, 30]} />
        <meshStandardMaterial color={NOZZLE_COLOR} roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Motor mount struts to the lower structure and an actuator conduit down the bell */}
      {[0, 1, 2, 3].map((i) => (
        <Strut
          key={`motor-mount-${i}`}
          a={polar(i * 90 + 45, 0.30, -0.02)}
          b={polar(i * 90 + 45, 0.185, -0.10)}
          radius={0.014}
          color={FRAME_COLOR}
        />
      ))}
      <Strut a={[0.205, -0.19, 0.10]} b={[0.268, -0.50, 0.12]} radius={0.011} color={DARK_COLOR} />
      <Strut a={[0.205, -0.19, -0.10]} b={[0.268, -0.50, -0.12]} radius={0.009} color={DARK_COLOR} />

      {/* ---------- Three throttleable vernier engines ---------- */}
      {VERNIER_ANGLES.map((angle) => {
        const p = polar(angle, 0.40, 0.0);
        const cRad = rad(angle);
        return (
          <group key={`vernier-${angle}`} position={p} rotation={[0, cRad, 0]}>
            {/* Thrust frame and gimbal block */}
            <mesh position={[0, 0.105, 0]}>
              <boxGeometry args={[0.11, 0.050, 0.10]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.45} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.068, 0]}>
              <boxGeometry args={[0.085, 0.040, 0.075]} />
              <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.42} metalness={0.65} />
            </mesh>
            {/* Gimbal actuator and its push rod */}
            <mesh position={[0.065, 0.075, 0.02]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.013, 0.013, 0.070, 8]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.4} metalness={0.65} />
            </mesh>
            <Strut a={[0.095, 0.075, 0.02]} b={[0.035, 0.040, 0.02]} radius={0.007} color={ANTENNA_COLOR} />
            {/* Heat shield above the chamber */}
            <mesh position={[0, 0.040, 0]}>
              <cylinderGeometry args={[0.070, 0.062, 0.012, 14]} />
              <meshStandardMaterial color="#4a4f55" roughness={0.45} metalness={0.6} />
            </mesh>
            {/* Injector head, chamber and valve block */}
            <mesh position={[0, 0.020, 0]}>
              <cylinderGeometry args={[0.050, 0.044, 0.026, 12]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
            </mesh>
            <mesh position={[0, -0.005, 0]}>
              <sphereGeometry args={[0.044, 14, 12]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.42} metalness={0.62} />
            </mesh>
            <mesh position={[0, 0.025, -0.055]}>
              <boxGeometry args={[0.050, 0.042, 0.045]} />
              <meshStandardMaterial color={ENGINE_COLOR} roughness={0.4} metalness={0.65} />
            </mesh>
            {/* Nozzle and exit lip */}
            <mesh position={[0, -0.078, 0]}>
              <cylinderGeometry args={[0.026, 0.068, 0.108, 16, 1, true]} />
              <meshStandardMaterial
                color={NOZZLE_COLOR}
                roughness={0.5}
                metalness={0.55}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, -0.133, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.066, 0.006, 6, 18]} />
              <meshStandardMaterial color={NOZZLE_COLOR} roughness={0.48} metalness={0.58} />
            </mesh>
            {/* Coolant jacket ribs on the chamber/nozzle joint */}
            {[-0.030, -0.046].map((y, i) => (
              <mesh key={`vj-rib-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.050, 0.004, 5, 14]} />
                <meshStandardMaterial color={NOZZLE_COLOR} roughness={0.45} metalness={0.6} />
              </mesh>
            ))}
            {/* Thrust mount back to the bus underside */}
            <Strut a={[0, 0.13, 0]} b={[0, 0.20, 0]} radius={0.014} color={FRAME_COLOR} />
          </group>
        );
      })}
      {/* Vernier thrust ring under the bus */}
      <mesh position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.40, 0.012, 6, 30]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.62} />
      </mesh>

      {/* ---------- Radar altimeter / doppler horns on the underside ---------- */}
      {[0, 120, 240].map((angle) => {
        const p = polar(angle, 0.34, 0.015);
        return (
          <group key={`radar-${angle}`} position={p} rotation={[0, rad(angle), 0]}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.060, 0.065, 14, 1, true]} />
              <meshStandardMaterial
                color={ANTENNA_COLOR}
                roughness={0.4}
                metalness={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, -0.034, 0]}>
              <cylinderGeometry args={[0.058, 0.058, 0.006, 14]} />
              <meshStandardMaterial color={DARK_COLOR} roughness={0.25} metalness={0.7} />
            </mesh>
            <Strut a={[0, 0.03, 0]} b={[0, 0.075, 0]} radius={0.012} color={FRAME_DARK_COLOR} />
          </group>
        );
      })}

      {/* ---------- Three landing legs: A-frame, shock strut, footpad, crush pad ---------- */}
      {LEG_ANGLES.map((angle) => {
        const aRad = rad(angle);
        const attach = polar(angle, 0.585, 0.14);
        const ankle = polar(angle, 0.95, -0.80);
        const sleeveEnd = lerp(attach, ankle, 0.30);
        const knee = lerp(attach, ankle, 0.55);
        const tangent: Vec3 = [Math.cos(aRad), 0, -Math.sin(aRad)];
        const padCenter: Vec3 = [ankle[0], -0.875, ankle[2]];
        const crushCenter: Vec3 = [ankle[0], -0.937, ankle[2]];
        const hingeRotation: Vec3 = [0, aRad, Math.PI / 2];
        return (
          <group key={`leg-${angle}`}>
            {/* A-frame side struts from the upper frame down to the knee */}
            <Strut a={polar(angle - 22, 0.60, 0.36)} b={knee} radius={0.022} color={FRAME_COLOR} />
            <Strut a={polar(angle + 22, 0.60, 0.36)} b={knee} radius={0.022} color={FRAME_COLOR} />
            <Strut
              a={polar(angle - 22, 0.60, 0.365)}
              b={polar(angle + 22, 0.60, 0.365)}
              radius={0.010}
              color={FRAME_COLOR}
            />
            {/* Drag strut from the lower frame ring to the shock sleeve */}
            <Strut
              a={polar(angle, 0.56, 0.015)}
              b={lerp(attach, ankle, 0.40)}
              radius={0.013}
              color={FRAME_COLOR}
            />
            {/* Outer shock-absorber sleeve */}
            <Strut a={attach} b={sleeveEnd} radius={0.052} color={FRAME_COLOR} />
            {/* Honeycomb crush cartridge inside the sleeve */}
            <Strut a={lerp(attach, ankle, 0.05)} b={lerp(attach, ankle, 0.22)} radius={0.064} color={CRUSH_COLOR} />
            <Strut
              a={lerp(attach, ankle, 0.05)}
              b={lerp(attach, ankle, 0.065)}
              radius={0.068}
              color={CRUSH_DARK_COLOR}
            />
            <Strut
              a={lerp(attach, ankle, 0.205)}
              b={lerp(attach, ankle, 0.22)}
              radius={0.068}
              color={CRUSH_DARK_COLOR}
            />
            {/* Sleeve end collar and telescoping piston down to the ankle */}
            <Strut a={lerp(attach, ankle, 0.28)} b={lerp(attach, ankle, 0.31)} radius={0.058} color={FRAME_DARK_COLOR} />
            <Strut a={sleeveEnd} b={ankle} radius={0.028} color="#a4a9ae" />
            {[0.55, 0.72].map((t, i) => (
              <Strut
                key={`piston-guide-${i}`}
                a={lerp(attach, ankle, t)}
                b={lerp(attach, ankle, t + 0.02)}
                radius={0.034}
                color={FRAME_DARK_COLOR}
              />
            ))}
            {/* Deploy hinge at the frame attachment, knee joint and ankle hinge */}
            <mesh position={attach}>
              <sphereGeometry args={[0.048, 12, 10]} />
              <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.62} />
            </mesh>
            <mesh position={[attach[0], attach[1] + 0.035, attach[2]]} rotation={[0, aRad, 0]}>
              <boxGeometry args={[0.09, 0.07, 0.024]} />
              <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.45} metalness={0.62} />
            </mesh>
            <mesh position={knee}>
              <sphereGeometry args={[0.045, 12, 10]} />
              <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.62} />
            </mesh>
            <mesh position={ankle} rotation={hingeRotation}>
              <cylinderGeometry args={[0.034, 0.034, 0.130, 10]} />
              <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.62} />
            </mesh>
            {[-0.065, 0.065].map((d, i) => (
              <mesh
                key={`hinge-cap-${i}`}
                position={offset(ankle, [tangent[0] * d, 0, tangent[2] * d])}
                rotation={hingeRotation}
              >
                <cylinderGeometry args={[0.026, 0.026, 0.012, 8]} />
                <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.4} metalness={0.65} />
              </mesh>
            ))}
            {/* Short axle to the footpad gimbal bearing */}
            <Strut a={ankle} b={[padCenter[0], -0.845, padCenter[2]]} radius={0.020} color={FRAME_COLOR} />
            <mesh position={[padCenter[0], -0.845, padCenter[2]]}>
              <sphereGeometry args={[0.042, 12, 10]} />
              <meshStandardMaterial color={FRAME_COLOR} roughness={0.45} metalness={0.62} />
            </mesh>
            {/* Footpad: hub, dish, rim and radial gussets */}
            <mesh position={padCenter}>
              <cylinderGeometry args={[0.170, 0.160, 0.050, 20]} />
              <meshStandardMaterial color="#b9bec3" roughness={0.42} metalness={0.7} />
            </mesh>
            <mesh position={[padCenter[0], padCenter[1] + 0.030, padCenter[2]]}>
              <cylinderGeometry args={[0.045, 0.050, 0.022, 12]} />
              <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.42} metalness={0.65} />
            </mesh>
            <mesh position={[padCenter[0], padCenter[1] + 0.022, padCenter[2]]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.167, 0.010, 6, 24]} />
              <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.6} />
            </mesh>
            {[0, 60, 120, 180, 240, 300].map((rib) => {
              const t = rad(rib);
              return (
                <mesh
                  key={`pad-gusset-${rib}`}
                  position={[
                    padCenter[0] + Math.sin(t) * 0.135,
                    padCenter[1] + 0.031,
                    padCenter[2] + Math.cos(t) * 0.135,
                  ]}
                  rotation={[0, t, 0]}
                >
                  <boxGeometry args={[0.012, 0.022, 0.060]} />
                  <meshStandardMaterial color={FRAME_COLOR} roughness={0.48} metalness={0.6} />
                </mesh>
              );
            })}
            {/* Crushable honeycomb pad under the footpad */}
            <mesh position={crushCenter}>
              <cylinderGeometry args={[0.125, 0.112, 0.075, 18]} />
              <meshStandardMaterial color={CRUSH_COLOR} roughness={0.88} metalness={0.14} />
            </mesh>
            <mesh position={[crushCenter[0], crushCenter[1] + 0.040, crushCenter[2]]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.122, 0.008, 6, 20]} />
              <meshStandardMaterial color={CRUSH_DARK_COLOR} roughness={0.82} metalness={0.2} />
            </mesh>
            <mesh position={[crushCenter[0], crushCenter[1] - 0.038, crushCenter[2]]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.112, 0.006, 6, 20]} />
              <meshStandardMaterial color={CRUSH_DARK_COLOR} roughness={0.82} metalness={0.2} />
            </mesh>
            {[0, 60, 120, 180, 240, 300].map((rib) => {
              const t = rad(rib);
              return (
                <mesh
                  key={`pad-rib-${rib}`}
                  position={[
                    crushCenter[0] + Math.sin(t) * 0.118,
                    crushCenter[1],
                    crushCenter[2] + Math.cos(t) * 0.118,
                  ]}
                  rotation={[0, t, 0]}
                >
                  <boxGeometry args={[0.012, 0.070, 0.020]} />
                  <meshStandardMaterial color={CRUSH_DARK_COLOR} roughness={0.9} metalness={0.12} />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* ---------- Micrometeoroid detector plates on the frame corners ---------- */}
      {SENSOR_ANGLES.map((angle) => (
        <group
          key={`mm-${angle}`}
          position={polar(angle, 0.605, 0.30)}
          rotation={[0, rad(angle), 0]}
        >
          <mesh>
            <boxGeometry args={[0.10, 0.13, 0.018]} />
            <meshStandardMaterial color={FRAME_DARK_COLOR} roughness={0.5} metalness={0.55} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.075, 0.105, 0.006]} />
            <meshStandardMaterial color="#1b1e22" roughness={0.35} metalness={0.4} />
          </mesh>
          <Strut a={[0, 0.065, -0.01]} b={[0, 0.10, -0.05]} radius={0.006} color={DARK_COLOR} />
        </group>
      ))}

      {/* ---------- Low-gain omnidirectional antennas on the frame corners ---------- */}
      <Strut a={[-0.52, 0.60, -0.44]} b={[-0.84, 1.06, -0.66]} radius={0.009} color={ANTENNA_COLOR} />
      <mesh position={[-0.52, 0.60, -0.44]}>
        <cylinderGeometry args={[0.024, 0.030, 0.045, 10]} />
        <meshStandardMaterial color={DARK_COLOR} roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[-0.79, 1.01, -0.63]}>
        <cylinderGeometry args={[0.020, 0.026, 0.050, 10]} />
        <meshStandardMaterial color="#c9ced3" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[-0.84, 1.06, -0.66]}>
        <sphereGeometry args={[0.022, 10, 8]} />
        <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.35} metalness={0.7} />
      </mesh>
      <Strut a={[0.54, 0.60, 0.42]} b={[0.86, 1.02, 0.62]} radius={0.009} color={ANTENNA_COLOR} />
      <mesh position={[0.54, 0.60, 0.42]}>
        <cylinderGeometry args={[0.024, 0.030, 0.045, 10]} />
        <meshStandardMaterial color={DARK_COLOR} roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[0.81, 0.97, 0.59]}>
        <cylinderGeometry args={[0.020, 0.026, 0.050, 10]} />
        <meshStandardMaterial color="#c9ced3" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0.86, 1.02, 0.62]}>
        <sphereGeometry args={[0.022, 10, 8]} />
        <meshStandardMaterial color={ANTENNA_COLOR} roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Wireframe accent sphere */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
