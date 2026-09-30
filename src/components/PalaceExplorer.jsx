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
  const [areaSlug, setAreaSlug] = useState(palace.areas[0]?.slug)
  const [active, setActive] = useState(() => new Set(MARKER_TYPE_IDS))
  const [selectedId, setSelectedId] = useState(null)
  const [focusRequest, setFocusRequest] = useState(null)
  const [legendOpen, setLegendOpen] = useState(false)

  const area = palace.areas.find((a) => a.slug === areaSlug)
  const allMarkers = useMemo(() => palace.areas.flatMap((a) => a.markers), [palace])
  const selected = allMarkers.find((m) => m.id === selectedId) ?? null
  const typeCounts = useMemo(() => countBy(allMarkers, 'type'), [allMarkers])
  const areaMarkers = useMemo(
    () => (area ? area.markers.filter((m) => active.has(m.type)) : []),
    [area, active],
  )

  // The story in walking order: area order, then step, then sub-step.
  const story = useMemo(() => {
    const order = Object.fromEntries(palace.areas.map((a) => [a.slug, a.order]))
    return allMarkers
      .filter((m) => m.type === 'story')
      .sort((a, b) => order[a.area] - order[b.area] || a.step - b.step || (a.subStep ?? 0) - (b.subStep ?? 0))
  }, [palace, allMarkers])

  // Maps of the same place on different visits share one entry in the area list.
  const areaGroups = useMemo(() => {
    const groups = []
    for (const a of palace.areas) {
      let g = groups.find((x) => x.name === a.name)
      if (!g) groups.push((g = { key: a.slug, name: a.name, areas: [], storyCount: 0 }))
      g.areas.push(a)
      g.storyCount += a.markers.filter((m) => m.type === 'story' && m.subStep == null).length
    }
    for (const g of groups) g.areas.sort((x, y) => x.visit - y.visit)
    return groups
  }, [palace])

  const toggleType = (id) =>
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const changeArea = (slug) => {
    if (slug === areaSlug) return
    setAreaSlug(slug)
    setSelectedId(null)
  }

  // Open a marker on its own map and zoom in on it.
  const goToMarker = (m) => {
    if (!m) return
    setActive((prev) => (prev.has(m.type) ? prev : new Set([...prev, m.type])))
    setAreaSlug(m.area)
    setSelectedId(m.id)
    setFocusRequest({ id: m.id, at: Date.now() })
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
        {area ? (
          <MapViewer
            palaceName={palace.name}
            areaGroups={areaGroups}
            area={area}
            markers={areaMarkers}
            selectedId={selectedId}
            focusRequest={focusRequest}
            onSelect={setSelectedId}
            onAreaChange={changeArea}
            onOpenLegend={() => setLegendOpen(true)}
          />
        ) : (
          <section className="panel map-viewer map-viewer--empty" data-anim="map">
            <p>No maps in the database yet for this Palace.</p>
          </section>
        )}
        <InfoPanel
          palace={palace}
          marker={selected}
          areas={palace.areas}
          story={story}
          onClose={() => setSelectedId(null)}
          onGoTo={goToMarker}
        />
      </main>

      {legendOpen && <Legend onClose={() => setLegendOpen(false)} />}
    </div>
  )
}
