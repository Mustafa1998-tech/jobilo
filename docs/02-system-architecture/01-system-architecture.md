# Jobilo - System Architecture

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     🌐 DNS (Cloudflare)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │   CDN (Vercel) │
                    │   Edge Network │
                    └───────┬───────┘
                            │
┌───────────────────────────────────────────────────────────────┐
│                     🖥️  Frontend (Vercel)                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Next.js Application (React)                 │ │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐   │ │
│  │  │  Pages  │ │Components│ │  Hooks   │ │  Services │   │ │
│  │  ├─────────┤ ├──────────┤ ├──────────┤ ├───────────┤   │ │
│  │  │  SSR/SSG│ │  shadcn   │ │ TanStack │ │  API Layer│   │ │
│  │  │  ISR    │ │  Tailwind │ │  Zustand │ │  Axios    │   │ │
│  │  └─────────┘ └──────────┘ └──────────┘ └───────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
                            │ HTTPS
                            │ REST API
┌───────────────────────────────────────────────────────────────┐
│                     🚀 Backend (Koyeb)                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              NestJS Application                          │ │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐   │ │
│  │  │ Modules │ │  Auth    │ │  Guards  │ │ Interceptors│  │ │
│  │  ├─────────┤ ├──────────┤ ├──────────┤ ├───────────┤   │ │
│  │  │Services │ │  Pipes   │ │  Filters │ │ Middleware │   │ │
│  │  └─────────┘ └──────────┘ └──────────┘ └───────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            │                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              External Services                          │ │
│  │  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐  │ │
│  │  │ Cloudinary│ │ Stripe   │ │ Resend   │ │ OpenAI  │  │ │
│  │  │ (Files)   │ │(Payments)│ │(Emails)  │ │ (AI)    │  │ │
│  │  └───────────┘ └──────────┘ └──────────┘ └─────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────────────────────────────────────────┐
│                     🗄️  Database (Neon)                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL + Prisma                         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐    │ │
│  │  │  Primary │ │ Replica  │ │  Backup  │ │  Redis │    │ │
│  │  │  (Write) │ │(Read)    │ │ (PITR)   │ │(Cache) │    │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## Layered Architecture (Clean Architecture)

```
┌────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                          │
│  Next.js Pages → Controllers → DTOs → Validation              │
│  Roles: HTTP handling, routing, request/response mapping      │
│  Dependencies: @nestjs/common, class-validator, swagger        │
├────────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                           │
│  Services → Use Cases → Business Logic                         │
│  Roles: Orchestration, business rules, workflow management     │
│  Dependencies: @nestjs/jwt, @nestjs/passport, bcrypt           │
├────────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                                │
│  Entities → Value Objects → Domain Events                      │
│  Roles: Core business entities, domain logic                   │
│  Dependencies: None (pure TypeScript)                          │
├────────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                        │
│  Prisma → Repositories → External Services                     │
│  Roles: Database access, file storage, email, AI, payments     │
│  Dependencies: @prisma/client, cloudinary, stripe, openai      │
└────────────────────────────────────────────────────────────────┘
```

---

## Module Architecture (NestJS Modules)

```
src/
├── core/                          # Core module (shared)
│   ├── auth/                      # Authentication module
│   ├── users/                     # User management
│   ├── roles/                     # RBAC
│   └── database/                  # Prisma module
│
├── modules/                       # Business modules
│   ├── projects/                  # Project management
│   ├── proposals/                 # Proposals & offers
│   ├── contracts/                 # Contracts & agreements
│   ├── payments/                  # Payments & escrow
│   ├── reviews/                   # Reviews & ratings
│   ├── messages/                  # Real-time chat
│   ├── notifications/             # Notifications
│   ├── categories/                # Categories & skills
│   ├── portfolios/                # Portfolio management
│   ├── admin/                     # Admin dashboard
│   └── ai/                        # AI services
│
├── common/                        # Shared utilities
│   ├── decorators/                # Custom decorators
│   ├── guards/                    # Auth guards (JWT, Roles)
│   ├── pipes/                     # Validation pipes
│   ├── filters/                   # Exception filters
│   ├── interceptors/              # Logging, transformation
│   ├── middleware/                 # Custom middleware
│   └── dto/                       # Shared DTOs
│
├── config/                        # Configuration
│   ├── env/                       # Environment variables
│   └── app.config.ts             # App configuration
│
├── common/
│   ├── utils/                     # Utility functions
│   └── types/                     # Shared types/interfaces
│
├── i18n/                          # Internationalization
│   ├── en/                        # English translations
│   └── ar/                        # Arabic translations
```

---

## Frontend Architecture

```
src/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Auth pages group
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/               # Dashboard pages group
│   │   ├── freelancer/            # Freelancer dashboard
│   │   │   ├── projects/
│   │   │   ├── proposals/
│   │   │   └── earnings/
│   │   └── client/                # Client dashboard
│   │       ├── my-projects/
│   │       └── hire/
│   ├── projects/                  # Project pages
│   │   ├── page.tsx               # Browse projects
│   │   └── [id]/                  # Project details
│   ├── profile/                   # Profile pages
│   │   └── [id]/                  # Public profile
│   ├── messages/                  # Messages
│   ├── settings/                  # User settings
│   └── admin/                     # Admin pages
│
├── components/                    # Shared components
│   ├── ui/                        # shadcn/ui components
│   ├── layout/                    # Layout components
│   │   ├── header/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   └── navigation/
│   ├── forms/                     # Form components
│   ├── shared/                    # Shared components
│   │   ├── loading/
│   │   ├── error/
│   │   ├── empty/
│   │   └── pagination/
│   └── providers/                 # Context providers
│
├── hooks/                         # Custom hooks
│   ├── use-auth.ts
│   ├── use-projects.ts
│   ├── use-messages.ts
│   ├── use-debounce.ts
│   └── use-media-query.ts
│
├── lib/                           # Utilities
│   ├── api/                       # API client (Axios)
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   └── ...
│   ├── validations/               # Zod schemas
│   ├── store/                     # Zustand stores
│   │   ├── auth-store.ts
│   │   └── ui-store.ts
│   ├── utils.ts                   # cn(), formatters
│   └── constants.ts              # App constants
│
├── styles/                        # Global styles
│   └── globals.css
│
├── types/                         # TypeScript types
│   ├── api.ts
│   ├── user.ts
│   ├── project.ts
│   └── ...
│
├── i18n/                          # Internationalization
│   ├── config.ts
│   ├── en.json
│   └── ar.json
│
├── public/                        # Static assets
│   ├── images/
│   ├── icons/
│   └── locales/
│
├── middleware.ts                  # Next.js middleware
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Data Flow Architecture

### Request Flow
```
Browser → Next.js (SSR/CSR) → API Route → NestJS → Controller
  → Guard (JWT) → Pipe (Validation) → Interceptor → Service
  → Prisma → PostgreSQL → Response → Interceptor → Client
```

### Real-time Flow (WebSocket)
```
Browser → Socket.IO Client → NestJS Gateway → Auth Guard
  → Service → Prisma → Response → Event Emit → Client
```

### AI Flow
```
Service → OpenAI API → Response Processing → Cache (optional)
  → Save to DB → Return to Client
```

### Payment Flow
```
Client → Stripe Checkout → Webhook → Payment Service
  → Escrow Update → Notification → Email → WebSocket
```

---

## Security Architecture

```
┌────────────────────────────────────────────────────┐
│                   Frontend                          │
│  Input Validation (Zod) → XSS Protection → CSP     │
│  HTTPS Only → Secure Cookies → CSRF Tokens         │
└────────────────────┬───────────────────────────────┘
                     │
┌────────────────────┴───────────────────────────────┐
│                   API Gateway                       │
│  Rate Limiting → CORS → Helmet → Request Validation│
│  IP Filtering → DDOS Protection                    │
└────────────────────┬───────────────────────────────┘
                     │
┌────────────────────┴───────────────────────────────┐
│                   Backend                           │
│  JWT Auth → RBAC → Input Validation → SQL Injection│
│  Encryption → Audit Logs → Session Management      │
└────────────────────────────────────────────────────┘
```

---

## Scaling Strategy

| Component | Strategy | When |
|-----------|----------|------|
| **Frontend** | Vercel Auto-scaling | Always |
| **Backend** | Koyeb Horizontal Scaling | 5,000+ concurrent |
| **Database** | Neon Read Replicas | 10,000+ queries/sec |
| **Cache** | Redis (Upstash) | 5,000+ users |
| **CDN** | Vercel Edge Network | Always |
| **File Storage** | Cloudinary Auto-scaling | Always |
| **Background Jobs** | Bull Queue + Redis | 1,000+ concurrent jobs |

---

## Technology Decisions & Justifications

| Technology | Why | Alternative Considered |
|-----------|-----|----------------------|
| **Next.js** | SSR/SSG/ISR, SEO, RTL support, Vercel deployment | React SPA (worse SEO) |
| **NestJS** | Modular architecture, TypeScript, decorators, enterprise-ready | Express (too minimal) |
| **Prisma** | Type-safe queries, migrations, great DX | TypeORM (complex), Drizzle (new) |
| **PostgreSQL** | ACID compliance, JSON support, robust, scalable | MySQL (less features) |
| **Neon** | Serverless PostgreSQL, branching, scalable | AWS RDS (complex), Supabase (less control) |
| **Koyeb** | Serverless containers, global edge, affordable | Heroku (expensive), AWS (complex) |
| **Vercel** | Best Next.js hosting, edge functions, CDN | Netlify (less Next.js support) |
| **Cloudinary** | Image optimization, CDN, transformations | AWS S3 (needs additional tools) |
| **shadcn/ui** | Beautiful, accessible, customizable | MUI (heavy), Chakra (less RTL) |
| **TanStack Query** | Caching, pagination, SSR support | RTK Query (couples with Redux) |
| **Zustand** | Simple, TypeScript, no boilerplate | Redux (too verbose) |
| **Zod** | Type-safe validation, TypeScript inference | Joi (no TS inference) |
| **Stripe** | Global payments, escrow, fraud protection | PayPal (limited in Africa) |
| **Resend** | Transactional emails, great DX | SendGrid (dated) |
