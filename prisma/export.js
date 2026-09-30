// Writes the current database back to the JSON files in prisma/data/,
// so changes made in Prisma Studio can be committed to git.
// Run with: npm run db:export
import { mkdirSync, writeFileSync } from 'node:fs'
import { prisma } from '../server/db.js'

const DATA = new URL('./data/', import.meta.url)

// Drop ids, foreign keys and empty values so the files stay readable.
const clean = (row, drop = []) =>
  Object.fromEntries(
    Object.entries(row).filter(
      ([k, v]) => v !== null && k !== 'id' && !k.endsWith('Id') && !drop.includes(k) && !(k === 'locked' && v === false),
    ),
  )
const write = (file, rows) => {
  writeFileSync(new URL(file, DATA), JSON.stringify(rows, null, 2) + '\n')
}

async function main() {
  const enemies = await prisma.enemy.findMany({ orderBy: { name: 'asc' } })
  write('enemies.json', enemies.map((e) => clean(e)))

  const palaces = await prisma.palace.findMany({
    orderBy: { order: 'asc' },
    include: {
      areas: { orderBy: { order: 'asc' } },
      bosses: { include: { area: true } },
      enemies: { include: { enemy: true } },
    },
  })
  write('palaces.json', palaces.map((p) => clean(p, ['areas', 'bosses', 'enemies'])))

  for (const p of palaces) {
    if (!p.areas.length && !p.bosses.length && !p.enemies.length) continue
    const dir = `${p.slug}/`
    mkdirSync(new URL(dir, DATA), { recursive: true })
    const markers = await prisma.marker.findMany({
      where: { area: { palaceId: p.id } },
      include: { area: true, target: true },
      orderBy: [{ area: { order: 'asc' } }, { step: 'asc' }, { subStep: 'asc' }, { id: 'asc' }],
    })
    write(dir + 'areas.json', p.areas.map((a) => clean(a)))
    write(
      dir + 'markers.json',
      markers.map(({ area, target, ...m }) => ({ area: area.slug, ...clean(m), ...(target ? { target: target.slug } : {}) })),
    )
    write(dir + 'bosses.json', p.bosses.map(({ area, ...b }) => ({ ...clean(b), ...(area ? { area: area.slug } : {}) })))
    write(dir + 'enemies.json', p.enemies.map(({ enemy, ...l }) => ({ enemy: enemy.slug, ...clean(l) })))
  }
  console.log('Exported the database to prisma/data/')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
