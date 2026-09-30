-- AlterTable
ALTER TABLE "Boss" ADD COLUMN "persona" TEXT;
ALTER TABLE "Boss" ADD COLUMN "rewards" TEXT;
ALTER TABLE "Boss" ADD COLUMN "skills" TEXT;
ALTER TABLE "Boss" ADD COLUMN "sp" INTEGER;

-- AlterTable
ALTER TABLE "Enemy" ADD COLUMN "drops" TEXT;
ALTER TABLE "Enemy" ADD COLUMN "personality" TEXT;

-- AlterTable
ALTER TABLE "Palace" ADD COLUMN "party" TEXT;
ALTER TABLE "Palace" ADD COLUMN "source" TEXT;
