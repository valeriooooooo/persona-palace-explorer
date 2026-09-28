import { useRef } from 'react'
import { PALACES } from '../data/palaces'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import ImageSlot from './ui/ImageSlot'
import MarkerIcon from './ui/MarkerIcon'
import RansomText from './intro/RansomText'

const count = (palace, type) => palace.markers.filter((m) => m.type === type).length

function PalaceCard({ palace, index, onOpen }) {
  const hover = (e, on) => {
    if (reducedMotion()) return
    const card = e.currentTarget
    gsap.to(card, { rotate: on ? -1 : -3, y: on ? -10 : 0, scale: on ? 1.03 : 1, duration: 0.3, ease: 'back.out(2)' })
    gsap.to(card.querySelector('.palace-card__shadow'), { x: on ? 18 : 10, y: on ? 18 : 10, duration: 0.3 })
    gsap.to(card.querySelector('.palace-card__go'), { x: on ? 8 : 0, duration: 0.25, ease: 'back.out(3)' })
  }

  return (
    <button
      type="button"
      className="palace-card"
      onClick={() => onOpen(palace.id)}
      onPointerEnter={(e) => hover(e, true)}
      onPointerLeave={(e) => hover(e, false)}
      onFocus={(e) => hover(e, true)}
      onBlur={(e) => hover(e, false)}
    >
      <span className="palace-card__shadow" aria-hidden="true" />
      <span className="palace-card__inner">
        <span className="palace-card__num">{String(index + 1).padStart(2, '0')}</span>
        <ImageSlot className="palace-card__image" src={palace.banner} alt={palace.name} />
        <span className="palace-card__body">
          <span className="palace-card__sub">{palace.subtitle}</span>
          <span className="palace-card__name">{palace.name}</span>
          <span className="palace-card__meta">
            Ruler <strong>{palace.ruler}</strong> · Treasure <strong>{palace.treasure}</strong>
          </span>
          <span className="palace-card__stats">
            {['safeRoom', 'willSeed', 'chest'].map((t) => (
              <span key={t}>
                <MarkerIcon type={t} size={22} /> {count(palace, t)}
              </span>
            ))}
            <span>{palace.floors.length} areas</span>
          </span>
        </span>
        <span className="palace-card__go">Infiltrate ▶</span>
      </span>
    </button>
  )
}

export default function PalaceSelect({ onOpen, animate }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (!animate || reducedMotion()) return
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.select__kicker', { x: -200, autoAlpha: 0, skewX: -30, duration: 0.45 })
        .from('.select__title .ransom__letter', { y: -80, rotate: () => gsap.utils.random(-40, 40), autoAlpha: 0, duration: 0.3, stagger: 0.04, ease: 'back.out(3)' }, '<0.1')
        .from('.palace-card', { x: 300, rotate: 12, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)' }, '-=0.2')
    },
    { scope: ref, dependencies: [animate] },
  )

  return (
    <section className="select" ref={ref}>
      <p className="select__kicker">Metaverse Navigator</p>
      <h1 className="select__title">
        <RansomText text="SELECT PALACE" />
      </h1>
      <div className="select__cards">
        {PALACES.map((p, i) => (
          <PalaceCard key={p.id} palace={p} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
