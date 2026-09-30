import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from './generated/prisma/client.ts'

// The whole database is this one file. libSQL is used as the SQLite driver
// because it ships ready-made binaries for Windows, macOS and Linux
// (no Python or build tools needed).
const DB_FILE = fileURLToPath(new URL('../prisma/dev.db', import.meta.url))
const relative = path.relative(process.cwd(), DB_FILE).split(path.sep).join('/')

export const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: `file:${relative}` }),
})
