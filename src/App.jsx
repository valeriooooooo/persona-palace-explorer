import { useMemo, useRef, useState } from 'react'
import { kamoshida as palace } from './data/kamoshida'
import { MARKER_TYPE_IDS } from './data/markerTypes'
import { gsap, useGSAP, reducedMotion } from './animations/gsap'
import PalaceHeader from './components/PalaceHeader'
import FilterPanel from './components/FilterPanel'
import MapViewer from './components/MapViewer'
import InfoPanel from './components/InfoPanel'
import Legend from './components/Legend'

const countBy = (items, key) =>
  items.reduce((acc, it) => ({ ...acc, [it[key]]: (acc[it[key]] ?? 0) + 1 }), {})

export default function App() {
  const rootRef = useRef(null)
  const [floorId, setFloorId] = useState('1f')
  const [active, setActive] = useState(() => new Set(MARKER_TYPE_IDS))
  const [selectedId, setSelectedId] = useState(null)
  const [focusRequest, setFocusRequest] = useState(null)
  const [legendOpen, setLegendOpen] = useState(false)

  const floor = palace.floors.find((f) => f.id === floorId)
  const selected = palace.markers.find((m) => m.id === selectedId) ?? null
  const typeCounts = useMemo(() => countBy(palace.markers, 'type'), [])
  const visible = useMemo(() => palace.markers.filter((m) => active.has(m.type)), [active])
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

  // Intro: a red/black slash sweeps the screen, the title slams in, the panels fly in.
  useGSAP(
    () => {
      if (reducedMotion()) {
        gsap.set('.intro', { display: 'none' })
        return
      }
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .fromTo('.intro__stripe', { xPercent: -120, autoAlpha: 1 }, { xPercent: 0, duration: 0.45, stagger: 0.07, ease: 'power3.in' })
        .fromTo('.intro__word', { scale: 3, autoAlpha: 0, rotate: -12 }, { scale: 1, autoAlpha: 1, rotate: -6, duration: 0.35, ease: 'back.out(2)' })
        .to('.intro__stripe', { xPercent: 120, duration: 0.45, stagger: 0.06, ease: 'power3.in' }, '+=0.35')
        .to('.intro__word', { scale: 0.4, autoAlpha: 0, duration: 0.25 }, '<')
        .set('.intro', { display: 'none' })
        .from('[data-anim="title"]', { x: -500, skewX: -30, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.2')
        .from('[data-anim="desc"]', { y: 30, autoAlpha: 0, duration: 0.4 }, '-=0.3')
        .from('[data-anim="ruler"]', { x: 300, rotate: 6, autoAlpha: 0, duration: 0.55, ease: 'back.out(1.4)' }, '<')
        .from('[data-anim="side-left"]', { x: -200, skewY: 4, autoAlpha: 0, duration: 0.5 }, '-=0.35')
        .from('[data-anim="map"]', { y: 80, scale: 0.94, autoAlpha: 0, duration: 0.55 }, '<0.08')
        .from('[data-anim="side-right"]', { x: 200, skewY: -4, autoAlpha: 0, duration: 0.5 }, '<0.08')

      // Idle drift of the background shards.
      gsap.to('.bg-shard', {
        y: 'random(-18, 18)',
        rotate: '+=random(-3, 3)',
        duration: 'random(3, 5)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.4,
      })
    },
    { scope: rootRef },
  )

  return (
    <div className="app" ref={rootRef}>
      <div className="bg" aria-hidden="true">
        <span className="bg-shard bg-shard--1" />
        <span className="bg-shard bg-shard--2" />
        <span className="bg-shard bg-shard--3" />
        <span className="bg-halftone" />
      </div>

      <div className="intro" aria-hidden="true">
        <span className="intro__stripe intro__stripe--red" />
        <span className="intro__stripe intro__stripe--black" />
        <span className="intro__stripe intro__stripe--white" />
        <span className="intro__word">Take Your Heart</span>
      </div>

      <PalaceHeader palace={palace} />

      <main className="explorer">
        <FilterPanel
          active={active}
          counts={typeCounts}
          onToggle={toggleType}
          onSetAll={(on) => setActive(new Set(on ? MARKER_TYPE_IDS : []))}
        />
        <MapViewer
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
          counts={typeCounts}
          onClose={() => setSelectedId(null)}
          onFocus={focusSelected}
        />
      </main>

      <footer className="footer">
        Fan project · Persona 5 Royal © ATLUS / SEGA · Map layouts are simplified schematics
      </footer>

      {legendOpen && <Legend onClose={() => setLegendOpen(false)} />}
    </div>
  )
}
