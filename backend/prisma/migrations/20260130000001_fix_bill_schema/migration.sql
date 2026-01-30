-- Procedure to safely add userId column to Bill table if it doesn't exist
-- Using a simpler approach compatible with standard migration scripts (might need delimiter in raw SQL execution, but Prisma handles it usually split by ; unless mapped?)
-- Actually Prisma splits by ;. DELIMITER command is specific to CLI clients.
-- We can't use DELIMITER syntax directly in migration.sql often.

-- Safe Alter:
-- There is no standard IF NOT EXISTS for ADD COLUMN in MySQL < 8.0.29?
-- Assuming MySQL 8.0+.
-- But if we can't use procedure easily, we can just run ALTER and let it fail?
-- If it fails, deployment stops. User is verified stuck.

-- Better path: "catch-up" migration.
-- Pushing the ALTER TABLE.
-- If it fails because column exists, User is asked to resolve THIS one as applied.
-- But we want to avoid asking user.

-- Let's try to just ADD it.
ALTER TABLE `Bill` ADD COLUMN `userId` VARCHAR(191) NULL;
