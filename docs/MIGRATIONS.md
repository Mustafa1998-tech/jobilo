# Migration Guide

Jobilo uses **Prisma Migrate** for database schema management with PostgreSQL 16.

## Prisma Migration Workflow

### 1. Modify the Schema

Edit `backend/prisma/schema.prisma` to add/modify models, fields, enums, or indexes.

### 2. Create a Migration

```bash
cd backend

# Development migration
npx prisma migrate dev --name describe_your_change
```

This command:
- Compares the schema with the current database
- Generates a SQL migration file in `prisma/migrations/`
- Applies the migration to the local database
- Generates/updates the Prisma Client

### 3. Review the Migration

```bash
# View the generated SQL
cat prisma/migrations/20240101000000_describe_your_change/migration.sql
```

Always review the generated SQL to ensure it matches expectations.

### 4. Apply to Production

```bash
# Apply all pending migrations
npx prisma migrate deploy
```

### 5. Generate Client

```bash
# Regenerate Prisma Client for TypeScript
npx prisma generate
```

## Scripts (from package.json)

```json
{
  "prisma:generate": "prisma generate",
  "prisma:push": "prisma db push",
  "prisma:studio": "prisma studio",
  "prisma:seed": "ts-node prisma/seed.ts",
  "prisma:reset": "prisma migrate reset --force",
  "prisma:migrate": "prisma migrate dev"
}
```

## Creating Migrations

### Standard Migration

```bash
npm run prisma:migrate -- --name add_user_avatar
```

### Migration with Custom SQL

Edit the generated `.sql` file before applying:

```sql
-- Example: adding a computed column or setting defaults for existing rows
UPDATE "users" SET "locale" = 'ar' WHERE "locale" IS NULL;
```

Then apply:

```bash
npx prisma migrate dev
```

## Applying Migrations

### Development

```bash
npx prisma migrate dev
# or
npm run prisma:migrate
```

### Production / CI

```bash
npx prisma migrate deploy
# then
npx prisma generate
```

### Staging / Preview

```bash
npx prisma migrate deploy
```

## Rolling Back Migrations

Prisma Migrate does not support rollback. To revert:

### Option 1: Down-migration

Manually create a new migration that reverses the changes:

1. Edit `schema.prisma` to revert the model
2. Run `npx prisma migrate dev --name revert_xxx`

### Option 2: Database reset (development only)

```bash
npx prisma migrate reset --force
# Applies all migrations from scratch, runs seed
```

### Option 3: Manual SQL

For production emergencies, write a manual down-migration SQL:

```sql
ALTER TABLE "users" DROP COLUMN "avatar_url";
```

Run directly via `psql` or a database client.

## Seeding Data

The seed script is at `backend/prisma/seed.ts`:

```bash
# Run seed
npm run prisma:seed

# Reset and seed
npx prisma migrate reset --force
```

Seed data should include:
- Default `AdminRole` entries (Super Admin, Admin, Moderator)
- Default `AdminPermission` entries (all module/action combinations)
- `SubscriptionPlan` entries
- Initial `Category` entries
- Demo `Skill` entries
- Optional: demo `User` accounts for testing

```typescript
// Example seed pattern
async function main() {
  const prisma = new PrismaClient();

  // Create admin roles
  const superAdmin = await prisma.adminRole.create({
    data: { name: 'Super Admin', nameAr: 'مدير النظام', isSystem: true, priority: 1 },
  });

  // Seed categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Web Development', nameAr: 'تطوير مواقع', slug: 'web-development' },
      { name: 'Mobile Apps', nameAr: 'تطبيقات جوال', slug: 'mobile-apps' },
    ],
  });
}
```

## Migration Best Practices

### ✅ Do

- **One migration per logical change** — avoid mixing unrelated changes
- **Review generated SQL** before applying
- **Back up production database** before deployment
- **Test migrations** on staging first
- **Use descriptive names** like `add_user_language_pref` not `fix`
- **Commit migration files** to version control
- **Include `@@map()`** for tables when adding models
- **Wrap data migrations** in a transaction

### ❌ Don't

- **Never edit existing migration files** after they've been applied
- **Don't use `prisma db push` in production** — use `prisma migrate deploy`
- **Avoid making nullable fields required** without a default or backfill
- **Don't rename columns directly** — use `@map` for Prisma-side rename, then migrate SQL side

## Common Migration Scenarios

### Adding a New Model

```prisma
model UserDevice {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceId  String   @map("device_id") @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, deviceId])
  @@map("user_devices")
}
```

Migration: `npx prisma migrate dev --name add_user_devices`

### Adding a Column

```prisma
model User {
  // existing fields...
  avatarUrl String? @map("avatar_url")
}
```

Migration: `npx prisma migrate dev --name add_user_avatar`

### Adding an Index

```prisma
model Project {
  // ...
  @@index([status, createdAt])
}
```

Migration: `npx prisma migrate dev --name add_project_status_created_idx`

### Renaming a Field

1. Add `@map()` decorator with the new DB column name
2. Create migration
3. Edit the generated SQL to add `RENAME COLUMN`
4. Apply
5. Remove old field name from Prisma

### Changing a Field Type

```prisma
model FreelancerProfile {
  hourlyRate Decimal? @map("hourly_rate") @db.Decimal(12, 2) // was Decimal(10, 2)
}
```

Prisma will generate `ALTER COLUMN ... TYPE` with `USING` clause if needed.

## Prisma Studio

For development database inspection:

```bash
npx prisma studio
```

Opens at `http://localhost:5555` with a GUI for viewing and editing data.

**See:** [DATABASE.md](./DATABASE.md) for schema overview, [TABLES.md](./TABLES.md) for column definitions.
