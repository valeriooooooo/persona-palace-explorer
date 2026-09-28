import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Quick "hit" shake used when something gets selected.
export function shake(target, strength = 6) {
  if (reducedMotion()) return
  gsap.fromTo(
    target,
    { x: -strength },
    { x: 0, duration: 0.4, ease: 'elastic.out(1.4, 0.25)' },
  )
}

export { gsap, useGSAP }
