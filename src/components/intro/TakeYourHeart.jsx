import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, reducedMotion } from '../../animations/gsap'
import PhantomHat from './PhantomHat'
import RansomText from './RansomText'

const LOGO = '/images/intro/take-your-heart.jpg'

// Opening "calling card". Uses the Take Your Heart logo from public/images/intro;
// if that file is missing, falls back to the drawn hat + ransom-note letters.
// Ends by slicing the screen open.
export default function TakeYourHeart({ onReveal, onDone }) {
  const ref = useRef(null)
  const tl = useRef(null)
  const [logo, setLogo] = useState('loading') // 'loading' | 'ok' | 'fail'

  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogo('ok')
    img.onerror = () => setLogo('fail')
    img.src = LOGO
  }, [])

  useGSAP(
    () => {
      if (logo === 'loading') return
      if (reducedMotion()) {
        onReveal()
        onDone()
        return
      }
      const t = gsap
        .timeline({ onComplete: onDone })
        .from('.tyh__rays', { scale: 0, rotate: -90, duration: 0.6, ease: 'power3.out' })

      if (logo === 'ok') {
        t.from('.tyh__card', { y: -500, scale: 2.2, rotate: -30, autoAlpha: 0, duration: 0.6, ease: 'bounce.out' }, 0.15)
          .to('.tyh__card', { rotate: 2, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' })
          .to('.tyh__card', { scale: 1.08, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' }, '+=0.15')
      } else {
        t.from('.tyh__splat', { scale: 0, rotate: 30, duration: 0.35, ease: 'back.out(2.5)' }, 0.15)
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
      }

      t.fromTo('.tyh__flash', { autoAlpha: 0.9 }, { autoAlpha: 0, duration: 0.3 }, '+=0.05')
        .to('.tyh__logo', { scale: 1.05, duration: 0.6, ease: 'sine.inOut' }, '<')
        .add(onReveal, '+=0.5')
        .to('.tyh__slice--top', { yPercent: -110, rotate: -4, duration: 0.55, ease: 'power4.in' })
        .to('.tyh__slice--bottom', { yPercent: 110, rotate: -4, duration: 0.55, ease: 'power4.in' }, '<')
        .to('.tyh__logo', { scale: 0.2, autoAlpha: 0, rotate: 20, duration: 0.4, ease: 'power3.in' }, '<')
        .to('.tyh__rays, .tyh__splat', { autoAlpha: 0, duration: 0.3 }, '<0.1')
      tl.current = t
    },
    { scope: ref, dependencies: [logo] },
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
      {logo !== 'loading' && (
        <>
          <div className="tyh__rays" />
          {logo === 'ok' ? (
            <div className="tyh__logo">
              <img className="tyh__card" src={LOGO} alt="Take Your Heart" />
            </div>
          ) : (
            <>
              <div className="tyh__splat" />
              <div className="tyh__logo">
                <PhantomHat className="tyh__hat" />
                <RansomText text="TAKE YOUR HEART" className="tyh__text" />
              </div>
            </>
          )}
        </>
      )}
      <div className="tyh__flash" />
      <span className="tyh__skip">Click to skip</span>
    </div>
  )
}
