// Small API that gives the website its data from the SQLite database.
// Started together with the website by: npm run dev
import express from 'express'
import { prisma } from './db.js'

const PORT = 3001
const app = express()

// All palaces for the selection screen.
app.get('/api/palaces', async (_req, res, next) => {
  try {
    const palaces = await prisma.palace.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { areas: true } } },
    })
    const counts = await prisma.marker.groupBy({
      by: ['type', 'areaId'],
      _count: true,
    })
    const areas = await prisma.area.findMany({ select: { id: true, palaceId: true } })
    const palaceOf = Object.fromEntries(areas.map((a) => [a.id, a.palaceId]))
    res.json(
      palaces.map(({ _count, ...p }) => {
        const markerCounts = {}
        for (const c of counts) {
          if (palaceOf[c.areaId] === p.id) markerCounts[c.type] = (markerCounts[c.type] ?? 0) + c._count
        }
        return { ...p, areaCount: _count.areas, markerCounts }
      }),
    )
  } catch (e) {
    next(e)
  }
})

// One palace with everything in it.
app.get('/api/palaces/:slug', async (req, res, next) => {
  try {
    const palace = await prisma.palace.findUnique({
      where: { slug: req.params.slug },
      include: {
        areas: {
          orderBy: [{ order: 'asc' }],
          include: {
            markers: {
              orderBy: [{ step: 'asc' }, { subStep: 'asc' }, { id: 'asc' }],
              include: { target: { select: { slug: true } } },
            },
          },
        },
        bosses: { include: { area: { select: { slug: true } } } },
        enemies: { include: { enemy: true } },
      },
    })
    if (!palace) return res.status(404).json({ error: `Palace "${req.params.slug}" not found` })
    res.json({
      ...palace,
      areas: palace.areas.map(({ markers, ...a }) => ({
        ...a,
        markers: markers.map(({ target, ...m }) => ({ ...m, area: a.slug, target: target?.slug ?? null })),
      })),
      bosses: palace.bosses.map(({ area, ...b }) => ({ ...b, area: area?.slug ?? null })),
      enemies: palace.enemies.map(({ enemy, where }) => ({ ...enemy, where })),
    })
  } catch (e) {
    next(e)
  }
})

// Express only treats a handler with 4 arguments as the error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Database error. Did you run "npm run db:setup"?' })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}/api/palaces`)
})
