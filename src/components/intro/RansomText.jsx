// "Ransom note" lettering: every letter gets its own cut-out look.
const STYLES = ['black', 'white', 'plain', 'red', 'black', 'serif', 'white', 'plain', 'black', 'red', 'serif', 'white']
const TILTS = [-6, 4, -2, 7, -4, 3, -8, 5, -3, 6, -5, 2]

export default function RansomText({ text, className = '' }) {
  let n = 0
  return (
    <span className={`ransom ${className}`} aria-label={text} role="img">
      {text.split(' ').map((word, wi) => (
        <span className="ransom__word" key={wi} aria-hidden="true">
          {word.split('').map((ch, ci) => {
            const i = n++
            const style = STYLES[(i * 7 + wi) % STYLES.length]
            return (
              <span
                key={ci}
                className={`ransom__letter ransom__letter--${style}`}
                style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` }}
              >
                {i % 3 === 1 ? ch.toLowerCase() : ch}
              </span>
            )
          })}
        </span>
      ))}
    </span>
  )
}
