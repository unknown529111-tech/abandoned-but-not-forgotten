// Phase 6 — Timeline: horizontal timeline (desktop) with points (year above,
// month + name on hover), click -> Equipment Detail, back to start button.
// Mobile: vertical list with usable touch targets. Sorted by launch date;
// equipment without launchDate excluded (no fabrication).
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import bodiesData from '../data/bodies.json';
import equipmentData from '../data/equipment.json';
import TimelinePoint from '../components/timeline/TimelinePoint';
import TimelineMobileList from '../components/timeline/TimelineMobileList';
import '../styles/timeline.css';
const allEquipment = equipmentData;
const bodies = bodiesData;
// Equipment with a documented launch date, sorted ascending by launch date.
const timelineItems = allEquipment
    .filter((e) => typeof e.launchDate === 'string' && e.launchDate.length > 0)
    .slice()
    .sort((a, b) => a.launchDate.localeCompare(b.launchDate));
export default function TimelinePage() {
    const navigate = useNavigate();
    const { bodyId } = useParams();
    const { t, i18n } = useTranslation();
    const locale = useAppStore((s) => s.locale);
    const lang = (locale || i18n.language || 'en').startsWith('ar')
        ? 'ar'
        : 'en';
    const [filterBody, setFilterBody] = useState(bodyId ?? null);
    const [hoveredId, setHoveredId] = useState(null);
    const filteredItems = useMemo(() => {
        if (!filterBody)
            return timelineItems;
        return timelineItems.filter((e) => e.bodyId === filterBody);
    }, [filterBody]);
    const hovered = useMemo(() => filteredItems.find((e) => e.id === hoveredId) ?? null, [filteredItems, hoveredId]);
    const hoverMonth = hovered
        ? new Date(hovered.launchDate).toLocaleString(lang === 'ar' ? 'ar' : 'en', { month: 'long' })
        : '';
    const hoverYear = hovered ? hovered.launchDate.slice(0, 4) : '';
    return (<div className="timeline-page motion-page-enter" id="main">
      <header className="timeline-toolbar">
        <button type="button" className="timeline-back motion-back" onClick={() => navigate(filterBody ? `/planet/${filterBody}` : '/')} aria-label="Back">
          ← {t('backSolar')}
        </button>
        <h1 className="timeline-title">Timeline{filterBody ? ` — ${bodies.find(b => b.id === filterBody)?.name[lang] ?? filterBody}` : ''}</h1>
        <span className="timeline-count">
          {filteredItems.length} missions
        </span>
      </header>

      {/* Body filter — only show when viewing all */}
      {!filterBody && (<div className="timeline-filter" style={{ display: 'flex', gap: '8px', padding: '8px 16px', flexWrap: 'wrap' }}>
          <button type="button" className={`solar-strip__btn ${!filterBody ? 'solar-strip__btn--active' : ''}`} onClick={() => setFilterBody(null)}>
            All
          </button>
          {bodies.map((b) => {
                const count = timelineItems.filter((e) => e.bodyId === b.id).length;
                if (count === 0)
                    return null;
                return (<button key={b.id} type="button" className={`solar-strip__btn ${filterBody === b.id ? 'solar-strip__btn--active' : ''}`} onClick={() => setFilterBody(b.id)}>
                {b.name[lang]} ({count})
              </button>);
            })}
        </div>)}

      <main className="timeline-main">
        {/* Desktop: horizontal scrollable timeline */}
        <section className="timeline-desktop" aria-label="Timeline">
          <div className="timeline-track-wrap">
            <ul className="timeline-track" role="list">
              {filteredItems.map((item, i) => (<TimelinePoint key={item.id} item={item} index={i} lang={lang} hovered={hoveredId === item.id} onHover={setHoveredId} onClick={(id) => navigate(`/equipment/${id}`)}/>))}
            </ul>
          </div>

          {hovered && (<div className="timeline-tooltip motion-tooltip" role="tooltip">
              <span className="timeline-tooltip__month">
                {hoverMonth} {hoverYear}
              </span>
              <span className="timeline-tooltip__sep">—</span>
              <span className="timeline-tooltip__name">{hovered.name[lang]}</span>
            </div>)}
        </section>

        {/* Mobile: vertical list */}
        <section className="timeline-mobile" aria-label="Timeline list">
          <TimelineMobileList items={filteredItems} lang={lang}/>
        </section>
      </main>
    </div>);
}
export { TimelinePage };
