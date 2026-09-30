import { useRef } from 'react'
import { MARKER_TYPES, SEED_COLORS, markerColor } from '../data/markerTypes'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import ImageSlot from './ui/ImageSlot'
import MarkerIcon from './ui/MarkerIcon'

const NO_INFO = 'No info yet. Add it in Prisma Studio (table Marker) or in the fill-in file.'

// How marker pictures are cropped, per type.
const IMAGE_FIT = { treasure: 'contain' }
const IMAGE_POSITION = { willSeed: 'center 35%' }

const list = (text) => (text ? text.split(',').map((s) => s.trim()).filter(Boolean) : [])
const visitLabel = (visit) => (visit === 2 ? '2nd visit' : visit > 2 ? `visit ${visit}` : null)

function Row({ label, value }) {
  return (
    <div className="info-row">
      <dt>{label}</dt>
      <dd>{value || 'None'}</dd>
    </div>
  )
}

function StoryNav({ marker, story, onGoTo }) {
  const i = story.findIndex((m) => m.id === marker.id)
  return (
    <div className="story-nav">
      <button type="button" className="p5-button" disabled={i <= 0} onClick={() => onGoTo(story[i - 1])}>
        ◀ Prev
      </button>
      <span className="story-nav__count">
        {i + 1} / {story.length}
      </span>
      <button
        type="button"
        className="p5-button"
        disabled={i >= story.length - 1}
        onClick={() => onGoTo(story[i + 1])}
      >
        Next ▶
      </button>
    </div>
  )
}

function MarkerDetails({ marker, area, story, onClose, onGoTo }) {
  const t = MARKER_TYPES[marker.type]
  const isStory = marker.type === 'story'
  const where = [area?.name, visitLabel(area?.visit)].filter(Boolean).join(' · ')
  return (
    <>
      <div className="info-card__head">
        <h2 className="info-card__title">{marker.name}</h2>
        <button type="button" className="info-card__close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </div>
      {marker.image && (
        <ImageSlot
          className="info-card__image"
          src={marker.image}
          alt={marker.name}
          fit={IMAGE_FIT[marker.type]}
          position={IMAGE_POSITION[marker.type]}
        />
      )}
      <dl className="info-card__rows">
        <div className="info-row">
          <dt>
            <MarkerIcon type={marker.type} tint={markerColor(marker)} size={20} /> Type
          </dt>
          <dd style={{ color: markerColor(marker) }}>
            {marker.locked ? `Locked ${t.singular}` : t.singular}
            {marker.seedColor && ` · ${marker.seedColor}`}
            {isStory && ` · step ${marker.step}${marker.subStep != null ? `.${marker.subStep}` : ''}`}
          </dd>
        </div>
        <Row label="Location" value={where} />
        {!isStory && <Row label="Requires" value={marker.requires} />}
        {!isStory && <Row label="Reward" value={marker.reward} />}
      </dl>
      <p className={`info-card__desc ${marker.description ? '' : 'is-empty'}`}>{marker.description || NO_INFO}</p>
      {isStory ? (
        <StoryNav marker={marker} story={story} onGoTo={onGoTo} />
      ) : (
        <button type="button" className="p5-button p5-button--light" onClick={() => onGoTo(marker)}>
          View on Map
        </button>
      )}
    </>
  )
}

function PalaceOverview({ palace, areas, story, onGoTo }) {
  const areaName = Object.fromEntries(areas.map((a) => [a.slug, a.name]))
  const mainSteps = story.filter((m) => m.subStep == null)
  // Story route grouped per map, in walking order.
  const route = []
  for (const m of mainSteps) {
    const last = route.at(-1)
    if (last?.area === m.area) last.steps.push(m)
    else route.push({ area: m.area, steps: [m] })
  }
  const ruler = palace.bosses.find((b) => b.isRuler) ?? palace.bosses[0]
  const miniBosses = palace.bosses.filter((b) => b !== ruler)

  return (
    <>
      <div className="info-card__head">
        <h2 className="info-card__title">Palace Intel</h2>
      </div>
      <ImageSlot className="info-card__image" src={palace.banner} alt={palace.name} />
      <dl className="info-card__rows">
        <Row label="Treasure" value={palace.treasure} />
        <Row label="Deadline" value={palace.deadline} />
        <Row label="Keywords" value={list(palace.keywords).join(' · ')} />
        <div className="info-row">
          <dt>Will Seeds</dt>
          <dd className="seed-row">
            {Object.entries(SEED_COLORS).map(([name, color]) => (
              <MarkerIcon key={name} type="willSeed" tint={color} size={22} />
            ))}
            → {palace.crystal ?? 'Crystal'}
          </dd>
        </div>
      </dl>

      {ruler && (
        <>
          <h3 className="info-card__sub">Boss</h3>
          <div className="boss-card">
            <ImageSlot className="boss-card__image" src={ruler.image} alt={ruler.name} position="center 15%" />
            <div>
              <strong>{ruler.name}</strong>
              {ruler.persona && <span> ({ruler.persona})</span>}
              <p className="boss-card__stats">
                {[ruler.level && `Lv ${ruler.level}`, ruler.hp && `${ruler.hp} HP`, ruler.sp && `${ruler.sp} SP`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {ruler.weak && <p className="boss-card__weak">Weak: {ruler.weak}</p>}
            </div>
          </div>
          {ruler.skills && <p className="boss-card__line">Skills: {ruler.skills}</p>}
          {ruler.rewards && <p className="boss-card__line">Rewards: {ruler.rewards}</p>}
          {ruler.description && <p className="boss-card__line">{ruler.description}</p>}
        </>
      )}

      {miniBosses.length > 0 && (
        <>
          <h3 className="info-card__sub">Mini-bosses</h3>
          <ul className="mini-bosses">
            {miniBosses.map((b) => (
              <li key={b.slug} title={b.description ?? undefined}>
                <span>
                  <strong>{b.name}</strong>
                  {b.persona && ` (${b.persona})`}
                </span>
                <span className="mini-bosses__stats">
                  {[b.hp && `${b.hp} HP`, b.weak && b.weak !== 'None' && `Weak: ${b.weak}`].filter(Boolean).join(' · ')}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {route.length > 0 && (
        <>
          <h3 className="info-card__sub">Story Route</h3>
          <ol className="story-route">
            {route.map((r) => (
              <li key={r.area}>
                <span className="story-route__area">{areaName[r.area]}</span>
                <span className="story-route__steps">
                  {r.steps.map((m) => (
                    <button key={m.id} type="button" onClick={() => onGoTo(m)} aria-label={m.name}>
                      {m.step}
                    </button>
                  ))}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}

      <h3 className="info-card__sub">Shadows</h3>
      <table className="enemy-table">
        <thead>
          <tr>
            <th>Shadow</th>
            <th>Lv</th>
            <th>Weak</th>
          </tr>
        </thead>
        <tbody>
          {[...palace.enemies]
            .sort((a, b) => (a.level ?? 99) - (b.level ?? 99))
            .map((s) => (
              <tr key={s.slug} title={s.drops ? `Drops: ${s.drops}` : undefined}>
                <td>
                  {s.name}
                  <span className="enemy-table__arcana">{s.arcana}</span>
                </td>
                <td>{s.level ?? '–'}</td>
                <td className="enemy-table__weak">{s.weak ?? '–'}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {palace.party && <Row label="Party" value={palace.party} />}
      <p className="info-card__hint">Select a marker on the map to see its details.</p>
      {palace.source && <p className="info-card__source">Info: {palace.source}</p>}
    </>
  )
}

export default function InfoPanel({ palace, marker, areas, story, onClose, onGoTo }) {
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
          <MarkerDetails
            marker={marker}
            area={areas.find((a) => a.slug === marker.area)}
            story={story}
            onClose={onClose}
            onGoTo={onGoTo}
          />
        ) : (
          <PalaceOverview palace={palace} areas={areas} story={story} onGoTo={onGoTo} />
        )}
      </div>
    </aside>
  )
}
