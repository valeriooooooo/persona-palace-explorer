// Every filterable marker category.
// `icon` is a list of path parts in a 24x24 box; parts with `hole: true` are
// painted in the badge colour so they read as cut-outs.

const star = (cx, cy, outer, inner, points = 5, rot = -90) => {
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer
    const a = ((rot + (i * 180) / points) * Math.PI) / 180
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
}

export const MARKER_TYPES = {
  safeRoom: {
    label: 'Safe Rooms',
    singular: 'Safe Room',
    color: '#3fa9f5',
    // Arched door with a Phantom star on it.
    icon: [
      { d: 'M4.5 22.5V10a7.5 7.5 0 0 1 15 0v12.5z' },
      { d: 'M7 22.5V10.5a5 5 0 0 1 10 0v12z', hole: true },
      { d: star(12, 14, 4.2, 1.8) },
    ],
  },
  willSeed: {
    label: 'Will Seeds',
    singular: 'Will Seed',
    color: '#f5d90a',
    // Glowing seed crystal with sparkles.
    icon: [
      { d: 'M12 1.5c3.6 5.3 7 8.8 7 13.3a7 7 0 0 1-14 0c0-4.5 3.4-8 7-13.3z' },
      { d: 'M9.6 11.2c-1.2 1.7-1.9 3.1-1.9 4.3a2.4 2.4 0 0 0 1.2 2.1c-.3-1.9.2-4 .7-6.4z', hole: true },
      { d: star(20.5, 4, 2.6, 0.7, 4, 0) },
      { d: star(3.5, 6.5, 1.8, 0.5, 4, 0) },
    ],
  },
  treasure: {
    label: 'Treasure',
    singular: 'Treasure',
    color: '#ff2a3d',
    // The King's crown.
    icon: [
      { d: 'M2 18 3.5 6.5l4.8 4.6L12 3l3.7 8.1 4.8-4.6L22 18z' },
      { d: 'M2.5 19.5h19V22h-19z' },
      { d: 'M12 12.2a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8z', hole: true },
      { d: 'M6.3 14a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zm11.4 0a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z', hole: true },
    ],
  },
  chest: {
    label: 'Chests',
    singular: 'Chest',
    color: '#2ecc71',
    // Palace treasure chest with lock plate.
    icon: [
      { d: 'M2 10.5C2 6 6 3.5 12 3.5S22 6 22 10.5z' },
      { d: 'M2 11.5h20v10H2z' },
      { d: 'M5.5 4.8h2v17h-2zm11 0h2v17h-2z', hole: true },
      { d: 'M9.8 9h4.4v6.5H9.8z', hole: true },
      { d: 'M11 11h2v2.5h-2z' },
    ],
  },
  shadow: {
    label: 'Shadows',
    singular: 'Shadow',
    color: '#b36cf0',
    // Shadow mask with slanted eyes.
    icon: [
      { d: 'M.8 8.2c3.2-3.4 7.6-3 11.2-.2 3.6-2.8 8-3.2 11.2.2-.4 5.8-3.4 9.3-7.2 9.3-2 0-3.2-1.5-4-3.2-.8 1.7-2 3.2-4 3.2C4.2 17.5 1.2 14 .8 8.2z' },
      { d: 'M3.6 10.2c2-1.4 4.6-1.2 6.4.9-2 1.8-4.7 1.6-6.4-.9z', hole: true },
      { d: 'M20.4 10.2c-2-1.4-4.6-1.2-6.4.9 2 1.8 4.7 1.6 6.4-.9z', hole: true },
    ],
  },
  puzzle: {
    label: 'Puzzles',
    singular: 'Puzzle',
    color: '#ff8c1a',
    // Ornate key.
    icon: [
      { d: 'M7.5 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z' },
      { d: 'M7.5 5.3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z', hole: true },
      { d: 'M10.4 10.9l1.6-1.6 10.2 10.2-2.4 2.4-1.8-1.8-1.6 1.6-1.6-1.6 1.6-1.6-1.4-1.4-1.6 1.6-1.6-1.6 1.6-1.6z' },
    ],
  },
  grapple: {
    label: 'Grappling Points',
    singular: 'Grappling Point',
    color: '#f4f4f4',
    // Grappling hook.
    icon: [
      { d: 'M12 .8a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z' },
      { d: 'M12 2.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z', hole: true },
      { d: 'M10.8 6h2.4v15.5h-2.4z' },
      { d: 'M2.5 11.5 5 9.8c.4 5.3 3 8.4 7 8.4s6.6-3.1 7-8.4l2.5 1.7c-.5 6.5-4.4 11-9.5 11s-9-4.5-9.5-11z' },
      { d: 'M1.5 12.5 3 8.5l2.8 3zm21 0L21 8.5l-2.8 3z' },
    ],
  },
}

export const MARKER_TYPE_IDS = Object.keys(MARKER_TYPES)

// Will Seeds come in three colours per Palace.
export const SEED_COLORS = {
  red: '#ff3b3b',
  green: '#2ecc71',
  blue: '#3f8cff',
}

// Colour of one marker: its seed colour if it has one, else its category colour.
export const markerColor = (marker) => SEED_COLORS[marker.seed] ?? MARKER_TYPES[marker.type].color
