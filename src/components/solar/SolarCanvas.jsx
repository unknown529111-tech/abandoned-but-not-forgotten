// src/components/solar/SolarCanvas.tsx
// Lazy-loaded 3D canvas for the Solar System landing scene.
import { Canvas } from '@react-three/fiber';
import { useMemo, useRef, useEffect, useState, Suspense } from 'react';
import SolarScene from './SolarScene';
export default function SolarCanvas({ bodies, selectedIndex, reducedMotion }) {
    const dpr = useMemo(() => [1, 2], []);
    const containerRef = useRef(null);
    const [inView, setInView] = useState(true);
    useEffect(() => {
        const el = containerRef.current;
        if (!el || typeof IntersectionObserver === 'undefined')
            return;
        const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (<div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas className="solar-canvas" frameloop={inView ? 'always' : 'never'} camera={{ position: [0, 0, 9], fov: 48 }} dpr={dpr} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#000000']}/>
        <fog attach="fog" args={['#000000', 12, 32]}/>
        <ambientLight intensity={0.35}/>
        <directionalLight position={[6, 6, 6]} intensity={1.1}/>
        <pointLight position={[-6, -4, -4]} intensity={0.4} color="#42BFFF"/>
        <Suspense fallback={null}>
          <SolarScene bodies={bodies} selectedIndex={selectedIndex} reducedMotion={reducedMotion}/>
        </Suspense>
      </Canvas>
    </div>);
}
