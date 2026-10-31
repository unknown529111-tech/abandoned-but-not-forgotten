// src/components/solar/SolarScene.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
const SPACING = 2.4;
const DEPTH = 1.6;
// Body id -> texture URL (under public/). Missing entries (pluto, deep-space/other)
// fall back to a colored sphere.
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
export default function SolarScene({ bodies, selectedIndex, reducedMotion }) {
    const meshes = useRef([]);
    const textures = useTexture(TEXTURES);
    useFrame((_, delta) => {
        bodies.forEach((_, i) => {
            const mesh = meshes.current[i];
            if (!mesh)
                return;
            const offset = i - selectedIndex;
            const targetX = offset * SPACING;
            const targetZ = -Math.abs(offset) * DEPTH;
            const targetScale = offset === 0 ? 1.45 : Math.max(0.55, 0.9 - Math.abs(offset) * 0.12);
            const lerp = reducedMotion ? 1 : Math.min(1, delta * 6);
            mesh.position.x += (targetX - mesh.position.x) * lerp;
            mesh.position.z += (targetZ - mesh.position.z) * lerp;
            const cur = mesh.scale.x;
            const next = cur + (targetScale - cur) * lerp;
            mesh.scale.setScalar(next);
            if (!reducedMotion) {
                mesh.rotation.y += delta * 0.35;
            }
        });
    });
    return (<group>
      {/* Starfield background sphere (inside-out). */}
      <mesh>
        <sphereGeometry args={[40, 32, 32]}/>
        <meshBasicMaterial map={textures.stars} side={THREE.BackSide}/>
      </mesh>

      {bodies.map((body, i) => {
            const tex = textures[body.id];
            const isSun = body.id === 'sun';
            const hasTex = !!tex;
            const ringTex = textures.saturnRing;
            return (<group key={body.id} ref={(el) => {
                    meshes.current[i] = el;
                }}>
            <mesh>
              <sphereGeometry args={[0.7, 24, 24]}/>
              <meshStandardMaterial map={hasTex ? tex : undefined} color={hasTex ? '#ffffff' : body.accent} roughness={isSun ? 0.9 : 0.35} metalness={0.15} emissive={isSun ? '#ffffff' : body.accent} emissiveIntensity={isSun ? 1.2 : (i === selectedIndex ? 0.35 : 0.12)} emissiveMap={isSun && hasTex ? tex : undefined}/>
            </mesh>
            {body.id === 'saturn' && (<mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.95, 1.5, 64]}/>
                <meshStandardMaterial map={ringTex} transparent side={THREE.DoubleSide} roughness={0.6} metalness={0.1}/>
              </mesh>)}
          </group>);
        })}

      {/* soft blur backdrop plane */}
      <mesh position={[0, 0, -12]}>
        <planeGeometry args={[60, 40]}/>
        <meshBasicMaterial color="#000000" transparent opacity={0.3}/>
      </mesh>
    </group>);
}
