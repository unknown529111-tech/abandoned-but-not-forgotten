// src/components/planet/PlanetCanvas.tsx
// Lazy-loaded 3D canvas for the Planet Explorer. Orthographic pan/zoom camera,
// procedural planet surface texture, equipment point markers.
import { useRef, useEffect, Component, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import PlanetScene from './PlanetScene';
import PlanetFallback from './PlanetFallback';
// Minimal error boundary so a WebGL failure falls back to a static image.
class CanvasErrorBoundary extends Component {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}
export default function PlanetCanvas({ body, points, reducedMotion, initialCamera, onCameraChange, onHover, onClickPoint, hoveredId, interactive = true, }) {
    const controlsRef = useRef(null);
    const overlayRef = useRef(null);
    const handleChange = () => {
        const controls = controlsRef.current;
        if (!controls)
            return;
        const cam = controls.object;
        onCameraChange({ x: controls.target.x, y: controls.target.y, zoom: cam.zoom || 1 });
    };
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls)
            return;
        controls.target.set(0, 0, 0);
        const cam = controls.object;
        cam.zoom = 1;
        cam.updateProjectionMatrix();
        controls.update();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<div className="planet-canvas-wrap" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px', overflow: 'hidden', maxWidth: '100vw' }}>
      <CanvasErrorBoundary fallback={<PlanetFallback body={body}/>}>
        <Canvas className="planet-canvas" orthographic frameloop="always" camera={{ position: [0, 0, 10], left: -3, right: 3, top: 3, bottom: -3, near: 0.1, far: 100, zoom: 1 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={['#000000']}/>
          <ambientLight intensity={0.8}/>
          <directionalLight position={[6, 6, 6]} intensity={1.5}/>
          {/* Removed blue point light — it produced a "lightning ring" glow on
            every planet (limb glow artifact). Clean directional lighting only. */}
          <Suspense fallback={null}>
            <PlanetScene body={body} points={points} reducedMotion={reducedMotion} onHover={onHover} onClickPoint={onClickPoint} hoveredId={hoveredId} portalRef={overlayRef}/>
          </Suspense>
          <OrbitControls ref={controlsRef} makeDefault target={[initialCamera.x || 0, initialCamera.y || 0, 0]} enableRotate={interactive} enablePan={interactive} enableZoom={interactive} zoomSpeed={0.8} panSpeed={0.8} minZoom={0.4} maxZoom={6} touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }} onChange={handleChange}/>
        </Canvas>
      </CanvasErrorBoundary>
      <div ref={overlayRef} className="planet-html-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}/>
    </div>);
}
