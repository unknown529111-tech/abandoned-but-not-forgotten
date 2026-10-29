// Timeline point marker — year label above a clickable dot.
// Hover/focus surfaces month + name via parent tooltip state.
import type { Equipment } from '../../types';

interface Props {
  item: Equipment;
  lang: 'en' | 'ar';
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

export default function TimelinePoint({ item, lang, hovered, onHover, onClick, index = 0 }: Props & { index?: number }) {
  const launch = item.launchDate as string;
  const year = launch.slice(0, 4);
  const month = new Date(launch).toLocaleString(lang === 'ar' ? 'ar' : 'en', {
    month: 'long',
  });
  const name = item.name[lang];
  return (
    <li className="tl-item" role="listitem" style={{ animationDelay: `${index * 40}ms` }}>
      <button
        type="button"
        className={`tl-point${hovered ? ' tl-point--hover' : ''}`}
        onClick={() => onClick(item.id)}
        onMouseEnter={() => onHover(item.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(item.id)}
        onBlur={() => onHover(null)}
        aria-label={`${month} ${year} — ${name}`}
      >
        <span className="tl-point__year">{year}</span>
        <span className="tl-point__dot" aria-hidden="true" />
      </button>
    </li>
  );
}
