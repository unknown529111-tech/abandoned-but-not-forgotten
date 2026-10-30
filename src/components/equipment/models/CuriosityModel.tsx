// src/components/equipment/models/CuriosityModel.tsx
// Procedural 3D model of Curiosity (MSL) rover — Mars Science Laboratory, landed 2012.
// Primitives only: WAR body under gold MLI blankets, rocker-bogie suspension on six
// grousered aluminium wheels, remote sensing mast (ChemCam, Mastcam-100/34, Navcams),
// HGA / LGA / UHF links, MMRTG power source, 5-DOF arm with instrument turret
// (drill + stabilisers, APXS, MAHLI, DRT, CHIMRA) and the SAM / CheMin inlets.
// +X is forward, +Y up, +Z is the rover's left side.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Vec3 = [number, number, number];

const BODY = '#e6e6df'; // white painted WAR panels
const BLANKET = '#c9a24a'; // gold Kapton MLI thermal blanket
const DECK = '#d3d3ca';
const METAL = '#9ba0a3'; // aluminium structure, arm links
const DARK = '#2b2b2e';
const GLASS = '#12232b';
const WHEEL = '#8e8d87'; // dusty aluminium wheel
const ACCENT = '#42BFFF';

// Vehicle geometry (half-scale metres).
const R = 0.25; // wheel radius
const W = 0.16; // wheel width
const TRACK = 0.72; // wheel centre offset in Z
const RAIL = 0.58; // rocker-bogie plane, inboard of the wheels
const FRONT_X = 0.88;
const MID_X = 0.1;
const REAR_X = -0.74;

/** Cylinder stretched between two points — used for every structural link. */
function Strut({
  from,
  to,
  radius = 0.022,
  color = METAL,
}: {
  from: Vec3;
  to: Vec3;
  radius?: number;
  color?: string;
}) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const dir = b.clone().sub(a);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  return (
    <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, dir.length(), 8]} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.7} />
    </mesh>
  );
}

const GROUSERS = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);
const SPOKES = [0.5, 1.5, 2.5];

/** Curiosity wheel: thin aluminium drum, chevron grousers, spoked faces, dark hub. */
function Wheel({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[R, R, W, 24]} />
        <meshStandardMaterial color={WHEEL} roughness={0.8} metalness={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, W + 0.03, 12]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      {/* grousers — the cleats that give traction in sand */}
      {GROUSERS.map((a, i) => (
        <mesh
          key={`g${i}`}
          position={[Math.cos(a) * (R + 0.01), Math.sin(a) * (R + 0.01), 0]}
          rotation={[0, 0, a]}
        >
          <boxGeometry args={[0.03, 0.05, W * 0.94]} />
          <meshStandardMaterial color={WHEEL} roughness={0.8} metalness={0.25} />
        </mesh>
      ))}
      {/* spoke plates on both faces */}
      {SPOKES.map((k, i) =>
        [W / 2 - 0.012, -W / 2 + 0.012].map((z) => (
          <mesh key={`s${i}-${z}`} position={[0, 0, z]} rotation={[0, 0, k * Math.PI]}>
            <boxGeometry args={[R * 1.7, 0.024, 0.012]} />
            <meshStandardMaterial color={WHEEL} roughness={0.8} metalness={0.25} />
          </mesh>
        ))
      )}
    </group>
  );
}

export default function CuriosityModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef} scale={0.45}>
      {/* ---------------------------------------------------------------- */}
      {/* Warm Electronics Box — the structural body under the blankets    */}
      {/* ---------------------------------------------------------------- */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.5, 0.55, 1.05]} />
        <meshStandardMaterial color={BODY} roughness={0.6} metalness={0.25} />
      </mesh>
      {/* MLI blanket skirt under the body */}
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[1.42, 0.1, 1.0]} />
        <meshStandardMaterial color={BLANKET} roughness={0.45} metalness={0.65} />
      </mesh>
      {/* gold thermal blankets on both flanks */}
      {[1, -1].map((s) => (
        <mesh key={`blanket${s}`} position={[0, 0.62, s * 0.53]}>
          <boxGeometry args={[1.44, 0.44, 0.02]} />
          <meshStandardMaterial color={BLANKET} roughness={0.45} metalness={0.65} />
        </mesh>
      ))}
      {/* front MLI, with the arm shoulder cutting through it */}
      <mesh position={[0.755, 0.6, 0]}>
        <boxGeometry args={[0.02, 0.44, 0.96]} />
        <meshStandardMaterial color={BLANKET} roughness={0.45} metalness={0.65} />
      </mesh>
      {/* rear panel + radiator louvres */}
      <mesh position={[-0.755, 0.62, 0]}>
        <boxGeometry args={[0.02, 0.46, 0.96]} />
        <meshStandardMaterial color={DECK} roughness={0.55} metalness={0.3} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`louvre${i}`} position={[-0.772, 0.48 + i * 0.08, 0]}>
          <boxGeometry args={[0.012, 0.025, 0.7]} />
          <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.5} />
        </mesh>
      ))}
      {/* corner brackets tying the blankets down */}
      {[1, -1].map((sx) =>
        [1, -1].map((sz) => (
          <mesh key={`brk${sx}-${sz}`} position={[sx * 0.72, 0.42, sz * 0.5]}>
            <boxGeometry args={[0.06, 0.08, 0.05]} />
            <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.7} />
          </mesh>
        ))
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Top deck                                                          */}
      {/* ---------------------------------------------------------------- */}
      <mesh position={[0, 0.915, 0]}>
        <boxGeometry args={[1.48, 0.06, 1.02]} />
        <meshStandardMaterial color={DECK} roughness={0.6} metalness={0.3} />
      </mesh>
      {/* deck edge rails */}
      {[1, -1].map((s) => (
        <mesh key={`rail${s}`} position={[0, 0.955, s * 0.49]}>
          <boxGeometry args={[1.44, 0.03, 0.04]} />
          <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.75} />
        </mesh>
      ))}
      {/* avionics / power distribution boxes */}
      <mesh position={[-0.62, 0.99, 0.06]}>
        <boxGeometry args={[0.24, 0.1, 0.44]} />
        <meshStandardMaterial color={DARK} roughness={0.55} metalness={0.5} />
      </mesh>
      <mesh position={[0.32, 0.985, 0.42]}>
        <boxGeometry args={[0.2, 0.08, 0.16]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* ---------------------------------------------------------------- */}
      {/* Sample analysis: SAM and CheMin, both fed from the deck           */}
      {/* ---------------------------------------------------------------- */}
      {/* SAM enclosure occupying the rear of the deck */}
      <mesh position={[-0.25, 1.02, -0.06]}>
        <boxGeometry args={[0.42, 0.2, 0.5]} />
        <meshStandardMaterial color={DECK} roughness={0.55} metalness={0.3} />
      </mesh>
      <mesh position={[-0.25, 1.125, -0.06]}>
        <boxGeometry args={[0.38, 0.02, 0.46]} />
        <meshStandardMaterial color={BLANKET} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* SAM inlet funnel — the arm dumps sieved sample here */}
      <mesh position={[0.02, 0.995, 0.16]}>
        <cylinderGeometry args={[0.062, 0.092, 0.1, 12]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.02, 0.985, 0.16]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 12]} />
        <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.4} />
      </mesh>
      {/* CheMin inlet port with its cover swung open */}
      <mesh position={[0.26, 0.955, -0.2]}>
        <cylinderGeometry args={[0.062, 0.062, 0.05, 14]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
      </mesh>
      <mesh position={[0.325, 1.0, -0.2]} rotation={[0, 0, -0.7]}>
        <boxGeometry args={[0.13, 0.014, 0.13]} />
        <meshStandardMaterial color={DECK} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* ---------------------------------------------------------------- */}
      {/* Antennas and descent camera                                       */}
      {/* ---------------------------------------------------------------- */}
      {/* High-gain antenna: hexagonal array on a two-axis gimbal */}
      <group position={[-0.44, 0.95, -0.3]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.048, 0.06, 0.12, 10]} />
          <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <boxGeometry args={[0.07, 0.12, 0.11]} />
          <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.55} />
        </mesh>
        <group position={[0, 0.3, 0]} rotation={[0, Math.PI / 6, -0.45]}>
          <mesh>
            <cylinderGeometry args={[0.23, 0.23, 0.026, 6]} />
            <meshStandardMaterial color="#b9b0a0" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.035, 0]}>
            <boxGeometry args={[0.28, 0.05, 0.28]} />
            <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.65} />
          </mesh>
          {/* feed horn */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.04, 0.03, 0.06, 10]} />
            <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
          </mesh>
        </group>
      </group>
      {/* Low-gain whip antenna */}
      <mesh position={[-0.63, 0.98, -0.42]}>
        <cylinderGeometry args={[0.032, 0.04, 0.08, 10]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[-0.665, 1.28, -0.44]} rotation={[0.12, 0, 0.1]}>
        <cylinderGeometry args={[0.008, 0.011, 0.56, 6]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[-0.7, 1.55, -0.47]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.8} />
      </mesh>
      {/* UHF relay patch on the deck */}
      <mesh position={[-0.56, 0.952, 0.3]}>
        <boxGeometry args={[0.24, 0.02, 0.18]} />
        <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.4} />
      </mesh>
      {/* MARDI — downward-looking descent camera under the nose */}
      <mesh position={[0.6, 0.31, 0]}>
        <cylinderGeometry args={[0.062, 0.062, 0.09, 12]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0.6, 0.26, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.01, 12]} />
        <meshStandardMaterial color={GLASS} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* ---------------------------------------------------------------- */}
      {/* Remote Sensing Mast                                               */}
      {/* ---------------------------------------------------------------- */}
      <mesh position={[0.44, 0.99, -0.26]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.65} />
      </mesh>
      <mesh position={[0.44, 1.33, -0.26]}>
        <cylinderGeometry args={[0.045, 0.05, 0.58, 10]} />
        <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.7} />
      </mesh>
      <mesh position={[0.44, 1.58, -0.26]}>
        <cylinderGeometry args={[0.065, 0.065, 0.07, 12]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      {/* masthead — the actuated head carrying most of the cameras */}
      <mesh position={[0.46, 1.7, -0.26]}>
        <boxGeometry args={[0.24, 0.22, 0.34]} />
        <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh position={[0.585, 1.7, -0.26]}>
        <boxGeometry args={[0.02, 0.2, 0.32]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
      </mesh>

      {/* Mastcam-100 (right) and Mastcam-34 (left) stereo science cameras */}
      {[
        { z: -0.36, len: 0.12 },
        { z: -0.16, len: 0.09 },
      ].map(({ z, len }) => (
        <group key={`mastcam${z}`} position={[0.6, 1.66, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, len, 12]} />
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.65} />
          </mesh>
          <mesh position={[len / 2 + 0.004, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.034, 0.034, 0.012, 14]} />
            <meshStandardMaterial color={GLASS} roughness={0.08} metalness={0.95} />
          </mesh>
          <mesh position={[0.02, -0.055, 0]}>
            <boxGeometry args={[0.05, 0.04, 0.05]} />
            <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Navcams — one forward stereo pair high on the head */}
      {[-0.34, -0.18].map((z) => (
        <group key={`navcam${z}`} position={[0.62, 1.83, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.026, 0.026, 0.08, 10]} />
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.65} />
          </mesh>
          <mesh position={[0.042, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.012, 12]} />
            <meshStandardMaterial color={GLASS} roughness={0.08} metalness={0.95} />
          </mesh>
          <Strut from={[0.62, 1.81, z]} to={[0.62, 1.85, z]} radius={0.012} color={METAL} />
        </group>
      ))}
      {/* Navcams — second pair aimed down at the deck for arm work */}
      {[-0.36, -0.16].map((z) => (
        <group key={`navcamd${z}`} position={[0.52, 1.55, z]}>
          <mesh>
            <cylinderGeometry args={[0.026, 0.026, 0.09, 10]} />
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.65} />
          </mesh>
          <mesh position={[0, -0.048, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.012, 12]} />
            <meshStandardMaterial color={GLASS} roughness={0.08} metalness={0.95} />
          </mesh>
          <Strut from={[0.52, 1.6, z]} to={[0.5, 1.81, z]} radius={0.012} color={METAL} />
        </group>
      ))}

      {/* ChemCam — laser telescope on top of the masthead */}
      <mesh position={[0.5, 1.87, -0.26]}>
        <boxGeometry args={[0.14, 0.1, 0.16]} />
        <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh position={[0.63, 1.87, -0.26]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.048, 0.048, 0.26, 14]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
      </mesh>
      <mesh position={[0.762, 1.87, -0.26]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.048, 0.009, 8, 16]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0.746, 1.87, -0.26]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.008, 14]} />
        <meshStandardMaterial color={GLASS} roughness={0.06} metalness={0.95} />
      </mesh>
      {/* laser aperture alongside the telescope */}
      <mesh position={[0.75, 1.8, -0.26]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
        <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* ---------------------------------------------------------------- */}
      {/* Robotic arm — stowed, 5 DOF, turret at the front                  */}
      {/* ---------------------------------------------------------------- */}
      <mesh position={[0.62, 0.5, 0.3]}>
        <boxGeometry args={[0.1, 0.16, 0.12]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0.62, 0.42, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
      </mesh>
      <mesh position={[0.63, 0.36, 0.3]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
      </mesh>
      {/* upper arm (proximal link) — a twin-bar structure */}
      <Strut from={[0.63, 0.38, 0.3]} to={[0.94, 0.32, 0.38]} radius={0.026} />
      <Strut from={[0.63, 0.32, 0.3]} to={[0.94, 0.26, 0.38]} radius={0.026} />
      <mesh position={[0.785, 0.32, 0.34]} rotation={[0, 0.5, -0.09]}>
        <boxGeometry args={[0.24, 0.1, 0.05]} />
        <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.7} />
      </mesh>
      {/* elbow */}
      <mesh position={[0.94, 0.29, 0.38]}>
        <sphereGeometry args={[0.058, 12, 12]} />
        <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.7} />
      </mesh>
      <mesh position={[0.94, 0.29, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.03, 12]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
      </mesh>
      {/* forearm */}
      <Strut from={[0.94, 0.28, 0.38]} to={[1.16, 0.22, 0.34]} radius={0.028} />
      {/* wrist */}
      <mesh position={[1.16, 0.22, 0.34]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.7} />
      </mesh>
      {[0.4, 0.29].map((z, i) => (
        <mesh key={`wr${i}`} position={[1.16, 0.22, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.024, 12]} />
          <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
        </mesh>
      ))}

      {/* Instrument turret — rotates to bring each tool to the rock */}
      <group position={[1.24, 0.26, 0.34]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.125, 0.125, 0.24, 18]} />
          <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.28, 12]} />
          <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.65} />
        </mesh>
        {/* CHIMRA — sample handling / sieving drum on the turret top */}
        <mesh position={[-0.04, 0.15, 0.02]}>
          <boxGeometry args={[0.12, 0.12, 0.2]} />
          <meshStandardMaterial color={BLANKET} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Drill: housing, bit, and the two stabiliser posts */}
        <mesh position={[0.08, 0.02, 0]}>
          <boxGeometry args={[0.12, 0.19, 0.15]} />
          <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0.13, -0.13, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.16, 10]} />
          <meshStandardMaterial color="#b0b4b6" roughness={0.35} metalness={0.85} />
        </mesh>
        <mesh position={[0.13, -0.225, 0]}>
          <cylinderGeometry args={[0.012, 0.026, 0.05, 10]} />
          <meshStandardMaterial color="#c8cdd0" roughness={0.3} metalness={0.9} />
        </mesh>
        <Strut from={[0.12, -0.05, -0.09]} to={[0.16, -0.3, -0.13]} radius={0.011} color={METAL} />
        <Strut from={[0.12, -0.05, 0.09]} to={[0.16, -0.3, 0.13]} radius={0.011} color={METAL} />
        {/* MAHLI — hand-lens imager with dust cover */}
        <mesh position={[0.09, 0.12, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.08, 12]} />
          <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.65} />
        </mesh>
        <mesh position={[0.135, 0.12, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.034, 0.034, 0.012, 14]} />
          <meshStandardMaterial color={GLASS} roughness={0.08} metalness={0.95} />
        </mesh>
        {/* APXS — alpha particle X-ray spectrometer head */}
        <mesh position={[0.09, 0.12, -0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.07, 12]} />
          <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
        </mesh>
        <mesh position={[0.128, 0.12, -0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 12]} />
          <meshStandardMaterial color={GLASS} roughness={0.2} metalness={0.85} />
        </mesh>
        {/* DRT — dust removal tool (abrasive brush) */}
        <mesh position={[-0.02, -0.12, 0.12]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[-0.02, -0.17, 0.12]}>
          <cylinderGeometry args={[0.03, 0.03, 0.03, 10]} />
          <meshStandardMaterial color="#8a8f92" roughness={0.9} metalness={0.2} />
        </mesh>
      </group>

      {/* ---------------------------------------------------------------- */}
      {/* MMRTG — multi-mission radioisotope thermoelectric generator       */}
      {/* ---------------------------------------------------------------- */}
      <Strut from={[-0.7, 0.78, 0.22]} to={[-0.93, 0.74, 0.06]} radius={0.03} />
      <Strut from={[-0.7, 0.78, -0.22]} to={[-0.93, 0.74, -0.06]} radius={0.03} />
      <Strut from={[-0.7, 0.5, 0]} to={[-0.93, 0.66, 0]} radius={0.03} />
      <group position={[-1.02, 0.74, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.17, 0.17, 0.4, 20]} />
          <meshStandardMaterial color="#3a3d40" roughness={0.55} metalness={0.6} />
        </mesh>
        {/* heat rejection fins */}
        {Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2).map((a, i) => (
          <mesh key={`fin${i}`} position={[0, 0.19 * Math.cos(a), 0.19 * Math.sin(a)]} rotation={[a, 0, 0]}>
            <boxGeometry args={[0.42, 0.1, 0.014]} />
            <meshStandardMaterial color="#4a4d50" roughness={0.6} metalness={0.5} />
          </mesh>
        ))}
        <mesh position={[-0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.12, 0.06, 16]} />
          <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 16]} />
          <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.7} />
        </mesh>
      </group>

      {/* ---------------------------------------------------------------- */}
      {/* Rocker-bogie suspension — differential bar across the deck        */}
      {/* ---------------------------------------------------------------- */}
      <Strut from={[0.3, 1.0, -RAIL]} to={[0.3, 1.0, RAIL]} radius={0.02} />
      <mesh position={[0.3, 1.0, 0]}>
        <sphereGeometry args={[0.048, 10, 10]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.65} />
      </mesh>
      {[1, -1].map((s) => (
        <group key={`sus${s}`}>
          {/* rocker pivot on the body */}
          <mesh position={[0.34, 0.56, s * RAIL]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
          </mesh>
          <Strut from={[0.34, 0.56, s * RAIL]} to={[0.3, 0.99, s * RAIL]} radius={0.018} />
          {/* rocker: forward arm to the front wheel, rear arm to the bogie pivot */}
          <Strut from={[0.34, 0.56, s * RAIL]} to={[FRONT_X, 0, s * RAIL]} radius={0.035} />
          <Strut from={[0.34, 0.56, s * RAIL]} to={[-0.32, 0.34, s * RAIL]} radius={0.032} />
          <mesh position={[-0.32, 0.34, s * RAIL]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.75} />
          </mesh>
          {/* bogie: seesaws between the middle and rear wheels */}
          <Strut from={[-0.32, 0.34, s * RAIL]} to={[MID_X, 0, s * RAIL]} radius={0.03} />
          <Strut from={[-0.32, 0.34, s * RAIL]} to={[REAR_X, 0, s * RAIL]} radius={0.03} />
          {/* outboard axle stubs to the wheel hubs */}
          {[FRONT_X, MID_X, REAR_X].map((x) => (
            <Strut key={`ax${x}`} from={[x, 0, s * RAIL]} to={[x, 0, s * TRACK]} radius={0.028} />
          ))}
        </group>
      ))}

      {/* six wheels: front, middle (bogie), rear */}
      {[1, -1].map((s) =>
        [FRONT_X, MID_X, REAR_X].map((x) => (
          <Wheel key={`w${s}-${x}`} position={[x, 0, s * TRACK]} />
        ))
      )}

      {/* Wireframe accent */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
