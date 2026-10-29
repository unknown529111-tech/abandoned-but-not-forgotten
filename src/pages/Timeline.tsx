// Phase 6 — Timeline: horizontal timeline (desktop) with points (year above,
// month + name on hover), click -> Equipment Detail, back to start button.
// Mobile: vertical list with usable touch targets. Sorted by launch date;
// equipment without launchDate excluded (no fabrication).
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import type { Equipment } from '../types';
import equipmentData from '../data/equipment.json';
import TimelinePoint from '../components/timeline/TimelinePoint';
import TimelineMobileList from '../components/timeline/TimelineMobileList';
import '../styles/timeline.css';

const allEquipment = equipmentData as Equipment[];

// Equipment with a documented launch date, sorted ascending by launch date.
const timelineItems: Equipment[] = allEquipment
  .filter((e) => typeof e.launchDate === 'string' && e.launchDate.length > 0)
  .slice()
  .sort((a, b) => (a.launchDate as string).localeCompare(b.launchDate as string));

export default function TimelinePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = useAppStore((s) => s.locale);

  const lang: 'en' | 'ar' = (locale || i18n.language || 'en').startsWith('ar')
    ? 'ar'
    : 'en';

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = useMemo(
    () => timelineItems.find((e) => e.id === hoveredId) ?? null,
    [hoveredId],
  );

  const hoverMonth = hovered
    ? new Date(hovered.launchDate as string).toLocaleString(
        lang === 'ar' ? 'ar' : 'en',
        { month: 'long' },
      )
    : '';
  const hoverYear = hovered ? (hovered.launchDate as string).slice(0, 4) : '';

  return (
    <div className="timeline-page motion-page-enter" id="main">
      <header className="timeline-toolbar">
        <button
          type="button"
          className="timeline-back motion-back"
          onClick={() => navigate('/')}
          aria-label="Back to solar system"
        >
          ← {t('backSolar')}
        </button>
        <h1 className="timeline-title">Timeline</h1>
        <span className="timeline-count">
          {timelineItems.length} missions
        </span>
      </header>

      <main className="timeline-main">
        {/* Desktop: horizontal scrollable timeline */}
        <section className="timeline-desktop" aria-label="Timeline">
          <div className="timeline-track-wrap">
            <ul className="timeline-track" role="list">
              {timelineItems.map((item, i) => (
                <TimelinePoint
                  key={item.id}
                  item={item}
                  index={i}
                  lang={lang}
                  hovered={hoveredId === item.id}
                  onHover={setHoveredId}
                  onClick={(id) => navigate(`/equipment/${id}`)}
                />
              ))}
            </ul>
          </div>

          {hovered && (
            <div className="timeline-tooltip motion-tooltip" role="tooltip">
              <span className="timeline-tooltip__month">
                {hoverMonth} {hoverYear}
              </span>
              <span className="timeline-tooltip__sep">—</span>
              <span className="timeline-tooltip__name">{hovered.name[lang]}</span>
            </div>
          )}
        </section>

        {/* Mobile: vertical list */}
        <section className="timeline-mobile" aria-label="Timeline list">
          <TimelineMobileList items={timelineItems} lang={lang} />
        </section>
      </main>
    </div>
  );
}

export { TimelinePage };
