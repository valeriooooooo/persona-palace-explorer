import { useRef } from 'react'
import { MARKER_TYPES, MARKER_TYPE_IDS } from '../data/markerTypes'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import MarkerIcon from './ui/MarkerIcon'

export default function Legend({ onClose }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap
        .timeline()
        .fromTo('.legend__backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
        .fromTo(
          '.legend__card',
          { scale: 0.6, rotate: -8, autoAlpha: 0 },
          { scale: 1, rotate: -2, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)' },
          0,
        )
        .fromTo('.legend__list li', { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.04, duration: 0.25 }, 0.2)
    },
    { scope: ref },
  )

  return (
    <div className="legend" ref={ref} role="dialog" aria-modal="true" aria-label="Legend" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="legend__backdrop" onClick={onClose} />
      <div className="legend__card">
        <h2 className="panel__title">Legend</h2>
        <ul className="legend__list">
          {MARKER_TYPE_IDS.map((id) => (
            <li key={id}>
              <MarkerIcon type={id} size={28} /> {MARKER_TYPES[id].label}
            </li>
          ))}
          <li>
            <span className="legend__lock" aria-hidden="true" /> Locked chest (needs a Lockpick)
          </li>
          <li>
            <span className="legend__door" aria-hidden="true" /> Door
          </li>
          <li>
            <span className="legend__stairs" aria-hidden="true">▲</span> Stairs / exit to another floor
          </li>
        </ul>
        <button type="button" className="p5-button" onClick={onClose} autoFocus>
          Close
        </button>
      </div>
    </div>
  )
}
