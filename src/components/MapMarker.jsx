import { MARKER_TYPES, markerColor } from '../data/markerTypes'
import MarkerGlyph from './ui/MarkerGlyph'

// A marker at (x, y) in map-image pixels. `k` keeps the badge the same size on screen at any zoom.
export default function MapMarker({ marker, x, y, k, selected, onSelect, onHover }) {
  const t = MARKER_TYPES[marker.type]
  const select = () => onSelect(marker.id)

  return (
    <g
      className={`map-marker ${selected ? 'is-selected' : ''}`}
      data-type={marker.type}
      data-id={marker.id}
      transform={`translate(${x} ${y}) scale(${k})`}
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
        {selected && <circle className="map-marker__pulse" r="20" fill="none" stroke={markerColor(marker)} strokeWidth="3" />}
        <MarkerGlyph
          type={marker.type}
          tint={markerColor(marker)}
          label={marker.type === 'story' ? (marker.subStep ?? marker.step) : undefined}
          sub={marker.subStep != null}
          selected={selected}
          locked={marker.locked}
        />
      </g>
    </g>
  )
}
