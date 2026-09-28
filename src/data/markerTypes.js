// Every filterable marker category. `icon` is SVG path data drawn in a 24x24 box.
export const MARKER_TYPES = {
  safeRoom: {
    label: 'Safe Rooms',
    singular: 'Safe Room',
    color: '#3fa9f5',
    icon: 'M4 21V9.5L12 3l8 6.5V21h-6v-6h-4v6z',
  },
  willSeed: {
    label: 'Will Seeds',
    singular: 'Will Seed',
    color: '#f5d90a',
    icon: 'M12 2c3.2 4.2 6.5 7.4 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 9.4 8.8 6.2 12 2zm0 7c-1.4 2-2.8 3.4-2.8 5.2a2.8 2.8 0 0 0 5.6 0C14.8 12.4 13.4 11 12 9z',
  },
  treasure: {
    label: 'Treasure',
    singular: 'Treasure',
    color: '#ff2a3d',
    icon: 'M3 19h18l-1.2-11-5 4.2L12 5l-2.8 7.2-5-4.2z',
  },
  chest: {
    label: 'Chests',
    singular: 'Chest',
    color: '#2ecc71',
    icon: 'M3 11h18v9H3zm0-1.5C3 6.5 7 4 12 4s9 2.5 9 5.5zM10.5 12.5v3h3v-3z',
  },
  shadow: {
    label: 'Shadows',
    singular: 'Shadow',
    color: '#b36cf0',
    icon: 'M2.5 7.5C6 5 18 5 21.5 7.5 21.5 14 17.5 19 12 19S2.5 14 2.5 7.5zM6.5 10l1 2.5h3L10 10zm11 0l-1 2.5h-3L14 10z',
  },
  puzzle: {
    label: 'Puzzles',
    singular: 'Puzzle',
    color: '#ff8c1a',
    icon: 'M4 4h5.5a2.5 2.5 0 1 1 5 0H20v5.5a2.5 2.5 0 1 1 0 5V20h-5.5a2.5 2.5 0 1 0-5 0H4v-5.5a2.5 2.5 0 1 0 0-5z',
  },
  grapple: {
    label: 'Grappling Points',
    singular: 'Grappling Point',
    color: '#f4f4f4',
    icon: 'M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zm0 4a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm0 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  },
}

export const MARKER_TYPE_IDS = Object.keys(MARKER_TYPES)
