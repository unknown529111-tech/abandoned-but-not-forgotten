export default function SimpleView({ equipment, lang }) {
    return (<section className="eq-simple">
      <h2 className="eq-simple__name">{equipment.name[lang]}</h2>
      <p className="eq-simple__desc">{equipment.shortDescription[lang]}</p>
      <span className={`eq-status eq-status--${equipment.status}`}>{equipment.status}</span>
    </section>);
}
