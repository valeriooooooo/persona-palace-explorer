export default function FloorTabs({ floors, current, counts, onChange }) {
  return (
    <nav className="floor-tabs" aria-label="Floors">
      {floors.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`floor-tab ${f.id === current ? 'is-active' : ''}`}
          aria-pressed={f.id === current}
          onClick={() => onChange(f.id)}
        >
          <span className="floor-tab__label">{f.label}</span>
          {counts[f.id] > 0 && <span className="floor-tab__count">{counts[f.id]}</span>}
        </button>
      ))}
    </nav>
  )
}
