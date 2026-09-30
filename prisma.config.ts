import { defineConfig } from 'prisma/config'

// The database is a single SQLite file: prisma/dev.db
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.js',
  },
  datasource: {
    url: 'file:./prisma/dev.db',
  },
})
