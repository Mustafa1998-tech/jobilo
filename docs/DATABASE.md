# Database Documentation

Jobilo uses **PostgreSQL 16** with **Prisma ORM 7** as the data access layer.

## Connection

```
DATABASE_URL=postgresql://user:password@localhost:5432/jobilo
```

Connection pooling is handled by Prisma with `@prisma/adapter-pg`. The `PrismaService` is a singleton NestJS provider exported from `AppModule`.

```typescript
// src/common/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## Schema Overview (30+ Models)

The Prisma schema is defined at `backend/prisma/schema.prisma` with the following models:

| Model | Table Name | Purpose |
|-------|------------|---------|
| `User` | `users` | Core user account |
| `FreelancerProfile` | `freelancer_profiles` | Freelancer details |
| `ClientProfile` | `client_profiles` | Client details |
| `Skill` | `skills` | Skill definitions |
| `Category` | `categories` | Project categories |
| `FreelancerSkill` | `freelancer_skills` | M2M freelancer→skills |
| `Portfolio` | `portfolios` | Freelancer portfolio items |
| `Project` | `projects` | Project listings |
| `ProjectSkill` | `project_skills` | M2M project→skills |
| `ProjectAttachment` | `project_attachments` | Project files |
| `Proposal` | `proposals` | Freelancer proposals |
| `ProposalAttachment` | `proposal_attachments` | Proposal files |
| `Contract` | `contracts` | Contracts |
| `Milestone` | `milestones` | Contract milestones |
| `Deliverable` | `deliverables` | Milestone deliverables |
| `Message` | `messages` | Chat messages |
| `MessageAttachment` | `message_attachments` | Message files |
| `Review` | `reviews` | Reviews/ratings |
| `Notification` | `notifications` | In-app notifications |
| `Dispute` | `disputes` | Contract disputes |
| `DisputeParticipant` | `dispute_participants` | Dispute participants |
| `DisputeMessage` | `dispute_messages` | Dispute messages |
| `ProjectBookmark` | `project_bookmarks` | Saved/bookmarked projects |
| `SocialLink` | `social_links` | User social links |
| `AuditLog` | `audit_logs` | Audit trail |
| `UserSession` | `user_sessions` | Active sessions |
| `EmailVerification` | `email_verifications` | OTP records |
| `Badge` | `badges` | Badge definitions |
| `UserBadge` | `user_badges` | User-earned badges |
| `PlatformSetting` | `platform_settings` | Key-value settings |
| `SavedSearch` | `saved_searches` | Saved search filters |
| `AdminProfile` | `admin_profiles` | Admin profile |
| `AdminRole` | `admin_roles` | Admin role definitions |
| `AdminPermission` | `admin_permissions` | Permission definitions |
| `AdminRolePermission` | `admin_role_permissions` | M2M roles→permissions |
| `AdminUserRole` | `admin_user_roles` | M2M users→admin roles |
| `AdminLoginHistory` | `admin_login_history` | Admin login log |
| `AdminNotification` | `admin_notifications` | Admin notifications |
| `AdminActivityLog` | `admin_activity_logs` | Admin activity trail |
| `IpWhitelist` | `ip_whitelist` | Allowed IPs |
| `IpBlacklist` | `ip_blacklist` | Blocked IPs |
| `ErrorLog` | `error_logs` | System error logs |
| `SubscriptionPlan` | `subscription_plans` | Plan definitions |
| `Subscription` | `subscriptions` | User subscriptions |
| `UserReport` | `user_reports` | User/content reports |
| `ContentPage` | `content_pages` | Static content pages |
| `BlogPost` | `blog_posts` | Blog articles |
| `FaqCategory` | `faq_categories` | FAQ category |
| `Faq` | `faqs` | FAQ entries |
| `Banner` | `banners` | Promotional banners |
| `AnalyticsEvent` | `analytics_events` | Analytics data points |
| `UserDevice` | `user_devices` | User device tracking |
| `SecurityLog` | `security_logs` | Security events |

## Naming Conventions

- **Tables:** snake_case (e.g., `freelancer_profiles`), defined via `@@map("table_name")`
- **Columns:** snake_case (e.g., `first_name`), defined via `@map("column_name")`
- **Enums:** PascalCase (e.g., `ProjectStatus`, `UserRole`)
- **Primary keys:** UUID v4, named `id`
- **Foreign keys:** `relatedModelName` + `Id` (e.g., `userId`, `projectId`)
- **Timestamps:** `created_at`, `updated_at`
- **Soft delete:** `deleted_at` column on `User`
- **Indexes:** Named by Prisma convention, defined with `@@index()`

## Migration Strategy

Migrations are managed with Prisma Migrate:

```bash
# Create migration
npx prisma migrate dev --name add_user_roles

# Apply to production
npx prisma migrate deploy

# Reset (dev only)
npx prisma migrate reset --force

# Generate Prisma client
npx prisma generate
```

**See:** [MIGRATIONS.md](./MIGRATIONS.md) for detailed migration guide.

## Connection Pooling

Prisma manages connection pooling internally. For production, a connection pooler like PgBouncer is recommended. Configure via `DATABASE_URL`:

```
DATABASE_URL=postgresql://user:password@host:5432/jobilo?pool_timeout=10&connection_limit=20
```

## Backup Strategy

- **Daily:** Automated `pg_dump` to cloud storage (S3-compatible)
- **Point-in-time recovery:** WAL archiving enabled
- **Pre-migration:** Automatic backup via `prisma migrate deploy` hooks
- **Retention:** 30 days daily, 12 monthly backups

## Indexes and Performance

Key indexes beyond primary keys:

| Table | Index | Type |
|-------|-------|------|
| `users` | `[email]` | B-tree |
| `users` | `[role, status]` | Composite |
| `users` | `[createdAt]` | B-tree |
| `projects` | `[status, createdAt]` | Composite |
| `projects` | `[status, budgetMax]` | Composite |
| `projects` | `[isFeatured, status]` | Composite |
| `projects` | `[slug]` | Unique B-tree |
| `proposals` | `[projectId, status]` | Composite |
| `proposals` | `[projectId, freelancerId]` | Unique composite |
| `messages` | `[senderId, receiverId]` | Composite |
| `messages` | `[isRead, receiverId]` | Composite |
| `notifications` | `[userId, isRead]` | Composite |
| `freelancer_profiles` | `[averageRating]` | B-tree |
| `freelancer_profiles` | `[hourlyRate]` | B-tree |
| `user_sessions` | `[refreshToken]` | Unique B-tree |
| `email_verifications` | `[email, type]` | Composite |

## Enums

**See:** [TABLES.md](./TABLES.md) for full enum definitions.

## ER Diagram

A complete Entity Relationship Diagram is available in [ERD.md](./ERD.md).
