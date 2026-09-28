import { MARKER_TYPES } from '../../data/markerTypes'

// Round badge with the category icon, usable in HTML (filters, legend, info).
export default function MarkerIcon({ type, size = 26 }) {
  const t = MARKER_TYPES[type]
  return (
    <svg className="marker-icon" width={size} height={size} viewBox="-2 -2 28 28" aria-hidden="true">
      <circle cx="12" cy="12" r="12.5" fill="#0b0b0b" stroke={t.color} strokeWidth="2" />
      <g transform="translate(5 5) scale(0.58)">
        <path d={t.icon} fill={t.color} fillRule="evenodd" />
      </g>
    </svg>
  )
}
