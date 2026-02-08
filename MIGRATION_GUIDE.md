# Database Migration Instructions

## Overview
This migration adds support for dynamic selling platforms, delivery partners, and tracking information to the Sanskriti system.

## Changes Made

### Database Schema Changes (Prisma)
1. **Settings Model**:
   - Added `sellingPlatforms` (JSON array) - stores dynamic list of selling platforms
   - Added `deliveryPartners` (JSON array) - stores dynamic list of delivery partners

2. **Order Model**:
   - Changed `platform` from enum to String - allows dynamic platform values
   - Added `deliveryPartner` (optional String) - delivery partner name
   - Added `trackingId` (optional String) - shipment tracking ID

## Migration Steps

### Option 1: Using Prisma Migrate (Recommended for Development)

1. **Stop the backend server** if it's running (to avoid file locking issues)

2. **Run the migration**:
   ```bash
   cd backend
   npx prisma migrate dev --name add_platforms_delivery_tracking
   ```

3. **This will automatically**:
   - Create a new migration file
   - Apply the migration to your database
   - Regenerate the Prisma Client

### Option 2: Manual Migration (For Production or if Option 1 fails)

1. **Stop the backend server** if running

2. **Generate migration SQL without applying**:
   ```bash
   cd backend
   npx prisma migrate dev --create-only --name add_platforms_delivery_tracking
   ```

3. **Review the generated SQL** in `backend/prisma/migrations/[timestamp]_add_platforms_delivery_tracking/migration.sql`

4. **Apply the migration**:
   ```bash
   npx prisma migrate deploy
   ```

5. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Option 3: Database Reset (Development Only - ⚠️ WILL DELETE ALL DATA)

If you're in development and don't mind losing data:
```bash
cd backend
npx prisma migrate reset
```

## Verification

After migration, verify everything is working:

1. **Check database schema**:
   ```bash
   npx prisma studio
   ```
   - Open Settings table - should see `sellingPlatforms` and `deliveryPartners` columns
   - Open Order table - should see `deliveryPartner` and `trackingId` columns

2. **Test the application**:
   - Navigate to Admin → Settings
   - You should see sections for "Selling Platforms" and "Delivery Partners"
   - Add/remove platforms and partners using the tag interface
   - Save settings
   - Navigate to Admin → Orders
   - Create a new order - platforms should come from settings
   - Edit an order - you should see delivery partner and tracking ID fields

## Default Data

The system will automatically create default values on first access:
- **Selling Platforms**: Amazon, Flipkart, Meesho, Etsy
- **Delivery Partners**: Delhivery, Blue Dart, DTDC, India Post

You can modify these in the Settings page.

## Troubleshooting

### If migration fails with "operation not permitted":
- Make sure the backend server is completely stopped
- Close any database GUI tools (like Prisma Studio, MySQL Workbench)
- Try closing and reopening your terminal/IDE

### If you get "environment is non-interactive":
- You're likely running in a script or CI/CD
- Use `npx prisma migrate deploy` instead of `migrate dev`

### To manually fix backend TypeScript errors:
If you see TypeScript errors in `settings.controller.ts` about `sellingPlatforms`, just run:
```bash
npx prisma generate
```

This regenerates the Prisma client with the new schema.

## Rollback (if needed)

If you need to rollback this migration:

1. **Find the migration**:
   ```bash
   cd backend/prisma/migrations
   # Look for the folder with the name containing "add_platforms_delivery_tracking"
   ```

2. **Rollback**:
   ```bash
   npx prisma migrate resolve --rolled-back [migration_name]
   ```

3. **Manually revert database** (if needed):
   - Remove `sellingPlatforms` and `deliveryPartners` columns from Settings
   - Remove `deliveryPartner` and `trackingId` columns from Order
   - Change `platform` column back to ENUM in Order table

## Summary

After completing the migration, the system will have:
- ✅ Dynamic platform management in Settings
- ✅ Dynamic delivery partner management in Settings
- ✅ Delivery tracking (partner + tracking ID) in Orders
- ✅ Enhanced order listing with shipping information
