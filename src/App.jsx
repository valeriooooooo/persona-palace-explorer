import { useEffect, useRef, useState } from 'react'
import { usePalace, usePalaces } from './api'
import { gsap, useGSAP, reducedMotion } from './animations/gsap'
import TakeYourHeart from './components/intro/TakeYourHeart'
import PalaceSelect from './components/PalaceSelect'
import PalaceExplorer from './components/PalaceExplorer'
import { ApiError, Loading } from './components/ui/StatusScreen'

// Routes: "#/" = palace selection, "#/palace/<slug>" = explorer.
const parseHash = () => {
  const m = window.location.hash.match(/^#\/palace\/([\w-]+)/)
  return m ? { screen: 'palace', id: m[1] } : { screen: 'select' }
}

function SelectScreen(props) {
  const { data, error } = usePalaces()
  if (error) return <ApiError error={error} />
  if (!data) return <Loading what="Opening the Metaverse Navigator" />
  return <PalaceSelect palaces={data} {...props} />
}

function PalaceScreen({ slug, ...props }) {
  const { data, error } = usePalace(slug)
  if (error) return <ApiError error={error} />
  if (!data) return <Loading what="Infiltrating" />
  return <PalaceExplorer palace={data} {...props} />
}

const goTo = (hash) => {
  window.location.hash = hash
  window.scrollTo(0, 0)
}

export default function App() {
  const rootRef = useRef(null)
  const [route, setRoute] = useState(parseHash)
  const [revealed, setRevealed] = useState(false)
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const { contextSafe } = useGSAP(
    () => {
      if (reducedMotion()) return
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

  // Screen change: diagonal red/black/white stripes cover the page, swap, uncover.
  const navigate = contextSafe((hash) => {
    if (reducedMotion()) {
      goTo(hash)
      return
    }
    gsap
      .timeline()
      .set('.wipe', { autoAlpha: 1 })
      .fromTo('.wipe__stripe', { xPercent: -130 }, { xPercent: 0, duration: 0.4, stagger: 0.06, ease: 'power3.in' })
      .add(() => goTo(hash))
      .to('.wipe__stripe', { xPercent: 130, duration: 0.45, stagger: 0.06, ease: 'power3.out' }, '+=0.15')
      .set('.wipe', { autoAlpha: 0 })
  })

  return (
    <div className="app" ref={rootRef}>
      <div className="bg" aria-hidden="true">
        <span className="bg-shard bg-shard--1" />
        <span className="bg-shard bg-shard--2" />
        <span className="bg-shard bg-shard--3" />
        <span className="bg-halftone" />
      </div>

      {route.screen === 'palace' ? (
        <PalaceScreen key={route.id} slug={route.id} animate={revealed} onBack={() => navigate('#/')} />
      ) : (
        <SelectScreen animate={revealed} onOpen={(id) => navigate(`#/palace/${id}`)} />
      )}

      <footer className="footer">Fan project · Persona 5 Royal © ATLUS / SEGA</footer>

      <div className="wipe" aria-hidden="true">
        <span className="wipe__stripe wipe__stripe--red" />
        <span className="wipe__stripe wipe__stripe--black" />
        <span className="wipe__stripe wipe__stripe--white" />
      </div>

      {!introDone && <TakeYourHeart onReveal={() => setRevealed(true)} onDone={() => setIntroDone(true)} />}
    </div>
  )
}
