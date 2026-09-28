import MarkerGlyph from './MarkerGlyph'

// The map badge as a standalone icon for HTML (filters, legend, info panel).
export default function MarkerIcon({ type, tint, size = 26 }) {
  return (
    <svg className="marker-icon" width={size} height={size} viewBox="-20 -20 42 42" aria-hidden="true">
      <MarkerGlyph type={type} tint={tint} />
    </svg>
  )
}
