// src/pages/EquipmentDetail.tsx
// Phase 4 — Equipment Detail: 3D model viewer (orbit/zoom/reset) with image
// fallback, Simple View (name/short desc/status), Detailed View expand/collapse
// ("Show more"/"Show less") with story, dates, specs, coords, achievements,
// sources. Back to Planet preserves camera/zoom via useAppStore (planet page
// reads the stored camera on mount).
import { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import bodiesData from '../data/bodies.json';
import equipmentData from '../data/equipment.json';
import SimpleView from '../components/equipment/SimpleView';
import DetailedView from '../components/equipment/DetailedView';
import '../styles/equipment.css';
import '../styles/pdf.css';
const EquipmentViewer = lazy(() => import('../components/equipment/EquipmentViewer'));
const DownloadButton = lazy(() => import('../components/equipment/DownloadButton'));
const bodies = bodiesData;
const allEquipment = equipmentData;
export default function EquipmentDetail() {
    const { equipmentId } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const locale = useAppStore((s) => s.locale);
    const eq = allEquipment.find((e) => e.id === equipmentId) ?? null;
    const body = eq ? bodies.find((b) => b.id === eq.bodyId) ?? null : null;
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const handler = (e) => setReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    const lang = (locale || i18n.language || 'en').startsWith('ar') ? 'ar' : 'en';
    const goBack = () => {
        if (eq)
            navigate(`/planet/${eq.bodyId}`);
        else
            navigate('/');
    };
    return (<div className="eq-page motion-explore" id="main">
      <header className="eq-toolbar">
        <button type="button" className="eq-back motion-back" onClick={goBack} aria-label="Back to planet">
          ← {t('backPlanet')}
        </button>
        <h1 className="eq-title">{eq ? eq.name[lang] : equipmentId}</h1>
      </header>

      <main className="eq-content">
        {!eq ? (<div className="eq-empty">
            <p>Equipment not found.</p>
            <button type="button" className="eq-back" onClick={() => navigate('/')}>
              ← {t('backSolar')}
            </button>
          </div>) : (<>
            <section className="eq-viewer-section" aria-label="3D model viewer">
              <Suspense fallback={<div className="eq-loading">Loading 3D viewer…</div>}>
                <EquipmentViewer equipment={eq} body={body} reducedMotion={reducedMotion}/>
              </Suspense>
            </section>

            <div className="eq-side">
              <SimpleView equipment={eq} lang={lang}/>

              <DetailedView equipment={eq} lang={lang} reducedMotion={reducedMotion}/>

              <section className="eq-field" aria-label="Download equipment file">
                <Suspense fallback={<span className="eq-download eq-download--loading">Preparing PDF…</span>}>
                  <DownloadButton equipment={eq} body={body}/>
                </Suspense>
              </section>
            </div>
          </>)}
      </main>
    </div>);
}
