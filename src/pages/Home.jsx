// src/pages/Home.jsx
import { useEffect, useState, lazy, Suspense } from 'react';
import bodiesData from '../data/bodies.json';
import '../styles/solar.css';

const EarthZoomCanvas = lazy(() => import('../components/earth/EarthZoomCanvas'));
const SolarCanvas = lazy(() => import('../components/solar/SolarCanvas'));

const bodies = bodiesData.slice().sort((a, b) => a.orbitOrder - b.orbitOrder);

export default function Home() {
    const [reducedMotion, setReducedMotion] = useState(false);
    const [zoom, setZoom] = useState(6);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const handler = (e) => setReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const heroHeight = () => window.innerHeight * 2.5;
        const onScroll = () => {
            const max = heroHeight() - window.innerHeight;
            const p = Math.min(1, Math.max(0, window.scrollY / max));
            setZoom(6 - p * 5.1);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="home-page" style={{ background: '#000', color: '#e8ecf4' }}>
            <section style={{ position: 'relative', height: '250vh', background: '#000' }}>
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        height: '100vh',
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <Suspense fallback={<div className="solar-loading">Loading Earth…</div>}>
                        <EarthZoomCanvas zoom={zoom} reducedMotion={reducedMotion} />
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
                            padding: '0 1.5rem',
                            opacity: Math.max(0, 1 - (6 - zoom) / 3),
                        }}
                    >
                        <h1
                            style={{
                                fontSize: 'clamp(2.25rem, 7vw, 5rem)',
                                margin: 0,
                                lineHeight: 1.0,
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                textShadow: '0 2px 24px rgba(0,0,0,0.8)',
                            }}
                        >
                            Abandoned but not Forgotten
                        </h1>
                        <p
                            style={{
                                marginTop: '1.25rem',
                                opacity: 0.8,
                                maxWidth: '46ch',
                                fontSize: '1.05rem',
                                lineHeight: 1.5,
                            }}
                        >
                            A map of the bodies we left behind. Scroll to explore the solar system.
                        </p>
                    </div>
                </div>
            </section>

            <section
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    background: '#000',
                }}
            >
                <Suspense fallback={<div className="solar-loading">Loading solar system…</div>}>
                    <SolarCanvas bodies={bodies} selectedIndex={2} reducedMotion={reducedMotion} />
                </Suspense>
            </section>
        </div>
    );
}
