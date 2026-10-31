// src/components/equipment/models/Voyager1Model.tsx
// Procedural 3D model of Voyager 1 — outer solar system probe, 1977.
// Boom lengths are compressed (roughly a third of the flight values) so the
// whole craft fits the viewer framing; bus and dish keep their real proportions.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const BODY = '#c8c8c8';
const DISH = '#b8b8b8';
const BOOM = '#6a6a6a';
const GOLD = '#b3915c';
const DARK = '#2a2a2a';
const ACCENT = '#42BFFF';
const DISH_R = 1.4;
const DISH_DEPTH = 0.5;
const DISH_Z = 1.0;
// Paraboloid profile of the 3.7 m high-gain antenna (f/D ≈ 0.35).
const dishProfile = Array.from({ length: 14 }, (_, i) => {
    const r = (i / 13) * DISH_R;
    return new THREE.Vector2(r, -DISH_DEPTH * (1 - (r / DISH_R) ** 2));
});
/** Cylinder stretched between two points — used for struts, feeds and mounting tubes. */
function Strut({ a, b, radius = 0.018, color = BOOM, }) {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const dir = end.clone().sub(start);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return (<mesh position={start.clone().add(end).multiplyScalar(0.5)} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, dir.length(), 6]}/>
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.35}/>
    </mesh>);
}
export default function Voyager1Model({ reducedMotion }) {
    const groupRef = useRef(null);
    useFrame((_, delta) => {
        if (groupRef.current && !reducedMotion)
            groupRef.current.rotation.y += delta * 0.3;
    });
    return (<group ref={groupRef} scale={0.45}>
      {/* Central bus — decagonal electronics housing, dish axis along +Z */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.95, 10]}/>
        <meshStandardMaterial color={BODY} roughness={0.5} metalness={0.45}/>
      </mesh>
      {[-0.47, 0.47].map((z, i) => (<mesh key={i} position={[0, 0, z]}>
          <torusGeometry args={[0.615, 0.025, 6, 10]}/>
          <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.4}/>
        </mesh>))}
      {/* Gold multilayer insulation on the aft face */}
      <mesh position={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.57, 0.57, 0.04, 10]}/>
        <meshStandardMaterial color={GOLD} roughness={0.45} metalness={0.6}/>
      </mesh>
      {/* Bus-mounted electronics boxes */}
      <mesh position={[0.3, 0.4, -0.18]}>
        <boxGeometry args={[0.32, 0.18, 0.44]}/>
        <meshStandardMaterial color="#9a9a9a" roughness={0.55} metalness={0.4}/>
      </mesh>
      <mesh position={[-0.24, -0.42, -0.1]} rotation={[0, 0.6, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.34]}/>
        <meshStandardMaterial color="#8f8f8f" roughness={0.55} metalness={0.4}/>
      </mesh>
      {/* Hydrazine attitude-control thrusters, aft face */}
      {[0, 1].map((i) => {
            const a = Math.PI / 2 + i * Math.PI;
            return (<mesh key={i} position={[Math.cos(a) * 0.4, Math.sin(a) * 0.4, -0.55]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.05, 0.14, 10]}/>
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.8}/>
          </mesh>);
        })}

      {/* High-gain antenna — 3.7 m Cassegrain dish */}
      <mesh position={[0, 0, DISH_Z]} rotation={[Math.PI / 2, 0, 0]}>
        <latheGeometry args={[dishProfile, 48]}/>
        <meshStandardMaterial color={DISH} roughness={0.32} metalness={0.8} side={THREE.DoubleSide}/>
      </mesh>
      {/* Dish rim */}
      <mesh position={[0, 0, DISH_Z]}>
        <torusGeometry args={[DISH_R, 0.028, 6, 48]}/>
        <meshStandardMaterial color={BOOM} roughness={0.55} metalness={0.4}/>
      </mesh>
      {/* Stiffening rings on the back of the dish */}
      {[0.55, 0.95, 1.28].map((r) => (<mesh key={r} position={[0, 0, DISH_Z - DISH_DEPTH * (1 - (r / DISH_R) ** 2) - 0.025]}>
          <torusGeometry args={[r, 0.016, 5, 40]}/>
          <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.4}/>
        </mesh>))}
      {/* Dish-to-bus hub and mounting struts */}
      <mesh position={[0, 0, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.24, 0.16, 10]}/>
        <meshStandardMaterial color={BOOM} roughness={0.55} metalness={0.45}/>
      </mesh>
      {[0, 1, 2, 3].map((i) => {
            const a = Math.PI / 4 + (i * Math.PI) / 2;
            return (<Strut key={i} a={[Math.cos(a) * 0.45, Math.sin(a) * 0.45, 0.48]} b={[Math.cos(a) * 0.9, Math.sin(a) * 0.9, DISH_Z - DISH_DEPTH * 0.42]} radius={0.022}/>);
        })}
      {/* Subreflector at the Cassegrain focus */}
      <mesh position={[0, 0, DISH_Z + 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.13, 0.06, 24]}/>
        <meshStandardMaterial color={DISH} roughness={0.3} metalness={0.85} side={THREE.DoubleSide}/>
      </mesh>
      {/* Subreflector tripod */}
      {[0, 1, 2].map((i) => {
            const a = Math.PI / 2 + (i * 2 * Math.PI) / 3;
            return (<Strut key={i} a={[Math.cos(a) * 1.3, Math.sin(a) * 1.3, DISH_Z]} b={[Math.cos(a) * 0.17, Math.sin(a) * 0.17, DISH_Z + 0.47]} radius={0.013}/>);
        })}
      {/* Feed horn at the dish vertex */}
      <mesh position={[0, 0, DISH_Z - DISH_DEPTH + 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.11, 0.24, 16, 1, true]}/>
        <meshStandardMaterial color={DARK} roughness={0.35} metalness={0.8} side={THREE.DoubleSide}/>
      </mesh>

      {/* Science boom — twin rails with cross rungs */}
      {[-0.09, 0.09].map((z, i) => (<mesh key={i} position={[1.3, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.6, 6]}/>
          <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.35}/>
        </mesh>))}
      {[0, 1, 2, 3, 4, 5].map((i) => (<mesh key={i} position={[0.65 + i * 0.27, 0, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.2]}/>
          <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.35}/>
        </mesh>))}

      {/* Cosmic ray subsystem, mounted on the boom */}
      <group position={[1.05, 0.15, -0.12]}>
        <mesh>
          <boxGeometry args={[0.24, 0.24, 0.24]}/>
          <meshStandardMaterial color="#9d9d9d" roughness={0.5} metalness={0.55}/>
        </mesh>
        <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 12]}/>
          <meshStandardMaterial color={DARK} roughness={0.35} metalness={0.75}/>
        </mesh>
        {[0, 1, 2].map((i) => (<mesh key={i} position={[0, 0.14 + i * 0.03, 0]}>
            <boxGeometry args={[0.3, 0.012, 0.3]}/>
            <meshStandardMaterial color="#777777" roughness={0.6} metalness={0.4}/>
          </mesh>))}
      </group>

      {/* Scan platform — two-axis gimbal carrying the optical instruments */}
      <mesh position={[2.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 12]}/>
        <meshStandardMaterial color={BOOM} roughness={0.5} metalness={0.5}/>
      </mesh>
      <mesh position={[2.15, 0.09, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]}/>
        <meshStandardMaterial color={BOOM} roughness={0.5} metalness={0.5}/>
      </mesh>
      <group position={[2.15, 0.16, 0]}>
        <mesh>
          <boxGeometry args={[0.64, 0.06, 0.46]}/>
          <meshStandardMaterial color="#a5a5a5" roughness={0.5} metalness={0.5}/>
        </mesh>

        {/* Imaging science subsystem — narrow- and wide-angle cameras */}
        <group position={[-0.16, 0.13, 0]}>
          <mesh>
            <boxGeometry args={[0.3, 0.2, 0.26]}/>
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.6}/>
          </mesh>
          {[-0.08, 0.08].map((x, i) => (<mesh key={i} position={[x, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.062, 0.062, 0.2, 16]}/>
              <meshStandardMaterial color="#1b1b1b" roughness={0.3} metalness={0.7}/>
            </mesh>))}
        </group>

        {/* Infrared interferometer spectrometer (IRIS) */}
        <group position={[0.12, 0.1, 0.02]}>
          <mesh>
            <boxGeometry args={[0.16, 0.18, 0.22]}/>
            <meshStandardMaterial color="#8e8e8e" roughness={0.45} metalness={0.6}/>
          </mesh>
          <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.12, 12]}/>
            <meshStandardMaterial color="#202020" roughness={0.35} metalness={0.7}/>
          </mesh>
        </group>

        {/* Ultraviolet spectrometer (UVS) with baffle */}
        <group position={[0.12, 0.1, -0.16]}>
          <mesh>
            <boxGeometry args={[0.14, 0.16, 0.16]}/>
            <meshStandardMaterial color="#8e8e8e" roughness={0.45} metalness={0.6}/>
          </mesh>
          <mesh position={[0, 0, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.06, 0.16, 12, 1, true]}/>
            <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} side={THREE.DoubleSide}/>
          </mesh>
        </group>

        {/* Photopolarimeter (PPS) */}
        <group position={[-0.18, 0.09, -0.15]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.18, 16]}/>
            <meshStandardMaterial color="#8e8e8e" roughness={0.4} metalness={0.65}/>
          </mesh>
          <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.06, 16]}/>
            <meshStandardMaterial color="#141414" roughness={0.3} metalness={0.6}/>
          </mesh>
        </group>

        {/* Low-energy charged particle detector, stepping motor on the outboard edge */}
        <group position={[0.34, 0.04, 0.06]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.16, 12]}/>
            <meshStandardMaterial color="#860b0b" roughness={0.5} metalness={0.4}/>
          </mesh>
          <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.1, 12]}/>
            <meshStandardMaterial color={DARK} roughness={0.35} metalness={0.7}/>
          </mesh>
        </group>
      </group>

      {/* Power boom with three MHW-RTGs */}
      <mesh position={[-1.05, 0, -0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.1, 8]}/>
        <meshStandardMaterial color={BOOM} roughness={0.6} metalness={0.35}/>
      </mesh>
      {[-0.3, 0, 0.3].map((y, i) => (<group key={i} position={[-1.4, y, -0.18]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.44, 16]}/>
            <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.7}/>
          </mesh>
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((a, j) => (<mesh key={j} rotation={[a, 0, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.014]}/>
              <meshStandardMaterial color="#575757" roughness={0.55} metalness={0.5}/>
            </mesh>))}
          {/* RTG end dome and power cable */}
          <mesh position={[0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.08, 0.06, 12]}/>
            <meshStandardMaterial color="#3c3c3c" roughness={0.5} metalness={0.6}/>
          </mesh>
          <Strut a={[0.26, -y * 0.3, 0]} b={[0.55, -y * 0.5, 0.14]} radius={0.012} color="#222222"/>
        </group>))}

      {/* Magnetometer boom — 13 m flight, three sensors along the tube */}
      <group position={[-0.55, 0.34, -0.3]} rotation={[0, 0, -0.06]}>
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 3.0, 6]}/>
          <meshStandardMaterial color={BOOM} roughness={0.65} metalness={0.3}/>
        </mesh>
        {[-0.45, -1.55, -2.62].map((x, i) => (<group key={i} position={[x, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.055, 0.055, 0.17, 10]}/>
              <meshStandardMaterial color="#8a8a8a" roughness={0.5} metalness={0.55}/>
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.2, 8]}/>
              <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.7}/>
            </mesh>
          </group>))}
        {/* Boom root fitting */}
        <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 10]}/>
          <meshStandardMaterial color="#7d7d7d" roughness={0.5} metalness={0.5}/>
        </mesh>
      </group>

      {/* Plasma wave antenna — two 10 m dipole whips in a V */}
      {[-1, 1].map((side) => (<group key={side} position={[0.08, side * 0.5, -0.08]} rotation={[0, side * 0.12, side * 0.1]}>
          <mesh position={[0, side * 1.1, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 2.2, 6]}/>
            <meshStandardMaterial color="#5e5e5e" roughness={0.7} metalness={0.3}/>
          </mesh>
          {/* Preamplifier housing at the base of each whip */}
          <mesh position={[0, side * 0.12, 0]}>
            <boxGeometry args={[0.14, 0.16, 0.12]}/>
            <meshStandardMaterial color="#8a8a8a" roughness={0.55} metalness={0.45}/>
          </mesh>
        </group>))}

      {/* Wireframe accent */}
      <mesh scale={1.9}>
        <sphereGeometry args={[1.8, 20, 20]}/>
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.05}/>
      </mesh>
    </group>);
}
