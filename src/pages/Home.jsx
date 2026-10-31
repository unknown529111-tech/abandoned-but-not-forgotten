// src/pages/Home.jsx
import { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import bodiesData from '../data/bodies.json';
import '../styles/solar.css';

const PlanetCanvas = lazy(() => import('../components/planet/PlanetCanvas'));
const SolarCanvas = lazy(() => import('../components/solar/SolarCanvas'));

const bodies = bodiesData.slice().sort((a, b) => a.orbitOrder - b.orbitOrder);
const earth = bodies.find((b) => b.id === 'earth') || bodies[0];

export default function Home() {
    const navigate = useNavigate();
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const handler = (e) => setReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <div className="home-page" style={{ background: '#05070d', color: '#e8ecf4' }}>
            <section
                className="home-earth"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    background: 'radial-gradient(ellipse at center, #0b1a33 0%, #05070d 70%)',
                }}
            >
                <Suspense fallback={<div className="solar-loading">Loading Earth…</div>}>
                    <PlanetCanvas
                        body={earth}
                        points={[]}
                        reducedMotion={reducedMotion}
                        initialCamera={{ x: 0, y: 0 }}
                        interactive={false}
                        onCameraChange={() => {}}
                        onHover={() => {}}
                        onClickPoint={() => {}}
                        hoveredId={null}
                    />
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
                    }}
                >
                    <h1
                        style={{
                            fontSize: 'clamp(2.25rem, 7vw, 5rem)',
                            margin: 0,
                            lineHeight: 1.0,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 24px rgba(0,0,0,0.6)',
                        }}
                    >
                        Abandoned but not Forgotten
                    </h1>
                    <p
                        style={{
                            marginTop: '1.25rem',
                            opacity: 0.75,
                            maxWidth: '46ch',
                            fontSize: '1.05rem',
                            lineHeight: 1.5,
                        }}
                    >
                        A map of the bodies we left behind. Scroll to explore the solar system.
                    </p>
                </div>
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        bottom: '2.5rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        opacity: 0.6,
                        fontSize: '0.8rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <span>Scroll</span>
                    <span style={{ fontSize: '1.2rem' }}>↓</span>
                </div>
            </section>

            <section
                className="home-solar"
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
