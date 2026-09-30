import { useEffect, useRef } from 'react'

// All map areas of a Palace in the order you walk through them.
// Maps of the same place on a later visit share one entry.
export default function AreaList({ groups, current, onChange }) {
  const listRef = useRef(null)

  // Keep the active area in view.
  useEffect(() => {
    listRef.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [current])

  return (
    <nav className="area-list" aria-label="Areas">
      <ol ref={listRef}>
        {groups.map((g, i) => {
          const active = g.areas.some((a) => a.slug === current)
          const target = active ? current : g.areas[0].slug
          return (
            <li key={g.key}>
              <button
                type="button"
                className={`area-tab ${active ? 'is-active' : ''}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => onChange(target)}
              >
                <span className="area-tab__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="area-tab__name">{g.name}</span>
                {g.storyCount > 0 && <span className="area-tab__count">{g.storyCount}</span>}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
