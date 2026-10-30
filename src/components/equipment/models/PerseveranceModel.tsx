// src/components/equipment/models/PerseveranceModel.tsx
// Procedural 3D model of Perseverance rover (Mars 2020) with Ingenuity helicopter.
// Axes: +x forward, +y up, +z left. Layout follows the real rover:
// rocker-bogie suspension, RTG aft, mast forward, arm on the front-left corner.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BODY = '#e6e6e2';
const FOIL = '#c9ab77';
const WHEEL = '#262626';
const METAL = '#8f9399';
const DARK = '#33373d';
const LENS = '#16222e';
const SOLAR = '#22364f';
const ACCENT = '#42BFFF';

const WHEEL_X = [-0.85, 0, 0.85];
const WHEEL_Z = 0.66;
const GROUSERS = 10;

// Tube between two points — saves hand-computing euler angles for the suspension.
function Strut({
  a,
  b,
  r = 0.03,
}: {
  a: [number, number, number];
  b: [number, number, number];
  r?: number;
}) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const dir = end.clone().sub(start);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[r, r, dir.length(), 8]} />
      <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.7} />
    </mesh>
  );
}

export default function PerseveranceModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const upperRotor = useRef<THREE.Group>(null);
  const lowerRotor = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
    if (upperRotor.current) upperRotor.current.rotation.y += delta * 6;
    if (lowerRotor.current) lowerRotor.current.rotation.y -= delta * 6;
  });

  return (
    <group ref={groupRef} scale={0.4}>
      {/* ── Chassis ─────────────────────────────────────────────── */}
      {/* Warm electronics box */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.34, 0.46, 1.0]} />
        <meshStandardMaterial color={BODY} roughness={0.55} metalness={0.35} />
      </mesh>
      {/* Lower deck / belly pan */}
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[1.2, 0.14, 0.9]} />
        <meshStandardMaterial color={DARK} roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Thermal blankets — top and side panels */}
      <mesh position={[0, 0.86, 0]}>
        <boxGeometry args={[1.3, 0.03, 0.96]} />
        <meshStandardMaterial color={FOIL} roughness={0.9} metalness={0.15} />
      </mesh>
      {[-0.51, 0.51].map((z, i) => (
        <mesh key={i} position={[0, 0.62, z]}>
          <boxGeometry args={[1.2, 0.4, 0.03]} />
          <meshStandardMaterial color={FOIL} roughness={0.9} metalness={0.15} />
        </mesh>
      ))}
      {/* Front and rear blanket panels */}
      <mesh position={[0.685, 0.62, 0]}>
        <boxGeometry args={[0.03, 0.42, 0.96]} />
        <meshStandardMaterial color={FOIL} roughness={0.9} metalness={0.15} />
      </mesh>
      <mesh position={[-0.685, 0.62, 0]}>
        <boxGeometry args={[0.03, 0.42, 0.96]} />
        <meshStandardMaterial color={FOIL} roughness={0.9} metalness={0.15} />
      </mesh>

      {/* ── Rocker-bogie suspension ─────────────────────────────── */}
      {[1, -1].map((side) => {
        const zRocker = 0.56 * side;
        const zAxle = WHEEL_Z * side;
        return (
          <group key={`susp-${side}`}>
            {/* Rocker: body pivot to front axle */}
            <Strut a={[0.05, 0.46, zRocker]} b={[0.85, 0, zAxle]} r={0.035} />
            {/* Rocker: body pivot back to bogie pivot */}
            <Strut a={[0.05, 0.46, zRocker]} b={[-0.45, 0.42, zAxle]} r={0.035} />
            {/* Bogie: pivot to middle and rear axles */}
            <Strut a={[-0.45, 0.42, zAxle]} b={[0, 0, zAxle]} r={0.032} />
            <Strut a={[-0.45, 0.42, zAxle]} b={[-0.85, 0, zAxle]} r={0.032} />
            {/* Differential link up to the body-mounted bar */}
            <Strut a={[0.05, 0.46, zRocker]} b={[0.05, 0.96, 0.04 * side]} r={0.028} />
            {/* Joints */}
            <mesh position={[0.05, 0.46, zRocker]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[-0.45, 0.42, zAxle]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.8} />
            </mesh>
          </group>
        );
      })}
      {/* Differential bar across the deck */}
      <Strut a={[0.05, 0.96, -0.04]} b={[0.05, 0.96, 0.04]} r={0.04} />

      {/* ── Six wheels ──────────────────────────────────────────── */}
      {WHEEL_X.map((x, xi) =>
        [-WHEEL_Z, WHEEL_Z].map((z, zi) => (
          <group key={`wheel-${xi}-${zi}`} position={[x, 0, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.17, 24]} />
              <meshStandardMaterial color={WHEEL} roughness={0.85} metalness={0.25} />
            </mesh>
            {/* Grousers — the titanium cleats on the rim */}
            {Array.from({ length: GROUSERS }, (_, gi) => {
              const a = (gi / GROUSERS) * Math.PI * 2;
              return (
                <mesh
                  key={gi}
                  position={[Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0]}
                  rotation={[0, 0, a]}
                >
                  <boxGeometry args={[0.05, 0.05, 0.185]} />
                  <meshStandardMaterial color={WHEEL} roughness={0.8} metalness={0.35} />
                </mesh>
              );
            })}
            {/* Hub and drive motor */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.2, 12]} />
              <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.8} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -Math.sign(z) * 0.1]}>
              <cylinderGeometry args={[0.07, 0.07, 0.1, 10]} />
              <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.5} />
            </mesh>
          </group>
        ))
      )}

      {/* ── Mast (remote sensing mast) ──────────────────────────── */}
      <mesh position={[0.42, 0.9, 0]}>
        <boxGeometry args={[0.24, 0.06, 0.24]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0.42, 1.21, 0]}>
        <cylinderGeometry args={[0.05, 0.055, 0.58, 12]} />
        <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.75} />
      </mesh>
      {/* Pan/tilt actuator */}
      <mesh position={[0.42, 1.51, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.08, 12]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Mast head */}
      <mesh position={[0.42, 1.58, 0]}>
        <boxGeometry args={[0.18, 0.16, 0.28]} />
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Mastcam-Z — stereo pair */}
      {[-0.075, 0.075].map((z, i) => (
        <group key={`mastcam-${i}`} position={[0.53, 1.6, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.09, 14]} />
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.05, 0, 0]}>
            <cylinderGeometry args={[0.034, 0.034, 0.015, 14]} />
            <meshStandardMaterial color={LENS} roughness={0.15} metalness={0.9} />
          </mesh>
        </group>
      ))}
      {/* SuperCam — body, aperture and laser port */}
      <mesh position={[0.5, 1.68, 0]}>
        <boxGeometry args={[0.15, 0.1, 0.13]} />
        <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh position={[0.58, 1.68, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.032, 0.032, 0.02, 14]} />
        <meshStandardMaterial color={LENS} roughness={0.15} metalness={0.9} />
      </mesh>
      {/* Navigation cameras — lower, wider baseline */}
      {[-0.12, 0.12].map((z, i) => (
        <group key={`navcam-${i}`} position={[0.53, 1.47, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 0.07, 12]} />
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.04, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.012, 12]} />
            <meshStandardMaterial color={LENS} roughness={0.15} metalness={0.9} />
          </mesh>
        </group>
      ))}
      {/* MEDA wind sensors — two booms off the mast head */}
      {[1, -1].map((side) => (
        <group key={`meda-${side}`}>
          <Strut a={[0.42, 1.55, 0.14 * side]} b={[0.4, 1.66, 0.34 * side]} r={0.012} />
          <mesh position={[0.4, 1.67, 0.35 * side]}>
            <boxGeometry args={[0.055, 0.055, 0.055]} />
            <meshStandardMaterial color={BODY} roughness={0.6} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── High-gain antenna — hexagonal flat array on a pedestal ── */}
      <mesh position={[-0.28, 0.95, 0.3]}>
        <cylinderGeometry args={[0.045, 0.05, 0.14, 10]} />
        <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.8} />
      </mesh>
      <mesh position={[-0.28, 1.06, 0.3]} rotation={[0.38, 0, 0.15]}>
        <cylinderGeometry args={[0.32, 0.32, 0.025, 6]} />
        <meshStandardMaterial
          color={METAL}
          roughness={0.35}
          metalness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[-0.28, 1.02, 0.3]} rotation={[0.38, 0, 0.15]}>
        <cylinderGeometry args={[0.04, 0.03, 0.09, 8]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* ── Low-gain antenna — deck whip ────────────────────────── */}
      <mesh position={[-0.52, 0.91, -0.28]}>
        <cylinderGeometry args={[0.045, 0.05, 0.06, 10]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[-0.52, 1.11, -0.28]}>
        <cylinderGeometry args={[0.012, 0.012, 0.34, 6]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[-0.52, 1.29, -0.28]}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshStandardMaterial color={METAL} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ── RTG (MMRTG) — aft, with radial fins ─────────────────── */}
      <mesh position={[-0.74, 0.76, 0]}>
        <boxGeometry args={[0.2, 0.12, 0.55]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[-0.98, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.19, 0.19, 0.52, 18]} />
        <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.5} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={`fin-${i}`} position={[-0.98, 0.64, 0]} rotation={[(i / 8) * Math.PI, 0, 0]}>
          <boxGeometry args={[0.5, 0.46, 0.012]} />
          <meshStandardMaterial color={METAL} roughness={0.45} metalness={0.8} />
        </mesh>
      ))}
      <mesh position={[-1.25, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.17, 0.06, 18]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.85} />
      </mesh>
      {/* Coolant lines to the body */}
      <Strut a={[-0.68, 0.72, 0.14]} b={[-0.9, 0.66, 0.12]} r={0.015} />
      <Strut a={[-0.68, 0.72, -0.14]} b={[-0.9, 0.66, -0.12]} r={0.015} />

      {/* ── Robotic arm and turret ──────────────────────────────── */}
      <mesh position={[0.64, 0.7, 0.4]}>
        <boxGeometry args={[0.14, 0.2, 0.14]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.7} />
      </mesh>
      <Strut a={[0.64, 0.64, 0.44]} b={[0.98, 0.24, 0.6]} r={0.042} />
      <Strut a={[0.98, 0.24, 0.6]} b={[1.33, 0.28, 0.5]} r={0.038} />
      {[
        [0.64, 0.64, 0.44],
        [0.98, 0.24, 0.6],
        [1.33, 0.28, 0.5],
      ].map((p, i) => (
        <mesh key={`joint-${i}`} position={p as [number, number, number]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.7} />
        </mesh>
      ))}
      {/* Turret housing */}
      <mesh position={[1.33, 0.2, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.13, 14]} />
        <meshStandardMaterial color={BODY} roughness={0.55} metalness={0.4} />
      </mesh>
      {/* Drill — chuck plus bit */}
      <mesh position={[1.33, 0.115, 0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 12]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[1.33, 0.0, 0.5]}>
        <cylinderGeometry args={[0.018, 0.018, 0.17, 8]} />
        <meshStandardMaterial color={METAL} roughness={0.3} metalness={0.95} />
      </mesh>
      {/* PIXL — X-ray spectrometer on the turret flank */}
      <mesh position={[1.33, 0.2, 0.63]}>
        <boxGeometry args={[0.08, 0.075, 0.08]} />
        <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.65} />
      </mesh>
      <mesh position={[1.33, 0.2, 0.68]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.015, 12]} />
        <meshStandardMaterial color={LENS} roughness={0.15} metalness={0.9} />
      </mesh>
      {/* SHERLOC — UV Raman / fluorescence on the opposite flank */}
      <mesh position={[1.33, 0.19, 0.37]}>
        <boxGeometry args={[0.09, 0.06, 0.08]} />
        <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.65} />
      </mesh>
      <mesh position={[1.33, 0.19, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.015, 12]} />
        <meshStandardMaterial color={LENS} roughness={0.15} metalness={0.9} />
      </mesh>
      {/* WATSON — imager on the turret, facing forward */}
      <mesh position={[1.4, 0.24, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.07, 12]} />
        <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[1.44, 0.24, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 0.012, 12]} />
        <meshStandardMaterial color={LENS} roughness={0.15} metalness={0.9} />
      </mesh>

      {/* ── Sample caching — bit carousel with tube ports ──────── */}
      <mesh position={[0.35, 0.94, -0.35]}>
        <cylinderGeometry args={[0.19, 0.19, 0.09, 16]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0.35, 0.99, -0.35]}>
        <cylinderGeometry args={[0.17, 0.17, 0.015, 16]} />
        <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.5} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return (
          <mesh key={`port-${i}`} position={[0.35 + Math.cos(a) * 0.12, 1.0, -0.35 + Math.sin(a) * 0.12]}>
            <cylinderGeometry args={[0.026, 0.026, 0.02, 10]} />
            <meshStandardMaterial color={METAL} roughness={0.35} metalness={0.9} />
          </mesh>
        );
      })}
      {/* Tube rack on the opposite side of the deck */}
      <mesh position={[0.28, 0.92, 0.33]}>
        <boxGeometry args={[0.26, 0.05, 0.18]} />
        <meshStandardMaterial color={DARK} roughness={0.7} metalness={0.4} />
      </mesh>

      {/* ── Hazard cameras — front and rear pairs ──────────────── */}
      {[
        [0.69, 0.52, 0.3],
        [0.69, 0.52, -0.3],
        [-0.69, 0.52, 0.3],
        [-0.69, 0.52, -0.3],
      ].map((p, i) => (
        <mesh
          key={`hazcam-${i}`}
          position={p as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.028, 0.028, 0.05, 10]} />
          <meshStandardMaterial color={LENS} roughness={0.2} metalness={0.85} />
        </mesh>
      ))}

      {/* ── MEDA weather station — remote mast on the aft deck ─── */}
      <mesh position={[-0.58, 0.9, 0.02]}>
        <cylinderGeometry args={[0.03, 0.035, 0.06, 10]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[-0.58, 1.03, 0.02]}>
        <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[-0.58, 1.15, 0.02]}>
        <boxGeometry args={[0.11, 0.02, 0.02]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[-0.58, 1.15, 0.02]}>
        <boxGeometry args={[0.02, 0.02, 0.11]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.85} />
      </mesh>

      {/* ── Ingenuity helicopter ───────────────────────────────── */}
      {/* Deck-mounted for visibility; the flight article rode under the belly. */}
      <group position={[-0.1, 0.9, -0.38]}>
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.24]} />
          <meshStandardMaterial color={METAL} roughness={0.6} metalness={0.6} />
        </mesh>
        {/* Fuselage */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.18, 0.07, 0.13]} />
          <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Solar panel */}
        <mesh position={[0, 0.132, 0]}>
          <boxGeometry args={[0.2, 0.012, 0.15]} />
          <meshStandardMaterial color={SOLAR} roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Coaxial rotor mast */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.14, 8]} />
          <meshStandardMaterial color={METAL} roughness={0.35} metalness={0.9} />
        </mesh>
        {/* Upper rotor */}
        <group ref={upperRotor} position={[0, 0.28, 0]}>
          <mesh>
            <cylinderGeometry args={[0.026, 0.026, 0.014, 10]} />
            <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.55, 0.008, 0.028]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.5} metalness={0.4} />
          </mesh>
        </group>
        {/* Lower rotor */}
        <group ref={lowerRotor} position={[0, 0.255, 0]}>
          <mesh>
            <cylinderGeometry args={[0.026, 0.026, 0.014, 10]} />
            <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.55, 0.008, 0.028]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.5} metalness={0.4} />
          </mesh>
        </group>
        {/* Four legs with foot pads */}
        {[
          [0.08, 0.09, 0.06],
          [0.08, 0.09, -0.06],
          [-0.08, 0.09, 0.06],
          [-0.08, 0.09, -0.06],
        ].map((p, i) => {
          const foot: [number, number, number] = [p[0] * 2.1, 0.0, p[2] * 2.1];
          return (
            <group key={`heli-leg-${i}`}>
              <Strut a={p as [number, number, number]} b={foot} r={0.008} />
              <mesh position={foot}>
                <sphereGeometry args={[0.016, 8, 8]} />
                <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.5} />
              </mesh>
            </group>
          );
        })}
        {/* Antenna / avionics nub underneath */}
        <mesh position={[0, 0.05, -0.05]}>
          <boxGeometry args={[0.05, 0.03, 0.05]} />
          <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.5} />
        </mesh>
      </group>

      {/* Wireframe accent */}
      <mesh scale={1.8}>
        <sphereGeometry args={[2.0, 16, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
