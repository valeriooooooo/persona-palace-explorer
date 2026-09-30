import { useRef } from 'react'
import { gsap, useGSAP, reducedMotion } from '../animations/gsap'
import ImageSlot from './ui/ImageSlot'
import MarkerIcon from './ui/MarkerIcon'
import RansomText from './intro/RansomText'

function PalaceCard({ palace, onOpen }) {
  const locked = palace.status !== 'available'

  const hover = (e, on) => {
    if (reducedMotion()) return
    const card = e.currentTarget
    gsap.to(card, { rotate: on ? -1 : -3, y: on ? -10 : 0, scale: on ? 1.03 : 1, duration: 0.3, ease: 'back.out(2)' })
    gsap.to(card.querySelector('.palace-card__shadow'), { x: on ? 18 : 10, y: on ? 18 : 10, duration: 0.3 })
    gsap.to(card.querySelector('.palace-card__go'), { x: on ? 8 : 0, duration: 0.25, ease: 'back.out(3)' })
  }

  // A locked Palace shakes its lock instead of opening.
  const click = (e) => {
    if (!locked) return onOpen(palace.slug)
    if (reducedMotion()) return
    gsap.fromTo(
      e.currentTarget.querySelector('.palace-card__lock'),
      { rotate: -18 },
      { rotate: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.2)' },
    )
  }

  return (
    <button
      type="button"
      className={`palace-card ${locked ? 'is-locked' : ''}`}
      aria-disabled={locked}
      onClick={click}
      onPointerEnter={(e) => hover(e, true)}
      onPointerLeave={(e) => hover(e, false)}
      onFocus={(e) => hover(e, true)}
      onBlur={(e) => hover(e, false)}
    >
      <span className="palace-card__shadow" aria-hidden="true" />
      <span className="palace-card__inner">
        <span className="palace-card__num">{String(palace.order).padStart(2, '0')}</span>
        {locked ? (
          <span className="palace-card__image palace-card__image--locked">
            <span className="palace-card__lock" aria-hidden="true">
              🔒
            </span>
          </span>
        ) : (
          <ImageSlot className="palace-card__image" src={palace.banner} alt={palace.name} />
        )}
        <span className="palace-card__body">
          {palace.subtitle && <span className="palace-card__sub">{palace.subtitle}</span>}
          <span className="palace-card__name">{palace.name}</span>
          <span className="palace-card__meta">
            Ruler <strong>{palace.ruler}</strong>
            {palace.treasure && (
              <>
                {' '}
                · Treasure <strong>{palace.treasure}</strong>
              </>
            )}
          </span>
          {!locked && (
            <span className="palace-card__stats">
              {['story', 'safeRoom', 'willSeed', 'chest'].map((t) => (
                <span key={t}>
                  <MarkerIcon type={t} size={22} /> {palace.markerCounts[t] ?? 0}
                </span>
              ))}
              <span>{palace.areaCount} maps</span>
            </span>
          )}
        </span>
        <span className="palace-card__go">{locked ? 'Coming soon' : 'Infiltrate ▶'}</span>
      </span>
    </button>
  )
}

export default function PalaceSelect({ palaces, onOpen, animate }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (!animate || reducedMotion()) return
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.select__kicker', { x: -200, autoAlpha: 0, skewX: -30, duration: 0.45 })
        .from('.select__title .ransom__letter', { y: -80, rotate: () => gsap.utils.random(-40, 40), autoAlpha: 0, duration: 0.3, stagger: 0.04, ease: 'back.out(3)' }, '<0.1')
        .from('.palace-card', { x: 300, rotate: 12, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(1.4)' }, '-=0.2')
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
        {palaces.map((p) => (
          <PalaceCard key={p.slug} palace={p} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
