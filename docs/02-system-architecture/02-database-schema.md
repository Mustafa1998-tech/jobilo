# Jobilo - Database Schema (Prisma)

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Tables** | snake_case, plural | `users`, `projects`, `proposals` |
| **Columns** | snake_case | `first_name`, `created_at` |
| **Primary Key** | `id` (UUID) | `id` |
| **Foreign Key** | `{table}_id` | `user_id`, `project_id` |
| **Indexes** | `idx_{table}_{column}` | `idx_projects_status` |
| **Unique Indexes** | `uq_{table}_{columns}` | `uq_users_email` |
| **Enums** | PascalCase | `UserRole`, `ProjectStatus` |
| **Relations** | camelCase | `user`, `project`, `proposals` |
| **Soft Delete** | `deleted_at` (nullable timestamp) | `deleted_at` |
| **Timestamps** | `created_at`, `updated_at` | All tables |
| **Boolean** | `is_` prefix | `is_verified`, `is_active` |

---

## Enums

```prisma
enum UserRole {
  FREELANCER
  CLIENT
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  PENDING      // لم يؤكد البريد
  ACTIVE       // نشط
  SUSPENDED    // موقوف
  BANNED       // ممنوع
  DELETED      // محذوف
}

enum ProjectStatus {
  DRAFT
  OPEN
  UNDER_REVIEW
  IN_PROGRESS
  COMPLETED
  CANCELLED
  ON_HOLD
  DISPUTED
  ARCHIVED
}

enum ProposalStatus {
  PENDING      // قيد المراجعة
  ACCEPTED     // مقبول
  REJECTED     // مرفوض
  WITHDRAWN    // مسحوب
  SHORTLISTED  // ضمن القائمة المختصرة
}

enum ContractStatus {
  DRAFT
  SIGNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  DISPUTED
}

enum PaymentStatus {
  PENDING      // معلق
  FUNDED       // مدفوع في escrow
  RELEASED     // محرر للمستقل
  REFUNDED     // مسترجع
  PARTIALLY_REFUNDED
  FAILED       // فشل
}

enum MilestoneStatus {
  PENDING      // لم يبدأ
  IN_PROGRESS  // قيد التنفيذ
  SUBMITTED    // تم التسليم
  APPROVED     // تمت الموافقة
  REJECTED     // مرفوض
}

enum ReviewType {
  CLIENT_TO_FREELANCER
  FREELANCER_TO_CLIENT
}

enum NotificationType {
  NEW_PROPOSAL
  PROPOSAL_ACCEPTED
  PROPOSAL_REJECTED
  NEW_MESSAGE
  PROJECT_STATUS_CHANGE
  PAYMENT_RECEIVED
  MILESTONE_COMPLETED
  REVIEW_RECEIVED
  DISPUTE_OPENED
  DISPUTE_RESOLVED
  SYSTEM_ANNOUNCEMENT
}

enum FileType {
  IMAGE
  DOCUMENT
  VIDEO
  OTHER
}

enum DisputeStatus {
  OPEN
  UNDER_REVIEW
  RESOLVED
  ESCALATED
}

enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  PAYMENT
  REFUND
  FEE
  COMMISSION
}
```

---

## Tables (Complete Schema)

### 1. users — جدول المستخدمين الأساسي

```prisma
model User {
  id                  String    @id @default(uuid()) @db.Uuid
  email               String    @unique
  email_verified_at   DateTime? @map("email_verified_at")
  phone               String?   @unique
  phone_verified_at   DateTime? @map("phone_verified_at")
  password_hash       String    @map("password_hash")
  role                UserRole  @default(FREELANCER)
  status              UserStatus @default(PENDING)
  is_profile_complete Boolean   @default(false) @map("is_profile_complete")
  is_two_factor_enabled Boolean @default(false) @map("is_two_factor_enabled")
  two_factor_secret   String?   @map("two_factor_secret")
  login_attempts      Int       @default(0) @map("login_attempts")
  locked_until        DateTime? @map("locked_until")
  last_login_at       DateTime? @map("last_login_at")
  last_ip             String?   @map("last_ip")
  locale              String    @default("ar")
  timezone            String    @default("Africa/Khartoum")
  currency            String    @default("USD")
  deleted_at          DateTime? @map("deleted_at")
  created_at          DateTime  @default(now()) @map("created_at")
  updated_at          DateTime  @updatedAt @map("updated_at")

  // Relations
  freelancer_profile  FreelancerProfile?
  client_profile      ClientProfile?
  portfolios          Portfolio[]
  projects_posted     Project[]           @relation("ClientProjects")
  proposals           Proposal[]
  contracts           Contract[]          @relation("ContractsAsFreelancer")
  contracts_as_client Contract[]          @relation("ContractsAsClient")
  messages_sent       Message[]           @relation("SentMessages")
  messages_received   Message[]           @relation("ReceivedMessages")
  reviews_given       Review[]            @relation("ReviewsGiven")
  reviews_received    Review[]            @relation("ReviewsReceived")
  notifications       Notification[]
  audit_logs          AuditLog[]
  transactions        Transaction[]
  payment_accounts    PaymentAccount[]
  social_links        SocialLink[]
  bookmarks           ProjectBookmark[]
  dispute_participants DisputeParticipant[]
  dispute_messages    DisputeMessage[]

  @@index([email])
  @@index([role, status])
  @@index([created_at])
  @@index([deleted_at])
  @@map("users")
}
```

### 2. freelancer_profiles — ملف المستقل

```prisma
model FreelancerProfile {
  id             String    @id @default(uuid()) @db.Uuid
  user_id        String    @unique @map("user_id") @db.Uuid
  first_name     String    @map("first_name")
  last_name      String    @map("last_name")
  title          String?   // Professional title (e.g., "Full Stack Developer")
  bio            String?   // About me
  avatar_url     String?   @map("avatar_url")
  banner_url     String?   @map("banner_url")
  hourly_rate    Decimal?  @map("hourly_rate") @db.Decimal(10, 2)
  fixed_rate     Decimal?  @map("fixed_rate") @db.Decimal(10, 2)
  experience_level SkillLevel @default(INTERMEDIATE) @map("experience_level")
  years_experience Int?    @map("years_experience")
  available_for_hire Boolean @default(true) @map("available_for_hire")
  is_verified    Boolean   @default(false) @map("is_verified")
  verified_at    DateTime? @map("verified_at")
  job_success_score Decimal? @default(0) @map("job_success_score") @db.Decimal(5, 2)
  total_earnings Decimal?  @default(0) @map("total_earnings") @db.Decimal(12, 2)
  total_projects Int       @default(0) @map("total_projects")
  total_hours    Decimal?  @default(0) @map("total_hours") @db.Decimal(10, 2)
  average_rating Decimal?  @default(0) @map("average_rating") @db.Decimal(3, 2)
  completed_projects Int   @default(0) @map("completed_projects")
  response_time  Int?      @map("response_time") // minutes
  response_rate  Decimal?  @map("response_rate") @db.Decimal(5, 2)
  on_time_rate   Decimal?  @map("on_time_rate") @db.Decimal(5, 2)
  on_budget_rate Decimal?  @map("on_budget_rate") @db.Decimal(5, 2)
  languages      Json?     @default("[]")
  education      Json?     @default("[]")
  certifications Json?     @default("[]")
  created_at     DateTime  @default(now()) @map("created_at")
  updated_at     DateTime  @updatedAt @map("updated_at")

  // Relations
  user               User       @relation(fields: [user_id], references: [id], onDelete: Cascade)
  skills             FreelancerSkill[]
  portfolios         Portfolio[]

  @@index([user_id])
  @@index([average_rating])
  @@index([hourly_rate])
  @@index([total_projects])
  @@index([job_success_score])
  @@index([available_for_hire])
  @@index([experience_level])
  @@index([created_at])
  @@map("freelancer_profiles")
}
```

### 3. client_profiles — ملف العميل

```prisma
model ClientProfile {
  id                String    @id @default(uuid()) @db.Uuid
  user_id           String    @unique @map("user_id") @db.Uuid
  company_name      String    @map("company_name")
  company_website   String?   @map("company_website")
  company_size      String?   @map("company_size")
  industry          String?
  description       String?
  logo_url          String?   @map("logo_url")
  banner_url        String?   @map("banner_url")
  location          String?
  is_verified       Boolean   @default(false) @map("is_verified")
  verified_at       DateTime? @map("verified_at")
  total_projects_posted Int   @default(0) @map("total_projects_posted")
  total_spent       Decimal?  @default(0) @map("total_spent") @db.Decimal(12, 2)
  average_rating    Decimal?  @default(0) @map("average_rating") @db.Decimal(3, 2)
  hire_rate         Decimal?  @map("hire_rate") @db.Decimal(5, 2)
  created_at        DateTime  @default(now()) @map("created_at")
  updated_at        DateTime  @updatedAt @map("updated_at")

  // Relations
  user              User  @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([average_rating])
  @@index([total_projects_posted])
  @@index([is_verified])
  @@map("client_profiles")
}
```

### 4. skills — جدول المهارات (المرجعي)

```prisma
model Skill {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique
  name_ar     String?  @map("name_ar")
  category_id String?  @map("category_id") @db.Uuid
  description String?
  icon        String?
  is_active   Boolean  @default(true) @map("is_active")
  created_at  DateTime @default(now()) @map("created_at")
  updated_at  DateTime @updatedAt @map("updated_at")

  // Relations
  category          Category?          @relation(fields: [category_id], references: [id])
  freelancer_skills FreelancerSkill[]
  project_skills    ProjectSkill[]

  @@index([name])
  @@index([category_id])
  @@index([is_active])
  @@map("skills")
}
```

### 5. categories — التصنيفات

```prisma
model Category {
  id          String     @id @default(uuid()) @db.Uuid
  name        String     @unique
  name_ar     String?    @map("name_ar")
  slug        String     @unique
  description String?
  icon        String?
  color       String?
  parent_id   String?    @map("parent_id") @db.Uuid
  sort_order  Int        @default(0) @map("sort_order")
  is_active   Boolean    @default(true) @map("is_active")
  created_at  DateTime   @default(now()) @map("created_at")
  updated_at  DateTime   @updatedAt @map("updated_at")

  // Relations
  parent      Category?  @relation("CategoryParent", fields: [parent_id], references: [id])
  children    Category[] @relation("CategoryParent")
  skills      Skill[]
  projects    Project[]

  @@index([slug])
  @@index([parent_id])
  @@index([is_active, sort_order])
  @@map("categories")
}
```

### 6. freelancer_skills — مهارات المستقل

```prisma
model FreelancerSkill {
  id          String     @id @default(uuid()) @db.Uuid
  freelancer_profile_id String @map("freelancer_profile_id") @db.Uuid
  skill_id    String     @map("skill_id") @db.Uuid
  level       SkillLevel @default(INTERMEDIATE)
  is_top      Boolean    @default(false) @map("is_top")
  created_at  DateTime   @default(now()) @map("created_at")

  // Relations
  freelancer_profile FreelancerProfile @relation(fields: [freelancer_profile_id], references: [id], onDelete: Cascade)
  skill              Skill             @relation(fields: [skill_id], references: [id], onDelete: Cascade)

  @@unique([freelancer_profile_id, skill_id])
  @@index([skill_id])
  @@index([level])
  @@map("freelancer_skills")
}
```

### 7. portfolios — معرض الأعمال

```prisma
model Portfolio {
  id          String   @id @default(uuid()) @db.Uuid
  user_id     String   @map("user_id") @db.Uuid
  title       String
  description String?
  category_id String?  @map("category_id") @db.Uuid
  url         String?
  media_urls  Json?    @default("[]") @map("media_urls")
  tags        Json?    @default("[]")
  is_featured Boolean  @default(false) @map("is_featured")
  sort_order  Int      @default(0) @map("sort_order")
  created_at  DateTime @default(now()) @map("created_at")
  updated_at  DateTime @updatedAt @map("updated_at")

  // Relations
  user       User       @relation(fields: [user_id], references: [id], onDelete: Cascade)
  category   Category?  @relation(fields: [category_id], references: [id])

  @@index([user_id])
  @@index([category_id])
  @@index([is_featured])
  @@map("portfolios")
}
```

### 8. projects — المشاريع

```prisma
model Project {
  id               String        @id @default(uuid()) @db.Uuid
  client_id        String        @map("client_id") @db.Uuid
  category_id      String        @map("category_id") @db.Uuid
  title            String
  slug             String        @unique
  description      String
  project_type     String        @default("FIXED") @map("project_type") // FIXED | HOURLY
  budget_min       Decimal?      @map("budget_min") @db.Decimal(10, 2)
  budget_max       Decimal?      @map("budget_max") @db.Decimal(10, 2)
  budget_fixed     Decimal?      @map("budget_fixed") @db.Decimal(10, 2)
  hourly_min       Decimal?      @map("hourly_min") @db.Decimal(10, 2)
  hourly_max       Decimal?      @map("hourly_max") @db.Decimal(10, 2)
  duration_days    Int           @map("duration_days")
  experience_level SkillLevel    @default(INTERMEDIATE) @map("experience_level")
  status           ProjectStatus @default(OPEN)
  is_featured      Boolean       @default(false) @map("is_featured")
  is_urgent        Boolean       @default(false) @map("is_urgent")
  is_nda_required  Boolean       @default(false) @map("is_nda_required")
  location         String?       // "remote" or country
  proposals_count  Int           @default(0) @map("proposals_count")
  average_bid      Decimal?      @map("average_bid") @db.Decimal(10, 2)
  views_count      Int           @default(0) @map("views_count")
  saved_count      Int           @default(0) @map("saved_count")
  published_at     DateTime?     @map("published_at")
  closed_at        DateTime?     @map("closed_at")
  created_at       DateTime      @default(now()) @map("created_at")
  updated_at       DateTime      @updatedAt @map("updated_at")

  // Relations
  client            User              @relation("ClientProjects", fields: [client_id], references: [id])
  category          Category          @relation(fields: [category_id], references: [id])
  skills            ProjectSkill[]
  attachments       ProjectAttachment[]
  proposals         Proposal[]
  contracts         Contract[]
  bookmarks         ProjectBookmark[]
  disputes          Dispute[]

  @@index([client_id])
  @@index([category_id])
  @@index([status])
  @@index([slug])
  @@index([status, created_at])
  @@index([status, budget_max])
  @@index([status, experience_level])
  @@index([is_featured, status])
  @@index([published_at])
  @@index([title], type: Gin) // Full-text search
  @@index([description], type: Gin) // Full-text search
  @@map("projects")
}
```

### 9. project_skills — مهارات المشروع

```prisma
model ProjectSkill {
  id         String @id @default(uuid()) @db.Uuid
  project_id String @map("project_id") @db.Uuid
  skill_id   String @map("skill_id") @db.Uuid
  level      SkillLevel @default(INTERMEDIATE)

  // Relations
  project    Project @relation(fields: [project_id], references: [id], onDelete: Cascade)
  skill      Skill   @relation(fields: [skill_id], references: [id], onDelete: Cascade)

  @@unique([project_id, skill_id])
  @@index([skill_id])
  @@map("project_skills")
}
```

### 10. project_attachments — مرفقات المشروع

```prisma
model ProjectAttachment {
  id          String   @id @default(uuid()) @db.Uuid
  project_id  String   @map("project_id") @db.Uuid
  file_url    String   @map("file_url")
  file_name   String   @map("file_name")
  file_type   FileType @map("file_type")
  file_size   Int      @map("file_size") // bytes
  created_at  DateTime @default(now()) @map("created_at")

  // Relations
  project     Project  @relation(fields: [project_id], references: [id], onDelete: Cascade)

  @@index([project_id])
  @@map("project_attachments")
}
```

### 11. proposals — العروض

```prisma
model Proposal {
  id          String         @id @default(uuid()) @db.Uuid
  project_id  String         @map("project_id") @db.Uuid
  freelancer_id String       @map("freelancer_id") @db.Uuid
  cover_letter String        @map("cover_letter") @db.Text
  bid_amount  Decimal        @map("bid_amount") @db.Decimal(10, 2)
  duration_days Int          @map("duration_days")
  status      ProposalStatus @default(PENDING)
  ai_score    Decimal?       @default(0) @map("ai_score") @db.Decimal(5, 2)
  is_ai_generated Boolean    @default(false) @map("is_ai_generated")
  is_seen      Boolean       @default(false) @map("is_seen")
  seen_at      DateTime?     @map("seen_at")
  submitted_at DateTime      @default(now()) @map("submitted_at")
  created_at   DateTime      @default(now()) @map("created_at")
  updated_at   DateTime      @updatedAt @map("updated_at")

  // Relations
  project      Project       @relation(fields: [project_id], references: [id])
  freelancer   User          @relation(fields: [freelancer_id], references: [id])
  attachments  ProposalAttachment[]

  @@unique([project_id, freelancer_id]) // One proposal per freelancer per project
  @@index([project_id, status])
  @@index([freelancer_id])
  @@index([status, created_at])
  @@index([ai_score])
  @@map("proposals")
}
```

### 12. proposal_attachments — مرفقات العرض

```prisma
model ProposalAttachment {
  id          String   @id @default(uuid()) @db.Uuid
  proposal_id String   @map("proposal_id") @db.Uuid
  file_url    String   @map("file_url")
  file_name   String   @map("file_name")
  file_type   FileType @map("file_type")
  file_size   Int      @map("file_size")
  created_at  DateTime @default(now()) @map("created_at")

  // Relations
  proposal    Proposal @relation(fields: [proposal_id], references: [id], onDelete: Cascade)

  @@index([proposal_id])
  @@map("proposal_attachments")
}
```

### 13. contracts — العقود

```prisma
model Contract {
  id              String         @id @default(uuid()) @db.Uuid
  project_id      String         @map("project_id") @db.Uuid
  proposal_id     String?        @map("proposal_id") @db.Uuid
  freelancer_id   String         @map("freelancer_id") @db.Uuid
  client_id       String         @map("client_id") @db.Uuid
  total_amount    Decimal        @map("total_amount") @db.Decimal(12, 2)
  platform_fee    Decimal        @map("platform_fee") @db.Decimal(10, 2)
  freelancer_amount Decimal      @map("freelancer_amount") @db.Decimal(12, 2)
  status          ContractStatus @default(DRAFT)
  terms           String?        @db.Text
  is_nda_signed   Boolean        @default(false) @map("is_nda_signed")
  started_at      DateTime?      @map("started_at")
  completed_at    DateTime?      @map("completed_at")
  cancelled_at    DateTime?      @map("cancelled_at")
  created_at      DateTime       @default(now()) @map("created_at")
  updated_at      DateTime       @updatedAt @map("updated_at")

  // Relations
  project         Project        @relation(fields: [project_id], references: [id])
  proposal        Proposal?      @relation(fields: [proposal_id], references: [id])
  freelancer      User           @relation("ContractsAsFreelancer", fields: [freelancer_id], references: [id])
  client          User           @relation("ContractsAsClient", fields: [client_id], references: [id])
  milestones      Milestone[]
  payments        Payment[]
  disputes        Dispute[]

  @@index([project_id])
  @@index([freelancer_id])
  @@index([client_id])
  @@index([status])
  @@index([created_at])
  @@map("contracts")
}
```

### 14. milestones — المراحل

```prisma
model Milestone {
  id              String           @id @default(uuid()) @db.Uuid
  contract_id     String           @map("contract_id") @db.Uuid
  title           String
  description     String?
  amount          Decimal          @db.Decimal(12, 2)
  status          MilestoneStatus  @default(PENDING)
  due_date        DateTime?        @map("due_date")
  completed_at    DateTime?        @map("completed_at")
  sort_order      Int              @default(0) @map("sort_order")
  created_at      DateTime         @default(now()) @map("created_at")
  updated_at      DateTime         @updatedAt @map("updated_at")

  // Relations
  contract        Contract         @relation(fields: [contract_id], references: [id], onDelete: Cascade)
  deliverables    Deliverable[]

  @@index([contract_id])
  @@index([status])
  @@map("milestones")
}
```

### 15. deliverables — التسليمات

```prisma
model Deliverable {
  id           String          @id @default(uuid()) @db.Uuid
  milestone_id String          @map("milestone_id") @db.Uuid
  title        String
  description  String?
  file_url     String?         @map("file_url")
  file_name    String?         @map("file_name")
  status       MilestoneStatus @default(SUBMITTED)
  notes        String?         @db.Text
  created_at   DateTime        @default(now()) @map("created_at")
  updated_at   DateTime        @updatedAt @map("updated_at")

  // Relations
  milestone    Milestone       @relation(fields: [milestone_id], references: [id], onDelete: Cascade)

  @@index([milestone_id])
  @@map("deliverables")
}
```

### 16. payments — المدفوعات

```prisma
model Payment {
  id              String        @id @default(uuid()) @db.Uuid
  contract_id     String        @map("contract_id") @db.Uuid
  milestone_id    String?       @map("milestone_id") @db.Uuid
  payer_id        String        @map("payer_id") @db.Uuid
  payee_id        String        @map("payee_id") @db.Uuid
  amount          Decimal       @db.Decimal(12, 2)
  platform_fee    Decimal       @default(0) @map("platform_fee") @db.Decimal(10, 2)
  net_amount      Decimal       @map("net_amount") @db.Decimal(12, 2)
  currency        String        @default("USD")
  status          PaymentStatus @default(PENDING)
  payment_method  String?       @map("payment_method")
  transaction_id  String?       @map("transaction_id") // External payment gateway ID
  paid_at         DateTime?     @map("paid_at")
  created_at      DateTime      @default(now()) @map("created_at")
  updated_at      DateTime      @updatedAt @map("updated_at")

  // Relations
  contract        Contract      @relation(fields: [contract_id], references: [id])
  milestone       Milestone?    @relation(fields: [milestone_id], references: [id])
  payer           User          @relation(fields: [payer_id], references: [id])
  payee           User          @relation(fields: [payee_id], references: [id])
  transaction     Transaction?

  @@index([contract_id])
  @@index([payer_id])
  @@index([payee_id])
  @@index([status])
  @@index([created_at])
  @@map("payments")
}
```

### 17. transactions — سجل المعاملات المالية

```prisma
model Transaction {
  id              String          @id @default(uuid()) @db.Uuid
  user_id         String          @map("user_id") @db.Uuid
  payment_id      String?         @map("payment_id") @db.Uuid
  type            TransactionType
  amount          Decimal         @db.Decimal(12, 2)
  fee             Decimal         @default(0) @db.Decimal(10, 2)
  net_amount      Decimal         @map("net_amount") @db.Decimal(12, 2)
  currency        String          @default("USD")
  balance_before  Decimal         @map("balance_before") @db.Decimal(12, 2)
  balance_after   Decimal         @map("balance_after") @db.Decimal(12, 2)
  description     String?
  reference_type  String?         @map("reference_type")
  reference_id    String?         @map("reference_id") @db.Uuid
  created_at      DateTime        @default(now()) @map("created_at")

  // Relations
  user            User            @relation(fields: [user_id], references: [id])
  payment         Payment?        @relation(fields: [payment_id], references: [id])

  @@index([user_id, created_at])
  @@index([payment_id])
  @@index([type])
  @@index([created_at])
  @@map("transactions")
}
```

### 18. wallets — المحافظ

```prisma
model Wallet {
  id            String   @id @default(uuid()) @db.Uuid
  user_id       String   @unique @map("user_id") @db.Uuid
  balance       Decimal  @default(0) @db.Decimal(12, 2)
  pending_balance Decimal @default(0) @map("pending_balance") @db.Decimal(12, 2)
  total_earned  Decimal  @default(0) @map("total_earned") @db.Decimal(14, 2)
  total_spent   Decimal  @default(0) @map("total_spent") @db.Decimal(14, 2)
  currency      String   @default("USD")
  created_at    DateTime @default(now()) @map("created_at")
  updated_at    DateTime @updatedAt @map("updated_at")

  // Relations
  user          User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@map("wallets")
}
```

### 19. payment_accounts — حسابات السحب

```prisma
model PaymentAccount {
  id          String   @id @default(uuid()) @db.Uuid
  user_id     String   @map("user_id") @db.Uuid
  type        String   // bank, mobile_money, paypal, stripe
  label       String   // e.g., "MTN MoMo - 0912345678"
  details     Json     // Encrypted account details
  is_default  Boolean  @default(false) @map("is_default")
  is_verified Boolean  @default(false) @map("is_verified")
  created_at  DateTime @default(now()) @map("created_at")
  updated_at  DateTime @updatedAt @map("updated_at")

  // Relations
  user        User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([type])
  @@map("payment_accounts")
}
```

### 20. messages — الرسائل

```prisma
model Message {
  id          String   @id @default(uuid()) @db.Uuid
  sender_id   String   @map("sender_id") @db.Uuid
  receiver_id String   @map("receiver_id") @db.Uuid
  project_id  String?  @map("project_id") @db.Uuid
  content     String   @db.Text
  is_read     Boolean  @default(false) @map("is_read")
  read_at     DateTime? @map("read_at")
  parent_id   String?  @map("parent_id") @db.Uuid // For threaded replies
  created_at  DateTime @default(now()) @map("created_at")

  // Relations
  sender      User     @relation("SentMessages", fields: [sender_id], references: [id])
  receiver    User     @relation("ReceivedMessages", fields: [receiver_id], references: [id])
  project     Project? @relation(fields: [project_id], references: [id])
  attachments MessageAttachment[]
  parent      Message? @relation("MessageReply", fields: [parent_id], references: [id])
  replies     Message[] @relation("MessageReply")

  @@index([sender_id, receiver_id])
  @@index([project_id])
  @@index([is_read, receiver_id])
  @@index([created_at])
  @@map("messages")
}
```

### 21. message_attachments — مرفقات الرسائل

```prisma
model MessageAttachment {
  id         String   @id @default(uuid()) @db.Uuid
  message_id String   @map("message_id") @db.Uuid
  file_url   String   @map("file_url")
  file_name  String   @map("file_name")
  file_type  FileType @map("file_type")
  file_size  Int      @map("file_size")
  created_at DateTime @default(now()) @map("created_at")

  // Relations
  message    Message  @relation(fields: [message_id], references: [id], onDelete: Cascade)

  @@index([message_id])
  @@map("message_attachments")
}
```

### 22. reviews — التقييمات

```prisma
model Review {
  id            String     @id @default(uuid()) @db.Uuid
  contract_id   String     @map("contract_id") @db.Uuid
  reviewer_id   String     @map("reviewer_id") @db.Uuid
  reviewee_id   String     @map("reviewee_id") @db.Uuid
  type          ReviewType
  rating        Int        // 1-5
  quality       Int?       @map("quality") // 1-5
  communication Int?       @map("communication") // 1-5
  adherence     Int?       @map("adherence") // 1-5
  timeliness    Int?       @map("timeliness") // 1-5
  comment       String?    @db.Text
  is_flagged    Boolean    @default(false) @map("is_flagged")
  created_at    DateTime   @default(now()) @map("created_at")
  updated_at    DateTime   @updatedAt @map("updated_at")

  // Relations
  contract      Contract   @relation(fields: [contract_id], references: [id])
  reviewer      User       @relation("ReviewsGiven", fields: [reviewer_id], references: [id])
  reviewee      User       @relation("ReviewsReceived", fields: [reviewee_id], references: [id])

  @@unique([contract_id, reviewer_id, type])
  @@index([reviewee_id, type])
  @@index([rating])
  @@index([contract_id])
  @@map("reviews")
}
```

### 23. notifications — الإشعارات

```prisma
model Notification {
  id              String           @id @default(uuid()) @db.Uuid
  user_id         String           @map("user_id") @db.Uuid
  type            NotificationType
  title           String
  body            String?
  data            Json?            // Additional payload
  is_read         Boolean          @default(false) @map("is_read")
  read_at         DateTime?        @map("read_at")
  reference_type  String?          @map("reference_type")
  reference_id    String?          @map("reference_id") @db.Uuid
  created_at      DateTime         @default(now()) @map("created_at")

  // Relations
  user            User             @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id, is_read])
  @@index([user_id, created_at])
  @@index([type])
  @@index([created_at])
  @@map("notifications")
}
```

### 24. disputes — النزاعات

```prisma
model Dispute {
  id          String         @id @default(uuid()) @db.Uuid
  contract_id String         @map("contract_id") @db.Uuid
  project_id  String         @map("project_id") @db.Uuid
  opened_by   String         @map("opened_by") @db.Uuid
  reason      String         @db.Text
  status      DisputeStatus  @default(OPEN)
  resolution  String?        @db.Text
  resolved_by String?        @map("resolved_by") @db.Uuid
  resolved_at DateTime?      @map("resolved_at")
  created_at  DateTime       @default(now()) @map("created_at")
  updated_at  DateTime       @updatedAt @map("updated_at")

  // Relations
  contract    Contract       @relation(fields: [contract_id], references: [id])
  project     Project        @relation(fields: [project_id], references: [id])
  opener      User           @relation(fields: [opened_by], references: [id])
  participants DisputeParticipant[]
  messages    DisputeMessage[]

  @@index([contract_id])
  @@index([status])
  @@index([created_at])
  @@map("disputes")
}
```

### 25. dispute_participants — أطراف النزاع

```prisma
model DisputeParticipant {
  id         String   @id @default(uuid()) @db.Uuid
  dispute_id String   @map("dispute_id") @db.Uuid
  user_id    String   @map("user_id") @db.Uuid
  role       String   // "opener", "defendant", "admin", "arbitrator"
  created_at DateTime @default(now()) @map("created_at")

  // Relations
  dispute    Dispute  @relation(fields: [dispute_id], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [user_id], references: [id])

  @@unique([dispute_id, user_id])
  @@map("dispute_participants")
}
```

### 26. dispute_messages — رسائل النزاع

```prisma
model DisputeMessage {
  id         String   @id @default(uuid()) @db.Uuid
  dispute_id String   @map("dispute_id") @db.Uuid
  user_id    String   @map("user_id") @db.Uuid
  content    String   @db.Text
  attachments Json?   @default("[]")
  created_at DateTime @default(now()) @map("created_at")

  // Relations
  dispute    Dispute  @relation(fields: [dispute_id], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [user_id], references: [id])

  @@index([dispute_id])
  @@map("dispute_messages")
}
```

### 27. project_bookmarks — المشاريع المحفوظة

```prisma
model ProjectBookmark {
  id         String   @id @default(uuid()) @db.Uuid
  user_id    String   @map("user_id") @db.Uuid
  project_id String   @map("project_id") @db.Uuid
  created_at DateTime @default(now()) @map("created_at")

  // Relations
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  project    Project  @relation(fields: [project_id], references: [id], onDelete: Cascade)

  @@unique([user_id, project_id])
  @@index([project_id])
  @@map("project_bookmarks")
}
```

### 28. social_links — روابط التواصل الاجتماعي

```prisma
model SocialLink {
  id         String   @id @default(uuid()) @db.Uuid
  user_id    String   @map("user_id") @db.Uuid
  platform   String   // linkedin, github, twitter, behance, etc.
  url        String
  is_public  Boolean  @default(true) @map("is_public")
  created_at DateTime @default(now()) @map("created_at")
  updated_at DateTime @updatedAt @map("updated_at")

  // Relations
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@unique([user_id, platform])
  @@index([user_id])
  @@map("social_links")
}
```

### 29. audit_logs — سجل التدقيق

```prisma
model AuditLog {
  id          String   @id @default(uuid()) @db.Uuid
  user_id     String?  @map("user_id") @db.Uuid
  action      String   // e.g., 'user.login', 'project.create', 'payment.release'
  entity_type String   @map("entity_type")
  entity_id   String?  @map("entity_id")
  old_values  Json?
  new_values  Json?
  ip_address  String?  @map("ip_address")
  user_agent  String?  @map("user_agent")
  created_at  DateTime @default(now()) @map("created_at")

  // Relations
  user        User?    @relation(fields: [user_id], references: [id])

  @@index([user_id])
  @@index([action])
  @@index([entity_type, entity_id])
  @@index([created_at])
  @@map("audit_logs")
}
```

### 30. user_sessions — جلسات المستخدم

```prisma
model UserSession {
  id            String   @id @default(uuid()) @db.Uuid
  user_id       String   @map("user_id") @db.Uuid
  refresh_token String   @unique @map("refresh_token")
  device_info   String?  @map("device_info")
  ip_address    String?  @map("ip_address")
  is_active     Boolean  @default(true) @map("is_active")
  last_activity DateTime @default(now()) @map("last_activity")
  expires_at    DateTime @map("expires_at")
  created_at    DateTime @default(now()) @map("created_at")

  // Relations
  user          User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id, is_active])
  @@index([refresh_token])
  @@index([expires_at])
  @@map("user_sessions")
}
```

### 31. email_verifications — التحقق من البريد

```prisma
model EmailVerification {
  id         String   @id @default(uuid()) @db.Uuid
  email      String
  otp        String
  type       String   // 'verification', 'password_reset', 'email_change'
  expires_at DateTime @map("expires_at")
  used_at    DateTime? @map("used_at")
  attempts   Int      @default(0)
  created_at DateTime @default(now()) @map("created_at")

  @@index([email, type])
  @@index([otp])
  @@index([expires_at])
  @@map("email_verifications")
}
```

### 32. badges — الشارات والتكريمات

```prisma
model Badge {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique
  name_ar     String?  @map("name_ar")
  description String?
  icon_url    String?  @map("icon_url")
  criteria    Json?    // Conditions to earn badge
  is_active   Boolean  @default(true) @map("is_active")
  created_at  DateTime @default(now()) @map("created_at")

  // Relations
  user_badges UserBadge[]

  @@map("badges")
}
```

### 33. user_badges — شارات المستخدمين

```prisma
model UserBadge {
  id         String   @id @default(uuid()) @db.Uuid
  user_id    String   @map("user_id") @db.Uuid
  badge_id   String   @map("badge_id") @db.Uuid
  earned_at  DateTime @default(now()) @map("earned_at")

  // Relations
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  badge      Badge    @relation(fields: [badge_id], references: [id], onDelete: Cascade)

  @@unique([user_id, badge_id])
  @@map("user_badges")
}
```

### 34. platform_settings — إعدادات المنصة

```prisma
model PlatformSetting {
  id         String   @id @default(uuid()) @db.Uuid
  key        String   @unique
  value      Json
  description String?
  updated_by String?  @map("updated_by") @db.Uuid
  created_at DateTime @default(now()) @map("created_at")
  updated_at DateTime @updatedAt @map("updated_at")

  @@map("platform_settings")
}
```

### 35. saved_searches — عمليات البحث المحفوظة

```prisma
model SavedSearch {
  id         String   @id @default(uuid()) @db.Uuid
  user_id    String   @map("user_id") @db.Uuid
  name       String?
  filters    Json     // Search criteria as JSON
  notify     Boolean  @default(false) // Get notified on new matches
  created_at DateTime @default(now()) @map("created_at")
  updated_at DateTime @updatedAt @map("updated_at")

  // Relations
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@map("saved_searches")
}
```

---

## Entity Relationship Summary

```
User (1) ── (1) FreelancerProfile
User (1) ── (1) ClientProfile
User (1) ── (1) Wallet
User (1) ── (*) Portfolio
User (1) ── (*) Proposal
User (1) ── (*) Contract [as freelancer]
User (1) ── (*) Contract [as client]
User (1) ── (*) Message
User (1) ── (*) Notification
User (1) ── (*) PaymentAccount
User (1) ── (*) SocialLink
User (1) ── (*) Transaction
User (1) ── (*) ProjectBookmark
User (1) ── (*) AuditLog
User (1) ── (*) UserSession
User (1) ── (*) UserBadge
User (1) ── (*) SavedSearch

FreelancerProfile (1) ── (*) FreelancerSkill
Skill (1) ── (*) FreelancerSkill
Skill (1) ── (*) ProjectSkill

Category (1) ── (*) Skill
Category (1) ── (*) Project
Category (1) ── (*) Category [self-referencing]

Project (1) ── (*) ProjectSkill
Project (1) ── (*) ProjectAttachment
Project (1) ── (*) Proposal
Project (1) ── (*) Contract
Project (1) ── (*) ProjectBookmark
Project (1) ── (*) Dispute

Proposal (1) ── (*) ProposalAttachment

Contract (1) ── (*) Milestone
Contract (1) ── (*) Payment
Contract (1) ── (1) Review [×2]
Contract (1) ── (*) Dispute

Milestone (1) ── (*) Deliverable

Payment (1) ── (1) Transaction

Badge (1) ── (*) UserBadge
```

---

## Index Strategy

| Table | Index | Type | Reason |
|-------|-------|------|--------|
| users | email | B-tree, UNIQUE | بحث سريع بالبريد |
| users | role, status | B-tree | فلترة المستخدمين |
| projects | status, created_at | B-tree | قائمة المشاريع الرئيسية |
| projects | title | GIN (trgm) | Full-text search |
| projects | status, budget_max | B-tree | فلترة بالميزانية |
| proposals | project_id, status | B-tree | عرض عروض المشروع |
| proposals | ai_score | B-tree | ترتيب العروض حسب AI |
| messages | sender_id, receiver_id | B-tree | محادثات المستخدم |
| notifications | user_id, is_read | B-tree | إشعارات المستخدم |
| transactions | user_id, created_at | B-tree | سجل المعاملات |
| contracts | freelancer_id | B-tree | عقود المستقل |
| contracts | client_id | B-tree | عقود العميل |
| reviews | reviewee_id, type | B-tree | تقييمات المستخدم |
| audit_logs | created_at | B-tree | سجل التدقيق |
| disputes | status | B-tree | حالات النزاعات |
| user_sessions | refresh_token | B-tree, UNIQUE | جلسات المستخدم |
