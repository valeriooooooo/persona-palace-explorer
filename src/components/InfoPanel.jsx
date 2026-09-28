import { useRef } from 'react'
import { MARKER_TYPES, SEED_COLORS, markerColor } from '../data/markerTypes'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import ImageSlot from './ui/ImageSlot'
import MarkerIcon from './ui/MarkerIcon'

function Row({ label, value }) {
  return (
    <div className="info-row">
      <dt>{label}</dt>
      <dd>{value || 'None'}</dd>
    </div>
  )
}

function MarkerDetails({ marker, floorName, onClose, onFocus }) {
  const t = MARKER_TYPES[marker.type]
  return (
    <>
      <div className="info-card__head">
        <h2 className="info-card__title">{marker.name}</h2>
        <button type="button" className="info-card__close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </div>
      <ImageSlot
        className="info-card__image"
        src={marker.image}
        alt={marker.name}
        fit={marker.imageFit}
        position={marker.imagePosition}
      />
      <dl className="info-card__rows">
        <div className="info-row">
          <dt>
            <MarkerIcon type={marker.type} tint={markerColor(marker)} size={20} /> Type
          </dt>
          <dd style={{ color: markerColor(marker) }}>
            {marker.locked ? `Locked ${t.singular}` : t.singular}
            {marker.seed && ` · ${marker.seed}`}
          </dd>
        </div>
        <Row label="Location" value={`${marker.location} · ${floorName}`} />
        <Row label="Requires" value={marker.requires} />
        <Row label="Reward" value={marker.reward} />
      </dl>
      <p className="info-card__desc">{marker.description}</p>
      <button type="button" className="p5-button p5-button--light" onClick={onFocus}>
        View on Map
      </button>
    </>
  )
}

function PalaceOverview({ palace }) {
  return (
    <>
      <div className="info-card__head">
        <h2 className="info-card__title">Palace Intel</h2>
      </div>
      <ImageSlot className="info-card__image" src={palace.banner} alt={palace.name} />
      <dl className="info-card__rows">
        <Row label="Treasure" value={palace.treasure} />
        <Row label="Deadline" value={palace.deadline} />
        <Row label="Boss" value={palace.boss} />
        <Row label="Keywords" value={palace.keywords.join(' · ')} />
        <div className="info-row">
          <dt>Will Seeds</dt>
          <dd className="seed-row">
            {Object.entries(SEED_COLORS).map(([name, color]) => (
              <MarkerIcon key={name} type="willSeed" tint={color} size={22} />
            ))}
            → Crystal of {palace.sin}
          </dd>
        </div>
      </dl>
      <h3 className="info-card__sub">Shadows</h3>
      <ul className="shadow-list">
        {palace.shadows.map((s) => (
          <li key={s.name}>
            <span>{s.name}</span>
            <span className="shadow-list__arcana">{s.arcana}</span>
          </li>
        ))}
      </ul>
      <p className="info-card__hint">Select a marker on the map to see its details.</p>
    </>
  )
}

export default function InfoPanel({ palace, marker, floorName, onClose, onFocus }) {
  const ref = useRef(null)

  // New selection: the "calling card" slams in with a small tilt and shake.
  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap
        .timeline()
        .fromTo(
          '.info-card',
          { x: 80, rotate: 4, autoAlpha: 0, skewX: -8 },
          { x: 0, rotate: 0, autoAlpha: 1, skewX: 0, duration: 0.45, ease: 'back.out(1.8)' },
        )
        .fromTo(
          '.info-card__rows > *',
          { x: 30, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.25, stagger: 0.05, ease: 'power2.out' },
          0.15,
        )
    },
    { scope: ref, dependencies: [marker?.id] },
  )

  return (
    <aside className="panel info-panel" ref={ref} data-anim="side-right" aria-live="polite">
      <div className="info-card">
        {marker ? (
          <MarkerDetails marker={marker} floorName={floorName} onClose={onClose} onFocus={onFocus} />
        ) : (
          <PalaceOverview palace={palace} />
        )}
      </div>
    </aside>
  )
}
