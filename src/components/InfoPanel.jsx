import { useRef, useState } from 'react'
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

const TABS = [
  { id: 'boss', label: 'Boss' },
  { id: 'mini', label: 'Mini-Bosses' },
  { id: 'personas', label: 'Personas' },
  { id: 'story', label: 'Story' },
  { id: 'party', label: 'Party' },
]

const statLine = (b) =>
  [b.level && `Lv ${b.level}`, b.hp && `${b.hp} HP`, b.sp && `${b.sp} SP`].filter(Boolean).join(' · ')

function BossTab({ boss }) {
  if (!boss) return <p className="tab-empty">No boss in the database yet.</p>
  return (
    <>
      <div className="boss-card">
        <ImageSlot className="boss-card__image" src={boss.image} alt={boss.name} position="center 15%" />
        <div>
          <strong>{boss.name}</strong>
          {boss.persona && <span> ({boss.persona})</span>}
          <p className="boss-card__stats">{statLine(boss)}</p>
          {boss.weak && <p className="boss-card__weak">Weak: {boss.weak}</p>}
        </div>
      </div>
      {boss.skills && <p className="boss-card__line">Skills: {boss.skills}</p>}
      {boss.rewards && <p className="boss-card__line">Rewards: {boss.rewards}</p>}
      {boss.description && <p className="boss-card__line">{boss.description}</p>}
    </>
  )
}

function MiniBossTab({ bosses }) {
  if (!bosses.length) return <p className="tab-empty">No mini-bosses in the database yet.</p>
  return (
    <ul className="mini-bosses">
      {bosses.map((b) => (
        <li key={b.slug}>
          <span>
            <strong>{b.name}</strong>
            {b.persona && ` (${b.persona})`}
          </span>
          <span className="mini-bosses__stats">
            {[statLine(b), b.weak && b.weak !== 'None' && `Weak: ${b.weak}`].filter(Boolean).join(' · ')}
          </span>
          {b.skills && <span className="mini-bosses__line">Skills: {b.skills}</span>}
          {b.rewards && <span className="mini-bosses__line">Drops: {b.rewards}</span>}
          {b.description && <span className="mini-bosses__line">{b.description}</span>}
        </li>
      ))}
    </ul>
  )
}

function PersonasTab({ enemies }) {
  if (!enemies.length) return <p className="tab-empty">No Personas in the database yet.</p>
  return (
    <table className="enemy-table">
      <thead>
        <tr>
          <th>Persona</th>
          <th>Lv</th>
          <th>Weak</th>
        </tr>
      </thead>
      <tbody>
        {[...enemies]
          .sort((a, b) => (a.level ?? 99) - (b.level ?? 99))
          .map((s) => (
            <tr key={s.slug}>
              <td>
                {s.name}
                <span className="enemy-table__arcana">
                  {[s.arcana, s.personality].filter(Boolean).join(' · ')}
                </span>
                {s.drops && <span className="enemy-table__drops">Drops: {s.drops}</span>}
              </td>
              <td>{s.level ?? '–'}</td>
              <td className="enemy-table__weak">{s.weak ?? '–'}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}

function StoryTab({ route, areaName, onGoTo }) {
  if (!route.length) return <p className="tab-empty">No story steps in the database yet.</p>
  return (
    <ol className="story-route">
      {route.map((r) => (
        <li key={r.area}>
          <span className="story-route__area">{areaName[r.area]}</span>
          <span className="story-route__steps">
            {r.steps.map((m) => (
              <button key={m.id} type="button" onClick={() => onGoTo(m)} aria-label={m.name} title={m.name}>
                {m.step}
              </button>
            ))}
          </span>
        </li>
      ))}
    </ol>
  )
}

function PartyTab({ party }) {
  const members = list(party).map((entry) => {
    const m = entry.match(/^(.*?)\s*\((.*)\)$/)
    return m ? { name: m[1], persona: m[2] } : { name: entry, persona: null }
  })
  if (!members.length) return <p className="tab-empty">No party info in the database yet.</p>
  return (
    <ul className="party-list">
      {members.map((m) => (
        <li key={m.name}>
          <span className="party-list__name">{m.name}</span>
          {m.persona && <span className="party-list__persona">{m.persona}</span>}
        </li>
      ))}
    </ul>
  )
}

function PalaceOverview({ palace, areas, story, onGoTo }) {
  const [tab, setTab] = useState('boss')
  const tabRef = useRef(null)
  const areaName = Object.fromEntries(areas.map((a) => [a.slug, a.name]))
  // Story route grouped per map, in walking order.
  const route = []
  for (const m of story.filter((s) => s.subStep == null)) {
    const last = route.at(-1)
    if (last?.area === m.area) last.steps.push(m)
    else route.push({ area: m.area, steps: [m] })
  }
  const ruler = palace.bosses.find((b) => b.isRuler) ?? null
  const miniBosses = palace.bosses.filter((b) => b !== ruler)

  // Switching tabs: the new content slides in like a card being dealt.
  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap.fromTo(
        tabRef.current,
        { x: 40, autoAlpha: 0, skewX: -6 },
        { x: 0, autoAlpha: 1, skewX: 0, duration: 0.3, ease: 'back.out(1.6)' },
      )
    },
    { dependencies: [tab] },
  )

  return (
    <>
      <div className="info-card__head">
        <h2 className="info-card__title">Palace Intel</h2>
      </div>
      <ImageSlot className="info-card__image intel-banner" src={palace.banner} alt={palace.name} />
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

      <div className="intel-tabs" role="tablist" aria-label="Palace intel">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`intel-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="intel-panel" role="tabpanel" ref={tabRef}>
        {tab === 'boss' && <BossTab boss={ruler} />}
        {tab === 'mini' && <MiniBossTab bosses={miniBosses} />}
        {tab === 'personas' && <PersonasTab enemies={palace.enemies} />}
        {tab === 'story' && <StoryTab route={route} areaName={areaName} onGoTo={onGoTo} />}
        {tab === 'party' && <PartyTab party={palace.party} />}
      </div>

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
