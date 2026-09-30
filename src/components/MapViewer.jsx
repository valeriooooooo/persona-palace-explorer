import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import { imageUrl } from '../api'
import AreaList from './AreaList'
import MapMarker from './MapMarker'

// The map is the real map image of the area. Markers are stored in % of the
// image and converted to image pixels here. The view is a centre point plus
// the number of image pixels across the round lens.

const sizeCache = new Map()

// Home: the whole map fits across the lens (its black corners may be cut off).
const homeView = (size) => ({ cx: size.w / 2, cy: size.h / 2, w: Math.max(size.w, size.h) * 1.08 })

const clampView = (size, { cx, cy, w }) => {
  const minW = Math.max(size.w, size.h) * 0.2
  const maxW = Math.hypot(size.w, size.h) * 1.6
  return {
    w: Math.min(maxW, Math.max(minW, w)),
    cx: Math.min(size.w, Math.max(0, cx)),
    cy: Math.min(size.h, Math.max(0, cy)),
  }
}

// Zoom `v` by `factor`, keeping image point (px, py) fixed on screen.
const zoomAt = (size, v, factor, px = v.cx, py = v.cy) => {
  const next = clampView(size, { ...v, w: v.w * factor })
  const f = next.w / v.w
  return clampView(size, { w: next.w, cx: px - (px - v.cx) * f, cy: py - (py - v.cy) * f })
}

const viewBoxOf = (v, box) => {
  const h = (v.w * box.h) / box.w
  return { x: v.cx - v.w / 2, y: v.cy - h / 2, w: v.w, h }
}

export default function MapViewer({
  palaceName,
  areaGroups,
  area,
  markers,
  selectedId,
  focusRequest,
  onSelect,
  onAreaChange,
  onOpenLegend,
}) {
  const rootRef = useRef(null)
  const svgRef = useRef(null)
  const src = imageUrl(area.mapImage)

  // Natural size of the map image (loaded once per image).
  const [, setLoaded] = useState(0)
  const size = sizeCache.get(src) ?? null
  useEffect(() => {
    if (!src || sizeCache.has(src)) return
    const img = new Image()
    img.onload = () => {
      sizeCache.set(src, { w: img.naturalWidth, h: img.naturalHeight })
      setLoaded((n) => n + 1)
    }
    img.src = src
  }, [src])

  // The stored view belongs to one image; a new image starts at its home view.
  const [stored, setStored] = useState(null)
  const view = size ? (stored?.src === src ? stored : { ...homeView(size), src }) : null
  const setView = (v) => setStored({ ...v, src })

  const [box, setBox] = useState({ w: 600, h: 600 })
  const [hoverId, setHoverId] = useState(null)
  const live = useRef({})
  const drag = useRef(null)

  useLayoutEffect(() => {
    live.current = { view, box, size, src }
  })

  const vb = view ? viewBoxOf(view, box) : { x: 0, y: 0, w: 100, h: 100 }
  // Image pixels per screen pixel: markers use it to keep the same size on screen.
  const k = (vb.w / box.w) * 0.62
  const toPx = (m) => (size ? { x: (m.x / 100) * size.w, y: (m.y / 100) * size.h } : { x: 0, y: 0 })
  const hovered = markers.find((m) => m.id === hoverId)

  const tweenView = (target, duration = 0.6) => {
    const { view: from, size: s, src: forSrc } = live.current
    if (!from || !s) return
    const next = clampView(s, target)
    const proxy = { ...from }
    gsap.to(proxy, {
      ...next,
      duration: reducedMotion() ? 0 : duration,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: () => setStored({ cx: proxy.cx, cy: proxy.cy, w: proxy.w, src: forSrc }),
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
      const { view: v, box: b, size: s, src: forSrc } = live.current
      if (!v || !s) return
      e.preventDefault()
      const rect = svg.getBoundingClientRect()
      const vbox = viewBoxOf(v, b)
      const px = vbox.x + ((e.clientX - rect.left) / rect.width) * vbox.w
      const py = vbox.y + ((e.clientY - rect.top) / rect.height) * vbox.h
      setStored({ ...zoomAt(s, v, e.deltaY > 0 ? 1.12 : 1 / 1.12, px, py), src: forSrc })
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [])

  // "View on map" / story navigation: zoom in on a marker once its map has loaded.
  const handledFocus = useRef(null)
  useEffect(() => {
    if (!focusRequest || !size || handledFocus.current === focusRequest) return
    const m = markers.find((mk) => mk.id === focusRequest.id)
    if (!m) return
    handledFocus.current = focusRequest
    const p = toPx(m)
    tweenView({ cx: p.x, cy: p.y, w: Math.max(size.w, size.h) * 0.55 }, 0.8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest, size, markers])

  // New area: red slash wipe, the map spins in and the markers pop in.
  useGSAP(
    () => {
      if (!size || reducedMotion()) return
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
          { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.02 },
          0.4,
        )
    },
    { scope: rootRef, dependencies: [area.slug, !!size] },
  )

  // Markers that appear because a filter was switched on pop in too.
  const knownIds = useRef(new Set())
  useGSAP(
    () => {
      const fresh = markers.filter((m) => !knownIds.current.has(m.id))
      knownIds.current = new Set(markers.map((m) => m.id))
      if (reducedMotion() || !fresh.length || fresh.length === markers.length) return
      const els = fresh
        .map((m) => rootRef.current.querySelector(`[data-id="${m.id}"] .map-marker__inner`))
        .filter(Boolean)
      gsap.fromTo(
        els,
        { scale: 0, rotate: -90, transformOrigin: '50% 50%' },
        { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.02 },
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
    { scope: rootRef, dependencies: [selectedId, area.slug] },
  )

  const onPointerDown = (e) => {
    if (e.button !== 0 || !view) return
    drag.current = { sx: e.clientX, sy: e.clientY, view, moved: false }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d || !size) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.hypot(dx, dy) < 4) return
    d.moved = true
    const scale = d.view.w / svgRef.current.getBoundingClientRect().width
    setView(clampView(size, { ...d.view, cx: d.view.cx - dx * scale, cy: d.view.cy - dy * scale }))
  }
  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) onSelect(null)
    drag.current = null
  }

  const zoomButton = (factor) => size && view && tweenView(zoomAt(size, view, factor), 0.35)

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else rootRef.current.requestFullscreen?.()
  }

  const group = areaGroups.find((g) => g.areas.some((a) => a.slug === area.slug))

  return (
    <section className="panel map-viewer" ref={rootRef} data-anim="map" aria-label="Palace map">
      <div className="map-floor-bg" aria-hidden="true" />

      <div className="map-title">
        <span className="map-title__palace">{palaceName}</span>
        <span className="map-title__floor">{area.name}</span>
        {area.notes && <span className="map-title__note">{area.notes}</span>}
        {group?.areas.length > 1 && (
          <div className="visit-toggle" role="group" aria-label="Visit">
            {group.areas.map((a) => (
              <button
                key={a.slug}
                type="button"
                className={a.slug === area.slug ? 'is-active' : ''}
                aria-pressed={a.slug === area.slug}
                onClick={() => onAreaChange(a.slug)}
              >
                {a.visit === 1 ? '1st' : a.visit === 2 ? '2nd' : `${a.visit}th`} visit
              </button>
            ))}
          </div>
        )}
      </div>

      <AreaList groups={areaGroups} current={area.slug} onChange={onAreaChange} />

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
            {size && (
              <>
                <g className="map-layer">
                  <image href={src} width={size.w} height={size.h} />
                </g>

                <g className="map-markers">
                  {markers.map((m) => {
                    const p = toPx(m)
                    return (
                      <MapMarker
                        key={m.id}
                        marker={m}
                        x={p.x}
                        y={p.y}
                        k={k}
                        selected={m.id === selectedId}
                        onSelect={onSelect}
                        onHover={setHoverId}
                      />
                    )
                  })}
                </g>

                {hovered && (
                  <g
                    className="map-tooltip"
                    transform={`translate(${toPx(hovered).x} ${toPx(hovered).y - 26 * k}) scale(${k})`}
                    pointerEvents="none"
                  >
                    <rect
                      x={-hovered.name.length * 4.6 - 12}
                      y={-30}
                      width={hovered.name.length * 9.2 + 24}
                      height={26}
                    />
                    <text y={-12} textAnchor="middle">
                      {hovered.name}
                    </text>
                  </g>
                )}
              </>
            )}
          </svg>
          {!size && <p className="map-loading">Loading map…</p>}
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
        <button type="button" aria-label="Reset view" onClick={() => size && tweenView(homeView(size))}>
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
