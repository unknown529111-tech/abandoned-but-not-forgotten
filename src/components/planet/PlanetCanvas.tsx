// src/components/planet/PlanetCanvas.tsx
// Lazy-loaded 3D canvas for the Planet Explorer. Orthographic pan/zoom camera,
// procedural planet surface texture, equipment point markers.
import { useRef, useEffect, Component, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { Body, Equipment } from '../../types';
import PlanetScene from './PlanetScene';
import PlanetFallback from './PlanetFallback';

interface Props {
  body: Body;
  points: Equipment[];
  reducedMotion: boolean;
  initialCamera: { x: number; y: number; zoom: number };
  onCameraChange: (c: { x: number; y: number; zoom: number }) => void;
  onHover: (eq: Equipment | null) => void;
  onClickPoint: (id: string) => void;
  hoveredId: string | null;
}

// Minimal error boundary so a WebGL failure falls back to a static image.
class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default function PlanetCanvas({
  body,
  points,
  reducedMotion,
  initialCamera,
  onCameraChange,
  onHover,
  onClickPoint,
  hoveredId,
}: Props) {
  const controlsRef = useRef<any>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleChange = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object as THREE.OrthographicCamera;
    onCameraChange({
      x: controls.target.x,
      y: controls.target.y,
      zoom: cam.zoom || 1,
    });
  };

  // Apply restored camera state once on mount.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.set(initialCamera.x || 0, initialCamera.y || 0, 0);
    const cam = controls.object as THREE.OrthographicCamera;
    cam.zoom = initialCamera.zoom || 1;
    cam.updateProjectionMatrix();
    controls.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoom = Math.max(0.5, initialCamera.zoom || 1);

  return (
    <div ref={wrapperRef} className="planet-canvas-wrap" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CanvasErrorBoundary fallback={<PlanetFallback body={body} />}>
        <Canvas
          className="planet-canvas"
          orthographic
          frameloop={inView ? 'always' : 'never'}
          camera={{ position: [0, 0, 10], zoom }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[6, 6, 6]} intensity={1.0} />
          <pointLight position={[-6, -4, -4]} intensity={0.35} color="#42BFFF" />
          {!reducedMotion && <Stars radius={60} depth={40} count={1500} factor={3} saturation={0} fade speed={0.2} />}
          <PlanetScene
            body={body}
            points={points}
            reducedMotion={reducedMotion}
            onHover={onHover}
            onClickPoint={onClickPoint}
            hoveredId={hoveredId}
            portalRef={overlayRef}
          />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            target={[initialCamera.x || 0, initialCamera.y || 0, 0]}
            enableRotate={false}
            enablePan
            enableZoom
            zoomSpeed={0.8}
            panSpeed={0.8}
            minZoom={0.4}
            maxZoom={6}
            onChange={handleChange}
          />
        </Canvas>
      </CanvasErrorBoundary>
      <div ref={overlayRef} className="planet-html-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
    </div>
  );
}