import { useRef } from 'react'
import { gsap, useGSAP, reducedMotion } from '../../animations/gsap'
import PhantomHat from './PhantomHat'
import RansomText from './RansomText'

// Opening "calling card": the hat drops in, the letters slam down one by one,
// then the screen is sliced away.
export default function TakeYourHeart({ onReveal, onDone }) {
  const ref = useRef(null)
  const tl = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion()) {
        onReveal()
        onDone()
        return
      }
      tl.current = gsap
        .timeline({ onComplete: onDone })
        .set(ref.current, { autoAlpha: 1 })
        .from('.tyh__rays', { scale: 0, rotate: -90, duration: 0.6, ease: 'power3.out' })
        .from('.tyh__splat', { scale: 0, rotate: 30, duration: 0.35, ease: 'back.out(2.5)' }, 0.15)
        .from('.tyh__hat', { y: -420, rotate: -40, duration: 0.55, ease: 'bounce.out' }, 0.25)
        .to('.tyh__hat', { rotate: 6, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' })
        .from(
          '.ransom__letter',
          {
            scale: 3,
            autoAlpha: 0,
            rotate: () => gsap.utils.random(-60, 60),
            duration: 0.22,
            ease: 'back.out(3)',
            stagger: 0.045,
          },
          0.75,
        )
        .fromTo('.tyh__flash', { autoAlpha: 0.9 }, { autoAlpha: 0, duration: 0.3 }, '+=0.05')
        .to('.tyh__logo', { scale: 1.06, duration: 0.5, ease: 'sine.inOut' }, '<')
        .add(onReveal, '+=0.45')
        .to('.tyh__slice--top', { yPercent: -110, rotate: -4, duration: 0.55, ease: 'power4.in' })
        .to('.tyh__slice--bottom', { yPercent: 110, rotate: -4, duration: 0.55, ease: 'power4.in' }, '<')
        .to('.tyh__logo', { scale: 0.2, autoAlpha: 0, rotate: 20, duration: 0.4, ease: 'power3.in' }, '<')
        .to('.tyh__rays, .tyh__splat', { autoAlpha: 0, duration: 0.3 }, '<0.1')
    },
    { scope: ref },
  )

  const skip = () => {
    tl.current?.kill()
    onReveal()
    onDone()
  }

  return (
    <div
      className="tyh"
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onClick={skip}
      onKeyDown={skip}
    >
      <div className="tyh__slice tyh__slice--top" />
      <div className="tyh__slice tyh__slice--bottom" />
      <div className="tyh__rays" />
      <div className="tyh__splat" />
      <div className="tyh__logo">
        <PhantomHat className="tyh__hat" />
        <RansomText text="TAKE YOUR HEART" className="tyh__text" />
      </div>
      <div className="tyh__flash" />
      <span className="tyh__skip">Click to skip</span>
    </div>
  )
}
