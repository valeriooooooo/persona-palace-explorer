import { MARKER_TYPES } from '../../data/markerTypes'

const BADGE = '-15 -17 17 -14 16 15 -17 13'
const BG = '#0b0b0b'

// P5-style badge (tilted card with a coloured offset shadow), drawn around 0,0.
// Story markers show their number instead of an icon, like the red circles on
// the in-game maps (sub-steps are white, like the white circles).
export default function MarkerGlyph({ type, tint, label, sub = false, selected = false, locked = false }) {
  const t = MARKER_TYPES[type]
  const color = tint ?? t.color
  if (label != null) {
    const fill = sub ? '#f4f4f4' : color
    return (
      <g className="marker-glyph">
        <polygon points={BADGE} transform="translate(4 4)" fill={BG} />
        <polygon points={BADGE} fill={fill} stroke={selected ? BG : '#f4f4f4'} strokeWidth="2.5" strokeLinejoin="round" />
        <text
          y="1"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={sub ? BG : '#f4f4f4'}
          fontFamily="Anton, Impact, sans-serif"
          fontSize={String(label).length > 2 ? 13 : 18}
        >
          {label}
        </text>
      </g>
    )
  }
  return (
    <g className="marker-glyph">
      <polygon points={BADGE} transform="translate(4 4)" fill={color} />
      <polygon points={BADGE} fill={BG} stroke={selected ? '#e60012' : '#f4f4f4'} strokeWidth="2.5" strokeLinejoin="round" />
      <g transform="translate(-10.2 -10.2) scale(0.85)">
        {t.icon.map((part, i) => (
          <path key={i} d={part.d} fill={part.hole ? BG : color} />
        ))}
      </g>
      {locked && (
        <g transform="translate(13 -15)">
          <path d="M-3.5 -1v-2.5a3.5 3.5 0 0 1 7 0V-1" fill="none" stroke="#f5d90a" strokeWidth="2.2" />
          <rect x="-6" y="-2" width="12" height="10" rx="1.5" fill="#f5d90a" stroke={BG} strokeWidth="1.5" />
          <rect x="-1" y="1" width="2" height="4" fill={BG} />
        </g>
      )}
    </g>
  )
}
