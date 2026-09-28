import { MARKER_TYPES } from '../data/markerTypes'

// A marker in SVG space. `k` keeps the badge the same size on screen at any zoom.
export default function MapMarker({ marker, k, selected, onSelect, onHover }) {
  const t = MARKER_TYPES[marker.type]
  const select = () => onSelect(marker.id)

  return (
    <g
      className={`map-marker ${selected ? 'is-selected' : ''}`}
      data-type={marker.type}
      data-id={marker.id}
      transform={`translate(${marker.x} ${marker.y}) scale(${k})`}
      role="button"
      tabIndex={0}
      aria-label={`${t.singular}: ${marker.name}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        select()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          select()
        }
      }}
      onPointerEnter={() => onHover(marker.id)}
      onPointerLeave={() => onHover(null)}
    >
      <g className="map-marker__inner">
        {selected && <circle className="map-marker__pulse" r="18" fill="none" stroke={t.color} strokeWidth="3" />}
        <circle r="17" fill="#0b0b0b" stroke={selected ? '#f4f4f4' : t.color} strokeWidth="3" />
        <path d={t.icon} transform="translate(-10.8 -10.8) scale(0.9)" fill={t.color} fillRule="evenodd" />
        {marker.locked && (
          <g transform="translate(10 -16)">
            <rect x="-6" y="-2" width="12" height="10" rx="1.5" fill="#f5d90a" stroke="#0b0b0b" strokeWidth="1.5" />
            <path d="M-3.5 -2v-2.5a3.5 3.5 0 0 1 7 0V-2" fill="none" stroke="#f5d90a" strokeWidth="2" />
          </g>
        )}
      </g>
    </g>
  )
}
