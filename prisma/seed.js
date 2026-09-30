// Fills the database from the JSON files in prisma/data/.
// Run with: npm run db:setup  (resets the database and runs this file)
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { prisma } from '../server/db.js'

const DATA = new URL('./data/', import.meta.url)
const read = (file) => {
  const url = new URL(file, DATA)
  return existsSync(url) ? JSON.parse(readFileSync(url, 'utf8')) : []
}

async function main() {
  // Start from an empty database (children first).
  await prisma.marker.deleteMany()
  await prisma.boss.deleteMany()
  await prisma.palaceEnemy.deleteMany()
  await prisma.area.deleteMany()
  await prisma.enemy.deleteMany()
  await prisma.palace.deleteMany()

  const enemyIds = {}
  for (const e of read('enemies.json')) {
    enemyIds[e.slug] = (await prisma.enemy.create({ data: e })).id
  }

  for (const p of read('palaces.json')) {
    const palace = await prisma.palace.create({ data: p })
    const dir = `${p.slug}/`
    if (!existsSync(new URL(dir, DATA))) continue
    const files = readdirSync(new URL(dir, DATA))
    const get = (name) => (files.includes(name) ? read(dir + name) : [])

    const areaIds = {}
    for (const a of get('areas.json')) {
      areaIds[a.slug] = (await prisma.area.create({ data: { ...a, palaceId: palace.id } })).id
    }
    for (const { area, target, ...m } of get('markers.json')) {
      if (!areaIds[area]) throw new Error(`markers.json: unknown area "${area}"`)
      await prisma.marker.create({
        data: { ...m, areaId: areaIds[area], targetId: target ? areaIds[target] : null },
      })
    }
    for (const { area, ...b } of get('bosses.json')) {
      await prisma.boss.create({
        data: { ...b, palaceId: palace.id, areaId: area ? areaIds[area] : null },
      })
    }
    for (const { enemy, ...link } of get('enemies.json')) {
      if (!enemyIds[enemy]) throw new Error(`${p.slug}/enemies.json: unknown enemy "${enemy}"`)
      await prisma.palaceEnemy.create({
        data: { ...link, palaceId: palace.id, enemyId: enemyIds[enemy] },
      })
    }
    console.log(`  ${p.name}: ${Object.keys(areaIds).length} areas`)
  }
}

main()
  .then(() => console.log('Database filled from prisma/data/'))
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
