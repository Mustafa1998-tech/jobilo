# Table Documentation

## Enums

### UserRole
| Value | Description |
|-------|-------------|
| `FREELANCER` | مستقل — can submit proposals, work on contracts |
| `CLIENT` | صاحب مشروع — can post projects, hire freelancers |
| `ADMIN` | مشرف — limited admin access |
| `SUPER_ADMIN` | مدير النظام — full system access |

### UserStatus
| Value | Description |
|-------|-------------|
| `PENDING` | قيد الانتظار — email not verified |
| `ACTIVE` | نشط — fully active |
| `SUSPENDED` | موقوف — temporarily suspended |
| `BANNED` | محظور — permanently banned |
| `DELETED` | محذوف — soft-deleted |

### ProjectStatus
| Value | Description |
|-------|-------------|
| `DRAFT` | مسودة — not published |
| `OPEN` | مفتوح — accepting proposals |
| `UNDER_REVIEW` | قيد المراجعة |
| `IN_PROGRESS` | قيد التنفيذ — contract signed |
| `COMPLETED` | مكتمل |
| `CANCELLED` | ملغي |
| `ON_HOLD` | معلق |
| `DISPUTED` | نزاع — dispute active |
| `ARCHIVED` | مؤرشف |

### ProposalStatus
| Value | Description |
|-------|-------------|
| `PENDING` | قيد الانتظار — awaiting client decision |
| `ACCEPTED` | مقبول |
| `REJECTED` | مرفوض |
| `WITHDRAWN` | مسحوب — freelancer withdrew |
| `SHORTLISTED` | قائمة مختصرة |

### ContractStatus
| Value | Description |
|-------|-------------|
| `DRAFT` | مسودة |
| `SIGNED` | موقع |
| `IN_PROGRESS` | قيد التنفيذ |
| `COMPLETED` | مكتمل |
| `CANCELLED` | ملغي |
| `DISPUTED` | نزاع |

### MilestoneStatus
| Value | Description |
|-------|-------------|
| `PENDING` | قيد الانتظار |
| `IN_PROGRESS` | قيد التنفيذ |
| `SUBMITTED` | تم التسليم |
| `APPROVED` | معتمد |
| `REJECTED` | مرفوض |

### ReviewType
| Value | Description |
|-------|-------------|
| `CLIENT_TO_FREELANCER` | تقييم صاحب المشروع للمستقل |
| `FREELANCER_TO_CLIENT` | تقييم المستقل لصاحب المشروع |

### NotificationType
| Value | Trigger |
|-------|---------|
| `NEW_PROPOSAL` | New proposal submitted |
| `PROPOSAL_ACCEPTED` | Proposal accepted |
| `PROPOSAL_REJECTED` | Proposal rejected |
| `NEW_MESSAGE` | New message |
| `PROJECT_STATUS_CHANGE` | Project status change |
| `MILESTONE_COMPLETED` | Milestone completed |
| `REVIEW_RECEIVED` | Review received |
| `DISPUTE_OPENED` | Dispute opened |
| `DISPUTE_RESOLVED` | Dispute resolved |
| `SYSTEM_ANNOUNCEMENT` | System announcement |

### AdminModule
Dashboard, USERS, PROJECTS, PROPOSALS, CONTRACTS, DISPUTES, REPORTS, SUBSCRIPTIONS, CONTENT, BLOG, FAQ, BANNERS, SETTINGS, ROLES, AUDIT_LOGS, ANALYTICS, SECURITY

### AdminAction
CREATE, READ, UPDATE, DELETE, APPROVE, REJECT, BLOCK, UNBLOCK, BAN, WARN

### FileType
IMAGE, DOCUMENT, VIDEO, OTHER

### DisputeStatus
OPEN, UNDER_REVIEW, RESOLVED, ESCALATED

### SkillLevel
BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

### ReportStatus
PENDING, INVESTIGATING, RESOLVED, DISMISSED

### ContentStatus
DRAFT, PUBLISHED, ARCHIVED

### AnalyticsMetric
PAGE_VIEW, SIGNUP, LOGIN, PROJECT_CREATED, PROPOSAL_SUBMITTED, CONTRACT_STARTED, CONTRACT_COMPLETED, DISPUTE_OPENED

---

## Key Tables

### `users`
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PK | `gen_random_uuid()` | Primary key |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | — | User email |
| `email_verified_at` | TIMESTAMPTZ | — | `null` | Email verification timestamp |
| `phone` | VARCHAR(20) | UNIQUE | `null` | Phone number |
| `password_hash` | VARCHAR(255) | NOT NULL | — | bcrypt hash |
| `role` | `UserRole` | NOT NULL | `FREELANCER` | Account role |
| `status` | `UserStatus` | NOT NULL | `PENDING` | Account status |
| `is_profile_complete` | BOOLEAN | NOT NULL | `false` | Profile completion flag |
| `is_two_factor_enabled` | BOOLEAN | NOT NULL | `false` | 2FA enabled |
| `login_attempts` | INT | NOT NULL | `0` | Failed login counter |
| `locked_until` | TIMESTAMPTZ | — | `null` | Account lock expiry |
| `last_login_at` | TIMESTAMPTZ | — | `null` | Last successful login |
| `last_ip` | VARCHAR(45) | — | `null` | Last IP address |
| `locale` | VARCHAR(5) | NOT NULL | `'ar'` | Language preference |
| `timezone` | VARCHAR(50) | NOT NULL | `'Africa/Khartoum'` | User timezone |
| `deleted_at` | TIMESTAMPTZ | — | `null` | Soft delete timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL | `now()` | Record created |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `now()` | Record updated |

**Indexes:** `[email]`, `[role, status]`, `[createdAt]`, `[deletedAt]`

### `freelancer_profiles`
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PK | UUID | Primary key |
| `user_id` | UUID | FK → users.id, UNIQUE | — | Owner |
| `first_name` | VARCHAR(100) | NOT NULL | — | الاسم الأول |
| `last_name` | VARCHAR(100) | NOT NULL | — | اسم العائلة |
| `title` | VARCHAR(200) | — | `null` | المسمى الوظيفي |
| `bio` | TEXT | — | `null` | نبذة عني |
| `avatar_url` | VARCHAR(500) | — | `null` | Profile picture |
| `banner_url` | VARCHAR(500) | — | `null` | Banner image |
| `hourly_rate` | DECIMAL(10,2) | — | `null` | السعر بالساعة |
| `fixed_rate` | DECIMAL(10,2) | — | `null` | السعر الثابت |
| `experience_level` | `SkillLevel` | NOT NULL | `INTERMEDIATE` | مستوى الخبرة |
| `available_for_hire` | BOOLEAN | NOT NULL | `true` | متاح للعمل |
| `average_rating` | DECIMAL(3,2) | — | `0` | متوسط التقييم |
| `languages` | JSONB | — | `[]` | Languages spoken |
| `education` | JSONB | — | `[]` | Education history |
| `certifications` | JSONB | — | `[]` | Certifications |

**Indexes:** `[userId]`, `[averageRating]`, `[hourlyRate]`, `[availableForHire]`

### `client_profiles`
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PK | UUID | Primary key |
| `user_id` | UUID | FK → users.id, UNIQUE | — | Owner |
| `company_name` | VARCHAR(200) | NOT NULL | — | اسم الشركة |
| `company_website` | VARCHAR(500) | — | `null` | Company website |
| `average_rating` | DECIMAL(3,2) | — | `0` | Client rating |
| `hire_rate` | DECIMAL(5,2) | — | `null` | Rate of hiring freelancers |

**Indexes:** `[userId]`, `[averageRating]`, `[isVerified]`

### `projects`
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PK | UUID | Primary key |
| `client_id` | UUID | FK → users.id | — | Project owner |
| `category_id` | UUID | FK → categories.id | — | Category |
| `title` | VARCHAR(255) | NOT NULL | — | Project title |
| `slug` | VARCHAR(255) | UNIQUE | — | URL-friendly title |
| `description` | TEXT | NOT NULL | — | Detailed description |
| `project_type` | VARCHAR(20) | NOT NULL | `'FIXED'` | FIXED or HOURLY |
| `budget_min` | DECIMAL(10,2) | — | `null` | Minimum budget |
| `budget_max` | DECIMAL(10,2) | — | `null` | Maximum budget |
| `budget_fixed` | DECIMAL(10,2) | — | `null` | Fixed price |
| `hourly_min` | DECIMAL(10,2) | — | `null` | Min hourly rate |
| `hourly_max` | DECIMAL(10,2) | — | `null` | Max hourly rate |
| `duration_days` | INT | NOT NULL | — | Expected duration |
| `experience_level` | `SkillLevel` | NOT NULL | `INTERMEDIATE` | Required level |
| `status` | `ProjectStatus` | NOT NULL | `OPEN` | Current status |
| `is_featured` | BOOLEAN | NOT NULL | `false` | Featured project |
| `proposals_count` | INT | NOT NULL | `0` | Counter cache |
| `views_count` | INT | NOT NULL | `0` | View counter |
| `saved_count` | INT | NOT NULL | `0` | Bookmark counter |

**Indexes:** `[clientId]`, `[categoryId]`, `[status]`, `[slug]`, `[status, createdAt]`, `[isFeatured, status]`

### `proposals`
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PK | UUID | Primary key |
| `project_id` | UUID | FK → projects.id | — | Target project |
| `freelancer_id` | UUID | FK → users.id | — | Freelancer |
| `cover_letter` | TEXT | NOT NULL | — | Proposal letter |
| `bid_amount` | DECIMAL(10,2) | NOT NULL | — | Bid price |
| `duration_days` | INT | NOT NULL | — | Proposed duration |
| `status` | `ProposalStatus` | NOT NULL | `PENDING` | Current status |
| `ai_score` | DECIMAL(5,2) | — | `0` | AI match score |
| `is_ai_generated` | BOOLEAN | NOT NULL | `false` | AI-assisted |
| `is_seen` | BOOLEAN | NOT NULL | `false` | Client seen flag |

**Unique:** `[projectId, freelancerId]`

### `contracts`
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PK | UUID | Primary key |
| `project_id` | UUID | FK → projects.id | — | Project |
| `proposal_id` | UUID | FK → proposals.id | — | Source proposal |
| `freelancer_id` | UUID | FK → users.id | — | Freelancer |
| `client_id` | UUID | FK → users.id | — | Client |
| `status` | `ContractStatus` | NOT NULL | `DRAFT` | Contract status |
| `terms` | TEXT | — | `null` | Custom terms |
| `is_nda_signed` | BOOLEAN | NOT NULL | `false` | NDA status |

**Indexes:** `[projectId]`, `[freelancerId]`, `[clientId]`, `[status]`

### `messages`
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PK | UUID | Primary key |
| `sender_id` | UUID | FK → users.id | — | Sender |
| `receiver_id` | UUID | FK → users.id | — | Receiver |
| `project_id` | UUID | FK → projects.id | — | Related project |
| `content` | TEXT | NOT NULL | — | Message body |
| `is_read` | BOOLEAN | NOT NULL | `false` | Read status |
| `parent_id` | UUID | FK → messages.id | — | Reply reference |

**Indexes:** `[senderId, receiverId]`, `[projectId]`, `[isRead, receiverId]`, `[createdAt]`

### `reviews`
| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | UUID | PK | UUID | Primary key |
| `contract_id` | UUID | FK → contracts.id | — | Contract |
| `reviewer_id` | UUID | FK → users.id | — | Reviewer |
| `reviewee_id` | UUID | FK → users.id | — | Reviewee |
| `type` | `ReviewType` | NOT NULL | — | Direction |
| `rating` | INT | NOT NULL (1-5) | — | Overall rating |
| `quality` | INT | — | `null` | Quality sub-score |
| `communication` | INT | — | `null` | Communication score |
| `adherence` | INT | — | `null` | Adherence to terms |
| `timeliness` | INT | — | `null` | Timeliness score |
| `comment` | TEXT | — | `null` | Written review |

**Unique:** `[contractId, reviewerId, type]`

---

## Foreign Key Relationships

| Source Table | Column | Target Table | Target Column | On Delete |
|-------------|--------|--------------|---------------|-----------|
| `freelancer_profiles` | `user_id` | `users` | `id` | CASCADE |
| `client_profiles` | `user_id` | `users` | `id` | CASCADE |
| `projects` | `client_id` | `users` | `id` | NO ACTION |
| `projects` | `category_id` | `categories` | `id` | NO ACTION |
| `proposals` | `project_id` | `projects` | `id` | NO ACTION |
| `proposals` | `freelancer_id` | `users` | `id` | NO ACTION |
| `contracts` | `project_id` | `projects` | `id` | NO ACTION |
| `contracts` | `proposal_id` | `proposals` | `id` | NO ACTION |
| `contracts` | `freelancer_id` | `users` | `id` | NO ACTION |
| `contracts` | `client_id` | `users` | `id` | NO ACTION |
| `messages` | `sender_id` | `users` | `id` | NO ACTION |
| `messages` | `receiver_id` | `users` | `id` | NO ACTION |
| `notifications` | `user_id` | `users` | `id` | CASCADE |
| `user_sessions` | `user_id` | `users` | `id` | CASCADE |
| `freelancer_skills` | `freelancer_profile_id` | `freelancer_profiles` | `id` | CASCADE |
| `freelancer_skills` | `skill_id` | `skills` | `id` | CASCADE |
| `project_skills` | `project_id` | `projects` | `id` | CASCADE |
| `project_skills` | `skill_id` | `skills` | `id` | CASCADE |

**Relations marked CASCADE** — when parent is deleted, child records are automatically deleted.
**Relations marked NO ACTION** — child must be resolved before parent can be deleted.

**See:** [DATABASE.md](./DATABASE.md) for schema overview, [ERD.md](./ERD.md) for diagram.
