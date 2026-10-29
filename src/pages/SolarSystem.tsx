// src/pages/SolarSystem.tsx
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import type { Body, Equipment } from '../types';
import bodiesData from '../data/bodies.json';
import equipmentData from '../data/equipment.json';
import '../styles/solar.css';

const SolarCanvas = lazy(() => import('../components/solar/SolarCanvas'));

const bodies = (bodiesData as Body[]).slice().sort((a, b) => a.orbitOrder - b.orbitOrder);
const allEquipment = equipmentData as Equipment[];

export default function SolarSystem() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = useAppStore((s) => s.locale);
  const setSelectedBody = useAppStore((s) => s.setSelectedBody);
  const storedSelected = useAppStore((s) => s.selectedBodyId);

  const [index, setIndex] = useState<number>(() => {
    if (storedSelected) {
      const i = bodies.findIndex((b) => b.id === storedSelected);
      if (i >= 0) return i;
    }
    return 0;
  });

  const [show3D, setShow3D] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setShow3D(true), 2000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const id = bodies[index]?.id ?? null;
    setSelectedBody(id);
  }, [index, setSelectedBody]);

  const go = (delta: number) => {
    setIndex((i) => Math.max(0, Math.min(bodies.length - 1, i + delta)));
  };
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(bodies.length - 1, i)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const dragStart = useRef<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const THRESHOLD = 40;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) > THRESHOLD) {
      if (dx < 0) go(1);
      else go(-1);
    }
    dragStart.current = null;
  };
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStart.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    if (Math.abs(dx) > THRESHOLD) {
      if (dx < 0) go(1);
      else go(-1);
    }
    touchStart.current = null;
  };

  const selected = bodies[index];
  const lang = (locale || i18n.language || 'en').startsWith('ar') ? 'ar' : 'en';

  const eqCount = selected ? allEquipment.filter((e) => e.bodyId === selected.id).length : 0;
  const withLaunch = selected
    ? allEquipment.filter((e) => e.bodyId === selected.id && e.launchDate).length
    : 0;

  return (
    <div className="solar-page motion-page-enter" id="main">
      <div className="solar-hero">
        <h1 className="solar-hero__title">
          Abandoned <span className="accent">but not forgotten</span>
        </h1>
        <p className="solar-hero__tagline">
          // interactive space exploration archive — documented equipment only
        </p>
      </div>

      <div
        className="solar-stage"
        role="region"
        aria-label="Solar system carousel"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {show3D ? (
          <Suspense fallback={<div className="solar-loading">Loading 3D scene…</div>}>
            <SolarCanvas bodies={bodies} selectedIndex={index} reducedMotion={reducedMotion} />
          </Suspense>
        ) : (
          <div className="solar-loading" aria-hidden="true">Preparing scene…</div>
        )}
      </div>
      <div className="solar-hint">Drag, swipe, or use ← →</div>

      <div className="solar-ui">
        <h2 className="solar-name" aria-live="polite">{selected ? selected.name[lang] : ''}</h2>
        {selected && (
          <div className="solar-stats" aria-label="Selected body stats">
            <div>
              <span className="solar-stats__label">Type</span>
              <span className="solar-stats__value">{selected.type}</span>
            </div>
            <div>
              <span className="solar-stats__label">Equipment</span>
              <span className="solar-stats__value">{eqCount}</span>
            </div>
            <div>
              <span className="solar-stats__label">Documented</span>
              <span className="solar-stats__value">{withLaunch}</span>
            </div>
          </div>
        )}
        <div className="solar-actions">
          <button
            type="button"
            className="solar-btn solar-btn--primary"
            onClick={() => selected && navigate(`/planet/${selected.id}`)}
            disabled={!selected}
          >
            Explore!
          </button>
          <button
            type="button"
            className="solar-btn"
            onClick={() => navigate('/timeline')}
          >
            View Timeline
          </button>
        </div>
      </div>

      <nav className="solar-strip" aria-label="Quick navigation">
        {bodies.map((b, i) => (
          <button
            key={b.id}
            type="button"
            className={`solar-strip__btn ${i === index ? 'solar-strip__btn--active' : ''}`}
            onClick={() => goTo(i)}
          >
            {b.name.en}
          </button>
        ))}
      </nav>
    </div>
  );
}