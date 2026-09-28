import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import FloorTabs from './FloorTabs'
import MapMarker from './MapMarker'

// Floor plans live in a 1000x640 space. The view is a centre point plus the
// number of map units across the lens, so the whole plan fits in the circle.
const W = 1000
const H = 640
const HOME = { cx: W / 2, cy: H / 2, w: 1100 }
const MIN_W = 250
const MAX_W = 1600

const clampView = ({ cx, cy, w }) => ({
  w: Math.min(MAX_W, Math.max(MIN_W, w)),
  cx: Math.min(W, Math.max(0, cx)),
  cy: Math.min(H, Math.max(0, cy)),
})

// Zoom `v` by `factor`, keeping map point (px, py) fixed on screen.
const zoomAt = (v, factor, px = v.cx, py = v.cy) => {
  const w = Math.min(MAX_W, Math.max(MIN_W, v.w * factor))
  const f = w / v.w
  return clampView({ w, cx: px - (px - v.cx) * f, cy: py - (py - v.cy) * f })
}

const viewBoxOf = (v, box) => {
  const h = (v.w * box.h) / box.w
  return { x: v.cx - v.w / 2, y: v.cy - h / 2, w: v.w, h }
}

const ARROW = {
  up: 'M0 -16 L14 2 H5 V14 H-5 V2 H-14 Z',
  down: 'M0 16 L14 -2 H5 V-14 H-5 V-2 H-14 Z',
  right: 'M16 0 L-2 14 V5 H-14 V-5 H-2 V-14 Z',
  left: 'M-16 0 L2 14 V5 H14 V-5 H2 V-14 Z',
}

export default function MapViewer({
  palaceName,
  floors,
  floor,
  markers,
  floorCounts,
  selectedId,
  focusRequest,
  onSelect,
  onFloorChange,
  onOpenLegend,
}) {
  const rootRef = useRef(null)
  const svgRef = useRef(null)
  const [view, setView] = useState(HOME)
  const [box, setBox] = useState({ w: 600, h: 600 })
  const [hoverId, setHoverId] = useState(null)
  const viewRef = useRef(view)
  const boxRef = useRef(box)
  const drag = useRef(null)

  useLayoutEffect(() => {
    viewRef.current = view
    boxRef.current = box
  })

  const vb = viewBoxOf(view, box)
  // SVG units per screen pixel: markers use it to keep the same size on screen.
  const k = (vb.w / box.w) * 0.75
  const hovered = markers.find((m) => m.id === hoverId)

  const tweenView = (target, duration = 0.6) => {
    const next = clampView(target)
    const proxy = { ...viewRef.current }
    gsap.to(proxy, {
      ...next,
      duration: reducedMotion() ? 0 : duration,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: () => setView({ ...proxy }),
    })
  }

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width && height) setBox({ w: width, h: height })
    })
    ro.observe(svgRef.current)
    return () => ro.disconnect()
  }, [])

  // Wheel zoom around the cursor (needs a non-passive listener).
  useEffect(() => {
    const svg = svgRef.current
    const onWheel = (e) => {
      e.preventDefault()
      const rect = svg.getBoundingClientRect()
      const b = viewBoxOf(viewRef.current, boxRef.current)
      const px = b.x + ((e.clientX - rect.left) / rect.width) * b.w
      const py = b.y + ((e.clientY - rect.top) / rect.height) * b.h
      setView(zoomAt(viewRef.current, e.deltaY > 0 ? 1.12 : 1 / 1.12, px, py))
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [])

  // "View on map": centre and zoom in on a marker.
  useEffect(() => {
    if (!focusRequest) return
    const m = markers.find((mk) => mk.id === focusRequest.id)
    if (m) tweenView({ cx: m.x, cy: m.y, w: 520 }, 0.8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest])

  // Floor change: red slash wipe, the floor plan spins in and the markers pop in.
  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap
        .timeline()
        .fromTo(
          '.map-slash',
          { xPercent: -130, autoAlpha: 1 },
          { xPercent: 130, duration: 0.6, ease: 'power3.inOut' },
        )
        .set('.map-slash', { autoAlpha: 0 })
        .fromTo(
          '.map-layer',
          { autoAlpha: 0, scale: 0.9, rotate: -4, transformOrigin: '50% 50%' },
          { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.6)' },
          0.18,
        )
        .fromTo(
          '.map-title__floor',
          { autoAlpha: 0, x: -40 },
          { autoAlpha: 1, x: 0, duration: 0.35, ease: 'back.out(2)' },
          0.25,
        )
        .fromTo(
          '.map-marker__inner',
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, duration: 0.45, ease: 'back.out(3)', stagger: 0.035 },
          0.4,
        )
    },
    { scope: rootRef, dependencies: [floor.id] },
  )

  // Markers that appear because a filter was switched on pop in too.
  const knownIds = useRef(new Set())
  useGSAP(
    () => {
      const fresh = markers.filter((m) => !knownIds.current.has(m.id))
      knownIds.current = new Set(markers.map((m) => m.id))
      if (reducedMotion() || !fresh.length) return
      const els = fresh
        .map((m) => rootRef.current.querySelector(`[data-id="${m.id}"] .map-marker__inner`))
        .filter(Boolean)
      gsap.fromTo(
        els,
        { scale: 0, rotate: -90, transformOrigin: '50% 50%' },
        { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.03 },
      )
    },
    { scope: rootRef, dependencies: [markers] },
  )

  // Pulse ring around the selected marker.
  useGSAP(
    () => {
      if (!selectedId || reducedMotion()) return
      gsap.fromTo(
        '.map-marker__pulse',
        { attr: { r: 20 }, opacity: 1 },
        { attr: { r: 40 }, opacity: 0, duration: 1.1, ease: 'power2.out', repeat: -1 },
      )
    },
    { scope: rootRef, dependencies: [selectedId, floor.id] },
  )

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    drag.current = { sx: e.clientX, sy: e.clientY, view: viewRef.current, moved: false }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.hypot(dx, dy) < 4) return
    d.moved = true
    const scale = d.view.w / svgRef.current.getBoundingClientRect().width
    setView(clampView({ ...d.view, cx: d.view.cx - dx * scale, cy: d.view.cy - dy * scale }))
  }
  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) onSelect(null)
    drag.current = null
  }

  const zoomButton = (factor) => tweenView(zoomAt(viewRef.current, factor), 0.35)

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else rootRef.current.requestFullscreen?.()
  }

  const goFloor = (id) => {
    setView(HOME)
    onFloorChange(id)
  }

  const shapes = floor.shapes
  return (
    <section className="panel map-viewer" ref={rootRef} data-anim="map" aria-label="Palace map">
      <div className="map-floor-bg" aria-hidden="true" />

      <div className="map-title">
        <span className="map-title__palace">{palaceName}</span>
        <span className="map-title__floor">{floor.name}</span>
      </div>

      <FloorTabs floors={floors} current={floor.id} counts={floorCounts} onChange={goFloor} />

      <div className="map-stage">
        <div className="map-lens">
          <svg
            ref={svgRef}
            className="map-svg"
            viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (drag.current = null)}
          >
            <g className="map-layer">
              {/* Outline pass first, then fills on top, so touching shapes merge into one wall. */}
              <g className="map-outline">
                {shapes.map((s, i) => (
                  <rect key={i} x={s.rect[0]} y={s.rect[1]} width={s.rect[2]} height={s.rect[3]} />
                ))}
              </g>
              <g>
                {shapes.map((s, i) => (
                  <rect
                    key={i}
                    className={`map-shape map-shape--${s.kind ?? 'room'}`}
                    x={s.rect[0]}
                    y={s.rect[1]}
                    width={s.rect[2]}
                    height={s.rect[3]}
                  />
                ))}
              </g>
              {/* Inner trim line on rooms, like the in-game map. */}
              <g className="map-trim">
                {shapes
                  .filter((s) => !s.kind && s.rect[2] > 60 && s.rect[3] > 60)
                  .map((s, i) => (
                    <rect key={i} x={s.rect[0] + 9} y={s.rect[1] + 9} width={s.rect[2] - 18} height={s.rect[3] - 18} />
                  ))}
              </g>
              {floor.doors?.map(([x, y, w, h], i) => (
                <rect key={i} className="map-door" x={x} y={y} width={w} height={h} />
              ))}
              {shapes.map(
                (s, i) =>
                  s.label && (
                    <text
                      key={i}
                      className="map-label"
                      x={s.rect[0] + s.rect[2] / 2}
                      y={s.rect[1] + s.rect[3] - 16}
                      textAnchor="middle"
                    >
                      {s.label}
                    </text>
                  ),
              )}
              {floor.connectors.map((c) => (
                <g
                  key={c.to}
                  className="map-connector"
                  transform={`translate(${c.x} ${c.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to ${c.label}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => goFloor(c.to)}
                  onKeyDown={(e) => e.key === 'Enter' && goFloor(c.to)}
                >
                  <path d={ARROW[c.dir]} />
                  <text y={c.dir === 'up' ? 32 : -22} textAnchor="middle">
                    {c.label}
                  </text>
                </g>
              ))}
            </g>

            <g className="map-markers">
              {markers.map((m) => (
                <MapMarker
                  key={m.id}
                  marker={m}
                  k={k}
                  selected={m.id === selectedId}
                  onSelect={onSelect}
                  onHover={setHoverId}
                />
              ))}
            </g>

            {hovered && (
              <g
                className="map-tooltip"
                transform={`translate(${hovered.x} ${hovered.y - 26 * k}) scale(${k})`}
                pointerEvents="none"
              >
                <rect x={-hovered.name.length * 4.6 - 12} y={-30} width={hovered.name.length * 9.2 + 24} height={26} />
                <text y={-12} textAnchor="middle">
                  {hovered.name}
                </text>
              </g>
            )}
          </svg>
          <div className="map-slash" aria-hidden="true" />
        </div>
      </div>

      <div className="map-controls">
        <button type="button" aria-label="Zoom in" onClick={() => zoomButton(0.7)}>
          +
        </button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomButton(1 / 0.7)}>
          −
        </button>
        <button type="button" aria-label="Reset view" onClick={() => tweenView(HOME)}>
          ⟲
        </button>
        <button type="button" aria-label="Fullscreen" onClick={toggleFullscreen}>
          ⛶
        </button>
      </div>

      <button type="button" className="p5-button map-legend-btn" onClick={onOpenLegend}>
        Legend
      </button>
    </section>
  )
}
