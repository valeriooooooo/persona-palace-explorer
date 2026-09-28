# Persona 5 Royal – Palace Explorer

A MapGenie-style interactive map for the Palaces from Persona 5 Royal, in the style of the P5R UI.
Built with React + Vite, with animations in GSAP.

```bash
npm install
npm run dev
```

## Structure

- `src/data/kamoshida.js` – all data for Kamoshida's Palace: floors (SVG shapes), doors, stairs and markers
- `src/data/markerTypes.js` – marker categories (colors + icons) for the filters/legend
- `src/components/` – `PalaceHeader`, `FilterPanel`, `MapViewer` (zoom/pan/floors), `InfoPanel`, `Legend`
- `src/animations/gsap.js` – GSAP setup + helpers (respects `prefers-reduced-motion`)
- `public/images/` – your own images, see `public/images/README.md`

## Adding or editing a marker

In `src/data/kamoshida.js`, under `markers`:

```js
{ id: '2f-chest-x', type: 'chest', floor: '2f', x: 300, y: 200,
  name: 'Chest name', location: 'Library', reward: 'Medicine', requires: 'Lockpick',
  description: '...', locked: true, image: 'kamoshida/foo.jpg' }
```

The coordinates are in the map's 1000×640 grid.

## Note about the data

The floor plans are simplified schematics (not traces of the game), and the marker
positions, chest contents and puzzle descriptions are a first draft. Check them
against a guide and adjust them in `kamoshida.js`.
