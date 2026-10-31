// src/pages/Home.jsx
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import bodiesData from '../data/bodies.json';
import '../styles/solar.css';

const PlanetCanvas = lazy(() => import('../components/planet/PlanetCanvas'));
const SolarCanvas = lazy(() => import('../components/solar/SolarCanvas'));

const bodies = bodiesData.slice().sort((a, b) => a.orbitOrder - b.orbitOrder);
const earth = bodies.find((b) => b.id === 'earth') || bodies[0];

export default function Home() {
    const navigate = useNavigate();
    const [showSolar, setShowSolar] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const solarRef = useRef(null);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const handler = (e) => setReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const el = solarRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setShowSolar(true);
            },
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div className="home-page" style={{ background: '#000', color: '#fff' }}>
            <section
                className="home-earth"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <Suspense fallback={<div className="solar-loading">Loading…</div>}>
                    <PlanetCanvas body={earth} points={[]} reducedMotion={reducedMotion} />
                </Suspense>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        textAlign: 'center',
                        padding: '0 1rem',
                    }}
                >
                    <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', margin: 0, lineHeight: 1.05 }}>
                        Abandoned but not Forgotten
                    </h1>
                    <p style={{ marginTop: '1rem', opacity: 0.8, maxWidth: '42ch' }}>
                        A map of the bodies we left behind. Scroll to explore the solar system.
                    </p>
                </div>
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        opacity: 0.7,
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}
                >
                    ↓ Scroll
                </div>
            </section>

            <section
                ref={solarRef}
                className="home-solar"
                style={{ minHeight: '100vh', position: 'relative' }}
            >
                {showSolar ? (
                    <Suspense fallback={<div className="solar-loading">Loading…</div>}>
                        <SolarCanvas bodies={bodies} selectedIndex={2} reducedMotion={reducedMotion} />
                    </Suspense>
                ) : (
                    <div className="solar-loading">Loading solar system…</div>
                )}
            </section>
        </div>
    );
}
