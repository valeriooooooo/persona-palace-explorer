import { useMemo, useRef, useState } from 'react'
import { MARKER_TYPE_IDS } from '../data/markerTypes'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import PalaceHeader from './PalaceHeader'
import FilterPanel from './FilterPanel'
import MapViewer from './MapViewer'
import InfoPanel from './InfoPanel'
import Legend from './Legend'

const countBy = (items, key) =>
  items.reduce((acc, it) => ({ ...acc, [it[key]]: (acc[it[key]] ?? 0) + 1 }), {})

export default function PalaceExplorer({ palace, animate, onBack }) {
  const rootRef = useRef(null)
  const [floorId, setFloorId] = useState(palace.startFloor ?? palace.floors[0].id)
  const [active, setActive] = useState(() => new Set(MARKER_TYPE_IDS))
  const [selectedId, setSelectedId] = useState(null)
  const [focusRequest, setFocusRequest] = useState(null)
  const [legendOpen, setLegendOpen] = useState(false)

  const floor = palace.floors.find((f) => f.id === floorId)
  const selected = palace.markers.find((m) => m.id === selectedId) ?? null
  const typeCounts = useMemo(() => countBy(palace.markers, 'type'), [palace])
  const visible = useMemo(() => palace.markers.filter((m) => active.has(m.type)), [palace, active])
  const floorMarkers = useMemo(() => visible.filter((m) => m.floor === floorId), [visible, floorId])
  const floorCounts = useMemo(() => countBy(visible, 'floor'), [visible])

  const toggleType = (id) =>
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const changeFloor = (id) => {
    if (id === floorId) return
    setFloorId(id)
    setSelectedId(null)
  }

  const focusSelected = () => {
    if (!selected) return
    setFloorId(selected.floor)
    setFocusRequest({ id: selected.id, at: Date.now() })
  }

  // Entrance: the title slams in, the panels fly in from the sides.
  useGSAP(
    () => {
      if (!animate || reducedMotion()) return
      gsap
        .timeline({ defaults: { ease: 'power4.out' }, delay: 0.25 })
        .from('.back-btn', { x: -120, autoAlpha: 0, duration: 0.4 })
        .from('[data-anim="title"]', { x: -500, skewX: -30, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.6)' }, '<')
        .from('[data-anim="desc"]', { y: 30, autoAlpha: 0, duration: 0.4 }, '-=0.3')
        .from('[data-anim="ruler"]', { x: 300, rotate: 6, autoAlpha: 0, duration: 0.55, ease: 'back.out(1.4)' }, '<')
        .from('[data-anim="side-left"]', { x: -200, skewY: 4, autoAlpha: 0, duration: 0.5 }, '-=0.35')
        .from('[data-anim="map"]', { y: 80, scale: 0.94, autoAlpha: 0, duration: 0.55 }, '<0.08')
        .from('[data-anim="side-right"]', { x: 200, skewY: -4, autoAlpha: 0, duration: 0.5 }, '<0.08')
    },
    { scope: rootRef, dependencies: [animate] },
  )

  return (
    <div className="explorer-page" ref={rootRef}>
      <button type="button" className="p5-button back-btn" onClick={onBack}>
        ◀ Palaces
      </button>

      <PalaceHeader palace={palace} />

      <main className="explorer">
        <FilterPanel
          active={active}
          counts={typeCounts}
          onToggle={toggleType}
          onSetAll={(on) => setActive(new Set(on ? MARKER_TYPE_IDS : []))}
        />
        <MapViewer
          palaceName={palace.name}
          floors={palace.floors}
          floor={floor}
          markers={floorMarkers}
          floorCounts={floorCounts}
          selectedId={selectedId}
          focusRequest={focusRequest}
          onSelect={setSelectedId}
          onFloorChange={changeFloor}
          onOpenLegend={() => setLegendOpen(true)}
        />
        <InfoPanel
          palace={palace}
          marker={selected}
          floorName={palace.floors.find((f) => f.id === selected?.floor)?.name}
          onClose={() => setSelectedId(null)}
          onFocus={focusSelected}
        />
      </main>

      {legendOpen && <Legend onClose={() => setLegendOpen(false)} />}
    </div>
  )
}
