-- CreateTable
CREATE TABLE "Palace" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "ruler" TEXT NOT NULL,
    "sin" TEXT,
    "location" TEXT,
    "keywords" TEXT,
    "treasure" TEXT,
    "deadline" TEXT,
    "description" TEXT,
    "crystal" TEXT,
    "portrait" TEXT,
    "banner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'coming-soon'
);

-- CreateTable
CREATE TABLE "Area" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "palaceId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "areaNames" TEXT,
    "visit" INTEGER NOT NULL DEFAULT 1,
    "mapImage" TEXT,
    "notes" TEXT,
    CONSTRAINT "Area_palaceId_fkey" FOREIGN KEY ("palaceId") REFERENCES "Palace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Marker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "areaId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "step" INTEGER,
    "subStep" INTEGER,
    "reward" TEXT,
    "requires" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "seedColor" TEXT,
    "image" TEXT,
    "targetId" INTEGER,
    CONSTRAINT "Marker_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Marker_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Area" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enemy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "arcana" TEXT,
    "level" INTEGER,
    "weak" TEXT,
    "resist" TEXT,
    "nullify" TEXT,
    "drain" TEXT,
    "repel" TEXT,
    "description" TEXT,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "PalaceEnemy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "palaceId" INTEGER NOT NULL,
    "enemyId" INTEGER NOT NULL,
    "where" TEXT,
    CONSTRAINT "PalaceEnemy_palaceId_fkey" FOREIGN KEY ("palaceId") REFERENCES "Palace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PalaceEnemy_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "Enemy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Boss" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "palaceId" INTEGER NOT NULL,
    "areaId" INTEGER,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER,
    "hp" INTEGER,
    "weak" TEXT,
    "resist" TEXT,
    "description" TEXT,
    "image" TEXT,
    "isRuler" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Boss_palaceId_fkey" FOREIGN KEY ("palaceId") REFERENCES "Palace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Boss_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Palace_slug_key" ON "Palace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Palace_order_key" ON "Palace"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Area_palaceId_slug_key" ON "Area"("palaceId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Enemy_slug_key" ON "Enemy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PalaceEnemy_palaceId_enemyId_key" ON "PalaceEnemy"("palaceId", "enemyId");

-- CreateIndex
CREATE UNIQUE INDEX "Boss_palaceId_slug_key" ON "Boss"("palaceId", "slug");
