// src/pages/PlanetExplorer.tsx
// Phase 3 — Planet Explorer: 3D planet surface (pan/zoom), equipment point
// markers (blue dots), hover tooltip, click -> Equipment Detail, Back to
// Solar System preserving camera/zoom via useAppStore.
import { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import type { Body, Equipment } from '../types';
import bodiesData from '../data/bodies.json';
import equipmentData from '../data/equipment.json';
import '../styles/planet.css';

const PlanetCanvas = lazy(() => import('../components/planet/PlanetCanvas'));

const bodies = bodiesData as Body[];
const allEquipment = equipmentData as Equipment[];

export default function PlanetExplorer() {
  const { bodyId } = useParams<{ bodyId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const camera = useAppStore((s) => s.camera);
  const setCamera = useAppStore((s) => s.setCamera);

  const body = bodies.find((b) => b.id === bodyId) ?? null;
  const points = allEquipment.filter((e) => e.bodyId === bodyId);

  const [hovered, setHovered] = useState<Equipment | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const lang = (locale || i18n.language || 'en').startsWith('ar') ? 'ar' : 'en';

  return (
    <div className="planet-page" id="main">
      <header className="planet-toolbar">
        <button
          type="button"
          className="planet-back motion-back"
          onClick={() => navigate('/')}
          aria-label="Back to solar system"
        >
          ← {t('backSolar')}
        </button>
        <h1 className="planet-title">{body ? body.name[lang] : bodyId}</h1>
      </header>

      <div className="planet-stage">
        {body ? (
          <Suspense fallback={<div className="planet-loading">Loading 3D scene…</div>}>
            <PlanetCanvas
              body={body}
              points={points}
              reducedMotion={reducedMotion}
              initialCamera={camera}
              onCameraChange={setCamera}
              onHover={setHovered}
              onClickPoint={(id: string) => navigate(`/equipment/${id}`)}
              hoveredId={hovered?.id ?? null}
            />
          </Suspense>
        ) : (
          <div className="planet-empty">
            <p>Planet not found.</p>
            <button type="button" className="planet-back" onClick={() => navigate('/')}>
              ← {t('backSolar')}
            </button>
          </div>
        )}
      </div>

      {hovered && (
        <div className="planet-tooltip planet-tooltip--global" role="tooltip">
          <span className="planet-tooltip__name">{hovered.name[lang]}</span>
          {hovered.launchDate && (
            <span className="planet-tooltip__date">• {hovered.launchDate}</span>
          )}
        </div>
      )}
    </div>
  );
}