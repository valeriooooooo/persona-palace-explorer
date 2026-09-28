import { MARKER_TYPES, MARKER_TYPE_IDS } from '../data/markerTypes'
import MarkerIcon from './ui/MarkerIcon'

export default function FilterPanel({ active, counts, onToggle, onSetAll }) {
  const allOn = active.size === MARKER_TYPE_IDS.length

  return (
    <aside className="panel filters" data-anim="side-left" aria-label="Map filters">
      <h2 className="panel__title">Filters</h2>
      <ul className="filters__list">
        {MARKER_TYPE_IDS.map((id) => (
          <li key={id}>
            <label className={`filter ${active.has(id) ? 'is-on' : ''}`}>
              <input type="checkbox" checked={active.has(id)} onChange={() => onToggle(id)} />
              <span className="filter__box" aria-hidden="true" />
              <MarkerIcon type={id} size={24} />
              <span className="filter__label">{MARKER_TYPES[id].label}</span>
              <span className="filter__count">{counts[id] ?? 0}</span>
            </label>
          </li>
        ))}
      </ul>
      <button type="button" className="p5-button" onClick={() => onSetAll(!allOn)}>
        {allOn ? 'Clear Filters' : 'Show All'}
      </button>
    </aside>
  )
}
