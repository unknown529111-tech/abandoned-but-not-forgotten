// src/components/earth/EarthZoomCanvas.jsx
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function CameraRig({ zoom }) {
    const { camera } = useThree();
    useEffect(() => {
        camera.zoom = zoom;
        camera.updateProjectionMatrix();
    }, [zoom, camera]);
    return null;
}

function Earth({ reducedMotion }) {
    const groupRef = useRef(null);
    const tex = useTexture('/textures/2k_earth_daymap.jpg');
    useFrame((_, delta) => {
        if (groupRef.current && !reducedMotion) {
            groupRef.current.rotation.y += delta * 0.08;
        }
    });
    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial map={tex} />
            </mesh>
            <ambientLight intensity={0.6} />
            <directionalLight position={[6, 6, 6]} intensity={1.4} />
        </group>
    );
}

export default function EarthZoomCanvas({ zoom = 2, reducedMotion = false }) {
    return (
        <Canvas
            orthographic
            camera={{ position: [0, 0, 10], zoom, left: -3, right: 3, top: 3, bottom: -3, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
        >
            <color attach="background" args={['#000000']} />
            <CameraRig zoom={zoom} />
            <Earth reducedMotion={reducedMotion} />
        </Canvas>
    );
}
