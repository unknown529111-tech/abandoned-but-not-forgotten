// src/components/equipment/DetailedView.tsx
// Detailed View: expand/collapse (height+opacity) toggle with story, dates,
// specs table, coords, achievements, sources.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Equipment } from '../../types';

interface Props {
  equipment: Equipment;
  lang: 'en' | 'ar';
  reducedMotion: boolean;
}

export default function DetailedView({ equipment, lang, reducedMotion }: Props) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const dur = reducedMotion ? 0.01 : 0.3;

  return (
    <section className="eq-detailed">
      <button
        type="button"
        className="eq-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? t('showLess') : t('showMore')}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="eq-detailed__body motion-expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: dur, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {equipment.story?.[lang] && (
              <div className="eq-field">
                <h3 className="eq-field__title">Story</h3>
                <p>{equipment.story[lang]}</p>
              </div>
            )}

            {(equipment.launchDate || equipment.arrivalDate || equipment.lastContactDate || equipment.endDate) && (
              <div className="eq-field">
                <h3 className="eq-field__title">Dates</h3>
                <dl className="eq-dates">
                  {equipment.launchDate && (
                    <div className="eq-date">
                      <dt>Launch</dt>
                      <dd>{equipment.launchDate}</dd>
                    </div>
                  )}
                  {equipment.arrivalDate && (
                    <div className="eq-date">
                      <dt>Arrival</dt>
                      <dd>{equipment.arrivalDate}</dd>
                    </div>
                  )}
                  {equipment.lastContactDate && (
                    <div className="eq-date">
                      <dt>Last contact</dt>
                      <dd>{equipment.lastContactDate}</dd>
                    </div>
                  )}
                  {equipment.endDate && (
                    <div className="eq-date">
                      <dt>End</dt>
                      <dd>{equipment.endDate}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {equipment.specs && Object.keys(equipment.specs).length > 0 && (
              <div className="eq-field">
                <h3 className="eq-field__title">Specs</h3>
                <table className="eq-specs">
                  <tbody>
                    {Object.entries(equipment.specs).map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row">{k}</th>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {equipment.coord && (
              <div className="eq-field">
                <h3 className="eq-field__title">Coordinates</h3>
                <p className="font-mono">
                  {equipment.coord.lat}°, {equipment.coord.lon}°
                </p>
                <p className="eq-source">{equipment.coord.source}</p>
              </div>
            )}

            {equipment.achievements?.[lang]?.length ? (
              <div className="eq-field">
                <h3 className="eq-field__title">Achievements</h3>
                <ul>
                  {equipment.achievements[lang].map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {equipment.sources?.length ? (
              <div className="eq-field">
                <h3 className="eq-field__title">Sources</h3>
                <ul className="eq-sources">
                  {equipment.sources.map((s, i) => (
                    <li key={i}>
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
