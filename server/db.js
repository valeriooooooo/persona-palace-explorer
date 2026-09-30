import { fileURLToPath } from 'node:url'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from './generated/prisma/client.ts'

// The whole database is this one file.
const DB_FILE = fileURLToPath(new URL('../prisma/dev.db', import.meta.url))

export const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: `file:${DB_FILE}` }),
})
