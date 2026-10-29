// Mobile-friendly vertical list of timeline entries (usable touch targets).
import { useNavigate } from 'react-router-dom';
import type { Equipment } from '../../types';

interface Props {
  items: Equipment[];
  lang: 'en' | 'ar';
}

export default function TimelineMobileList({ items, lang }: Props) {
  const navigate = useNavigate();
  return (
    <ul className="tl-mobile-list" role="list">
      {items.map((item) => {
        const launch = item.launchDate as string;
        const year = launch.slice(0, 4);
        const month = new Date(launch).toLocaleString(lang === 'ar' ? 'ar' : 'en', {
          month: 'long',
        });
        return (
          <li key={item.id} role="listitem">
            <button
              type="button"
              className="tl-mobile-item"
              onClick={() => navigate(`/equipment/${item.id}`)}
            >
              <span className="tl-mobile-item__date">
                {month} {year}
              </span>
              <span className="tl-mobile-item__name">{item.name[lang]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
