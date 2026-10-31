// src/components/equipment/models/Viking1Model.tsx
// Procedural 3D model of the Viking 1 Lander — first successful Mars lander, 1976.
// Hexagonal body on three legs, two SNAP-19 RTGs, HGA dish, facsimile cameras,
// meteorology boom, biology package bay and terminal descent engine.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const BODY = '#dcdcdc';
const BLANKET = '#c6c9cd';
const DECK = '#b4b8bd';
const LEG = '#7a7d81';
const DARK = '#3a3d40';
const DISH = '#b9bec3';
const CELL = '#1a3a5c';
const ACCENT = '#42BFFF';
// Rod between two points — quaternion keeps every strut correctly aimed
// without hand-tuned euler angles, including the radial RTG/pad discs.
function Strut({ from, to, radius = 0.022, color = LEG, segments = 8, }) {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return (<mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, a.distanceTo(b), segments]}/>
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.5}/>
    </mesh>);
}
export default function Viking1Model({ reducedMotion }) {
    const groupRef = useRef(null);
    useFrame((_, delta) => {
        if (groupRef.current && !reducedMotion)
            groupRef.current.rotation.y += delta * 0.3;
    });
    // Hexagon: corners at 0° + n·60°, flat face midpoints at 30° + n·60°.
    // Legs hang from three alternating corners; hardware bolts to the flat faces.
    const FACES = [30, 90, 150, 210, 270, 330];
    const LEGS = [60, 180, 300];
    const at = (radius, deg, y = 0) => {
        const a = (deg * Math.PI) / 180;
        return [Math.sin(a) * radius, y, Math.cos(a) * radius];
    };
    const rad = (deg) => (deg * Math.PI) / 180;
    return (<group ref={groupRef} scale={0.5}>
      {/* ---- Hexagonal lander body (honeycomb aluminium hull) ---- */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.78, 0.82, 0.44, 6]}/>
        <meshStandardMaterial color={BODY} roughness={0.55} metalness={0.35}/>
      </mesh>
      {/* Thermal blanket panels on each of the six faces */}
      {FACES.map((deg) => (<mesh key={`blanket-${deg}`} position={at(0.685, deg, 0)} rotation={[0, rad(deg), 0]}>
          <boxGeometry args={[0.5, 0.28, 0.03]}/>
          <meshStandardMaterial color={BLANKET} roughness={0.7} metalness={0.25}/>
        </mesh>))}
      {/* Lower base ring */}
      <mesh position={[0, -0.23, 0]}>
        <cylinderGeometry args={[0.83, 0.79, 0.06, 6]}/>
        <meshStandardMaterial color={DECK} roughness={0.6} metalness={0.4}/>
      </mesh>
      {/* Upper equipment deck */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.72, 0.76, 0.1, 6]}/>
        <meshStandardMaterial color={DECK} roughness={0.5} metalness={0.45}/>
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <cylinderGeometry args={[0.73, 0.73, 0.02, 6]}/>
        <meshStandardMaterial color={BLANKET} roughness={0.45} metalness={0.5}/>
      </mesh>

      {/* ---- Landing legs: three primary struts, A-frame braces, footpads ---- */}
      {LEGS.map((deg) => (<group key={`leg-${deg}`}>
          <Strut from={at(0.78, deg, 0.08)} to={at(1.12, deg, -0.84)} radius={0.032}/>
          <Strut from={at(0.62, deg, -0.16)} to={at(0.94, deg, -0.46)} radius={0.02}/>
          {/* Knee joint */}
          <mesh position={at(0.94, deg, -0.46)}>
            <sphereGeometry args={[0.05, 10, 10]}/>
            <meshStandardMaterial color={LEG} roughness={0.5} metalness={0.6}/>
          </mesh>
          {/* Shock absorber above the pad */}
          <mesh position={at(1.12, deg, -0.77)}>
            <cylinderGeometry args={[0.075, 0.075, 0.12, 12]}/>
            <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.65}/>
          </mesh>
          {/* Footpad and its crushable conical core */}
          <mesh position={at(1.12, deg, -0.85)}>
            <cylinderGeometry args={[0.18, 0.18, 0.045, 16]}/>
            <meshStandardMaterial color={LEG} roughness={0.7} metalness={0.2}/>
          </mesh>
          <mesh position={at(1.12, deg, -0.89)}>
            <cylinderGeometry args={[0.18, 0.12, 0.06, 16]}/>
            <meshStandardMaterial color={DARK} roughness={0.8} metalness={0.15}/>
          </mesh>
        </group>))}

      {/* ---- Terminal descent engine under the body ---- */}
      <mesh position={[0, -0.31, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.16, 12]}/>
        <meshStandardMaterial color="#6a6d70" roughness={0.4} metalness={0.75}/>
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.06, 12]}/>
        <meshStandardMaterial color={DARK} roughness={0.35} metalness={0.8}/>
      </mesh>
      {/* Flared nozzle */}
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.1, 0.25, 0.26, 16, 1, true]}/>
        <meshStandardMaterial color="#4e5154" roughness={0.35} metalness={0.85} side={THREE.DoubleSide}/>
      </mesh>
      {[0, 120, 240].map((deg) => (<Strut key={`engine-brace-${deg}`} from={at(0.4, deg, -0.24)} to={at(0.13, deg, -0.36)} radius={0.016}/>))}

      {/* ---- Two SNAP-19 RTG power units on outrigger booms (rear faces) ---- */}
      {[210, 330].map((deg) => (<group key={`rtg-${deg}`}>
          <Strut from={at(0.74, deg, 0.04)} to={at(1.02, deg, 0.04)} radius={0.035} color={DARK}/>
          <Strut from={at(0.74, deg, -0.18)} to={at(1.02, deg, 0.04)} radius={0.018}/>
          {/* Generator housing with cooling fins as thin radial discs */}
          <Strut from={at(1.02, deg, 0.04)} to={at(1.36, deg, 0.04)} radius={0.11} color="#43464a" segments={12}/>
          <Strut from={at(0.99, deg, 0.04)} to={at(1.02, deg, 0.04)} radius={0.135} segments={12}/>
          <Strut from={at(1.12, deg, 0.04)} to={at(1.14, deg, 0.04)} radius={0.122} color={DARK}/>
          <Strut from={at(1.26, deg, 0.04)} to={at(1.28, deg, 0.04)} radius={0.122} color={DARK}/>
          <Strut from={at(1.36, deg, 0.04)} to={at(1.39, deg, 0.04)} radius={0.135} segments={12}/>
          {/* Radiator cone at the far end */}
          <Strut from={at(1.39, deg, 0.04)} to={at(1.46, deg, 0.04)} radius={0.085} color={DARK}/>
        </group>))}

      {/* ---- Two solar panels on side booms ---- */}
      {[-1, 1].map((side) => (<group key={`panel-${side}`}>
          <Strut from={at(0.76, side * 90, 0.14)} to={at(1.04, side * 90, 0.14)} radius={0.03} color={DARK}/>
          <group position={[side * 1.34, 0.14, 0]} rotation={[0, 0, side * 0.12]}>
            <mesh>
              <boxGeometry args={[0.62, 0.025, 0.52]}/>
              <meshStandardMaterial color="#8b9096" roughness={0.5} metalness={0.6}/>
            </mesh>
            <mesh position={[0, 0.014, 0]}>
              <boxGeometry args={[0.56, 0.008, 0.46]}/>
              <meshStandardMaterial color={CELL} roughness={0.3} metalness={0.7}/>
            </mesh>
            {[-0.14, 0.14].map((z) => (<mesh key={z} position={[0, 0.02, z]}>
                <boxGeometry args={[0.56, 0.004, 0.006]}/>
                <meshStandardMaterial color="#c9cdd1" roughness={0.5} metalness={0.6}/>
              </mesh>))}
            <mesh position={[-0.31, 0, 0.28]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.014, 0.014, 0.56, 8]}/>
              <meshStandardMaterial color={LEG} roughness={0.5} metalness={0.5}/>
            </mesh>
          </group>
        </group>))}

      {/* ---- High-gain antenna: parabolic dish with tripod feed ---- */}
      <mesh position={[0, 0.38, -0.28]}>
        <cylinderGeometry args={[0.05, 0.06, 0.2, 10]}/>
        <meshStandardMaterial color={LEG} roughness={0.5} metalness={0.6}/>
      </mesh>
      <group position={[0, 0.48, -0.28]} rotation={[0.3, 0, 0]}>
        {/* Reflector: upper spherical cap flipped so it opens upward */}
        <mesh position={[0, 0.175, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.38, 28, 14, 0, Math.PI * 2, 0, Math.PI / 3]}/>
          <meshStandardMaterial color={DISH} roughness={0.35} metalness={0.7} side={THREE.DoubleSide}/>
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.329, 0.012, 8, 28]}/>
          <meshStandardMaterial color="#9aa0a5" roughness={0.4} metalness={0.7}/>
        </mesh>
        {/* Hub and feed horn on a tripod */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.07, 0.05, 0.06, 12]}/>
          <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7}/>
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.035, 0.055, 0.1, 12]}/>
          <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7}/>
        </mesh>
        {[0, 120, 240].map((deg) => (<Strut key={`feed-${deg}`} from={at(0.3, deg, 0)} to={[0, 0.22, 0]} radius={0.008} color="#9aa0a5"/>))}
      </group>

      {/* ---- UHF relay antenna ---- */}
      <mesh position={[0.42, 0.35, -0.34]}>
        <cylinderGeometry args={[0.05, 0.06, 0.06, 10]}/>
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.5}/>
      </mesh>
      <mesh position={[0.42, 0.58, -0.34]}>
        <cylinderGeometry args={[0.012, 0.012, 0.42, 8]}/>
        <meshStandardMaterial color="#c9cdd1" roughness={0.4} metalness={0.7}/>
      </mesh>
      {[-1, 1].map((side) => (<Strut key={`uhf-rod-${side}`} from={[0.42, 0.78, -0.34]} to={[0.42 + side * 0.09, 0.74, -0.34]} radius={0.008} color="#c9cdd1"/>))}
      {/* ---- Low-gain antenna canister ---- */}
      <mesh position={[-0.45, 0.4, -0.3]}>
        <cylinderGeometry args={[0.085, 0.085, 0.16, 12]}/>
        <meshStandardMaterial color={BODY} roughness={0.45} metalness={0.55}/>
      </mesh>
      <mesh position={[-0.45, 0.49, -0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.015, 12]}/>
        <meshStandardMaterial color={LEG} roughness={0.4} metalness={0.65}/>
      </mesh>

      {/* ---- Imaging system: two facsimile cameras on the deck ---- */}
      {[-1, 1].map((side) => (<group key={`camera-${side}`} position={[side * 0.3, 0.4, 0.4]}>
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 0.1, 10]}/>
            <meshStandardMaterial color={LEG} roughness={0.5} metalness={0.6}/>
          </mesh>
          <mesh>
            <boxGeometry args={[0.17, 0.13, 0.15]}/>
            <meshStandardMaterial color="#2b2d2f" roughness={0.35} metalness={0.7}/>
          </mesh>
          <mesh position={[0, 0, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.06, 14]}/>
            <meshStandardMaterial color="#1c1e20" roughness={0.25} metalness={0.8}/>
          </mesh>
          <mesh position={[0, 0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.062, 0.075, 0.02, 14]}/>
            <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.6}/>
          </mesh>
        </group>))}

      {/* ---- Meteorology boom with wind and temperature sensors ---- */}
      <mesh position={[0.2, 0.22, 0.66]}>
        <cylinderGeometry args={[0.055, 0.065, 0.08, 10]}/>
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.5}/>
      </mesh>
      <Strut from={[0.2, 0.24, 0.68]} to={[0.34, 0.52, 1.02]} radius={0.018}/>
      <mesh position={[0.34, 0.54, 1.03]}>
        <boxGeometry args={[0.07, 0.07, 0.07]}/>
        <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.6}/>
      </mesh>
      {/* Wind sensor: crossed thin rods with tip beads */}
      {[0, 90].map((deg) => (<Strut key={`wind-${deg}`} from={[0.34 + Math.cos(rad(deg)) * 0.09, 0.6, 1.03 + Math.sin(rad(deg)) * 0.09]} to={[0.34 - Math.cos(rad(deg)) * 0.09, 0.6, 1.03 - Math.sin(rad(deg)) * 0.09]} radius={0.005} color="#c9cdd1"/>))}
      {/* Thermocouple cluster */}
      <mesh position={[0.34, 0.48, 1.03]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.12, 6]}/>
        <meshStandardMaterial color="#c9cdd1" roughness={0.4} metalness={0.7}/>
      </mesh>

      {/* ---- Biology experiment package bay (front face) ---- */}
      <group position={at(0.7, 30, -0.02)} rotation={[0, rad(30), 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.28, 0.12]}/>
          <meshStandardMaterial color={BLANKET} roughness={0.55} metalness={0.4}/>
        </mesh>
        <mesh position={[0, 0, 0.062]}>
          <boxGeometry args={[0.34, 0.2, 0.02]}/>
          <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.6}/>
        </mesh>
        {/* Sample inlet ports */}
        <mesh position={[0.11, -0.04, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 12]}/>
          <meshStandardMaterial color="#8b9096" roughness={0.35} metalness={0.75}/>
        </mesh>
        {[-0.11, 0.02].map((x) => (<mesh key={x} position={[x, 0.07, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.03, 10]}/>
            <meshStandardMaterial color="#8b9096" roughness={0.35} metalness={0.75}/>
          </mesh>))}
      </group>

      {/* ---- Surface sampler arm, stowed against the rear-left flank ---- */}
      <mesh position={at(0.7, 150, -0.06)} rotation={[0, rad(150), 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.1, 10]}/>
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.5}/>
      </mesh>
      <Strut from={at(0.74, 150, -0.06)} to={[0.52, -0.48, -0.92]} radius={0.022} color={DARK}/>
      <mesh position={[0.52, -0.48, -0.92]}>
        <sphereGeometry args={[0.035, 10, 10]}/>
        <meshStandardMaterial color={LEG} roughness={0.5} metalness={0.6}/>
      </mesh>
      <Strut from={[0.52, -0.48, -0.92]} to={[0.12, -0.62, -0.58]} radius={0.018} color={DARK}/>
      {/* Backhoe scoop */}
      <mesh position={[0.09, -0.63, -0.53]} rotation={[0.4, 0.5, 0]}>
        <boxGeometry args={[0.12, 0.05, 0.09]}/>
        <meshStandardMaterial color="#6a6d70" roughness={0.4} metalness={0.7}/>
      </mesh>

      {/* ---- Seismometer on the deck ---- */}
      <mesh position={[-0.42, 0.36, 0.26]}>
        <cylinderGeometry args={[0.08, 0.085, 0.07, 14]}/>
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.5}/>
      </mesh>
      <mesh position={[-0.42, 0.4, 0.26]}>
        <cylinderGeometry args={[0.05, 0.05, 0.015, 12]}/>
        <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7}/>
      </mesh>

      {/* ---- Descent-stage propellant tank ---- */}
      <mesh position={[0, -0.44, 0.5]} scale={[1, 0.8, 1]}>
        <sphereGeometry args={[0.17, 16, 12]}/>
        <meshStandardMaterial color={BLANKET} roughness={0.45} metalness={0.6}/>
      </mesh>

      {/* Wireframe accent */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.5, 16, 16]}/>
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05}/>
      </mesh>
    </group>);
}
