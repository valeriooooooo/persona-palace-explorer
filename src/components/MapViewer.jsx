import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import FloorTabs from './FloorTabs'
import MapMarker from './MapMarker'

const W = 1000
const H = 640
const HOME = { x: 0, y: 0, w: W, h: H }
const MIN_W = 250
const MAX_W = 1400

const clampView = ({ x, y, w }) => {
  const cw = Math.min(MAX_W, Math.max(MIN_W, w))
  const ch = (cw * H) / W
  return {
    w: cw,
    h: ch,
    x: Math.min(W - cw * 0.25, Math.max(-cw * 0.75, x)),
    y: Math.min(H - ch * 0.25, Math.max(-ch * 0.75, y)),
  }
}

// Zoom view `v` by `factor`, keeping the point (cx, cy) fixed on screen.
const zoomAt = (v, factor, cx = v.x + v.w / 2, cy = v.y + v.h / 2) => {
  const w = v.w * factor
  return clampView({
    w,
    x: cx - (cx - v.x) * (w / v.w),
    y: cy - (cy - v.y) * (w / v.w),
  })
}

const ARROW = {
  up: 'M0 -16 L14 2 H5 V14 H-5 V2 H-14 Z',
  down: 'M0 16 L14 -2 H5 V-14 H-5 V-2 H-14 Z',
  right: 'M16 0 L-2 14 V5 H-14 V-5 H-2 V-14 Z',
  left: 'M-16 0 L2 14 V5 H14 V-5 H2 V-14 Z',
}

export default function MapViewer({
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
  const viewRef = useRef(view)
  const [hoverId, setHoverId] = useState(null)
  const drag = useRef(null)

  useLayoutEffect(() => {
    viewRef.current = view
  })
  const [box, setBox] = useState({ w: 800, h: 512 })
  // SVG units per screen pixel: markers use it to stay the same size on screen.
  const k = Math.max(view.w / box.w, view.h / box.h) * 0.85
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
      const v = viewRef.current
      const cx = v.x + ((e.clientX - rect.left) / rect.width) * v.w
      const cy = v.y + ((e.clientY - rect.top) / rect.height) * v.h
      setView(zoomAt(viewRef.current, e.deltaY > 0 ? 1.12 : 1 / 1.12, cx, cy))
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [])

  // "View on map": center and zoom in on a marker (switching floors is done by the parent).
  useEffect(() => {
    if (!focusRequest) return
    const m = markers.find((mk) => mk.id === focusRequest.id)
    if (!m) return
    const w = 480
    const h = (w * H) / W
    tweenView({ x: m.x - w / 2, y: m.y - h / 2, w }, 0.8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest])

  // Floor change: red slash wipe, the floor plan skews in and the markers pop in.
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
          { autoAlpha: 0, x: 60, skewX: -10 },
          { autoAlpha: 1, x: 0, skewX: 0, duration: 0.45, ease: 'power3.out' },
          0.18,
        )
        .fromTo(
          '.map-floor-name',
          { autoAlpha: 0, x: -40 },
          { autoAlpha: 1, x: 0, duration: 0.35, ease: 'back.out(2)' },
          0.25,
        )
        .fromTo(
          '.map-marker__inner',
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, duration: 0.45, ease: 'back.out(3)', stagger: 0.035 },
          0.35,
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
        { attr: { r: 18 }, opacity: 1 },
        { attr: { r: 34 }, opacity: 0, duration: 1.1, ease: 'power2.out', repeat: -1 },
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
    const rect = svgRef.current.getBoundingClientRect()
    const scale = Math.max(d.view.w / rect.width, d.view.h / rect.height)
    setView(clampView({ ...d.view, x: d.view.x - dx * scale, y: d.view.y - dy * scale }))
  }
  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) onSelect(null)
    drag.current = null
  }

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
      <h2 className="map-floor-name">{floor.name}</h2>

      <FloorTabs floors={floors} current={floor.id} counts={floorCounts} onChange={goFloor} />

      <svg
        ref={svgRef}
        className="map-svg"
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        <defs>
          <pattern id="checker" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="#121212" />
            <rect width="40" height="40" fill="#181818" />
            <rect x="40" y="40" width="40" height="40" fill="#181818" />
          </pattern>
          <pattern id="water" width="24" height="12" patternUnits="userSpaceOnUse">
            <rect width="24" height="12" fill="#10324a" />
            <path d="M0 6 Q6 2 12 6 T24 6" stroke="#2d7fb5" strokeWidth="2" fill="none" />
          </pattern>
        </defs>

        <rect x={-2000} y={-2000} width={5000} height={5000} fill="url(#checker)" />

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
                fill={s.kind === 'water' ? 'url(#water)' : undefined}
              />
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
                  y={s.rect[1] + s.rect[3] - 10}
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

      <div className="map-controls">
        <button type="button" aria-label="Zoom in" onClick={() => tweenView(zoomAt(viewRef.current, 0.7), 0.35)}>
          +
        </button>
        <button type="button" aria-label="Zoom out" onClick={() => tweenView(zoomAt(viewRef.current, 1 / 0.7), 0.35)}>
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
