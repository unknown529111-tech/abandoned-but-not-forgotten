// src/components/equipment/SimpleView.tsx
// Simple View: name, short description, status.
import type { Equipment } from '../../types';

interface Props {
  equipment: Equipment;
  lang: 'en' | 'ar';
}

export default function SimpleView({ equipment, lang }: Props) {
  return (
    <section className="eq-simple">
      <h2 className="eq-simple__name">{equipment.name[lang]}</h2>
      <p className="eq-simple__desc">{equipment.shortDescription[lang]}</p>
      <span className={`eq-status eq-status--${equipment.status}`}>{equipment.status}</span>
    </section>
  );
}
