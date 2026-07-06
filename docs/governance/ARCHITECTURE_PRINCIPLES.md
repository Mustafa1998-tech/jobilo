# Architecture Principles

> Last Updated: 2026-07-06

This document defines the architectural principles governing the Jobilo codebase. All design decisions must align with these principles. See [CODING_STANDARDS.md](./CODING_STANDARDS.md) for implementation-level rules and [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) for the ADR index.

---

## 1. SOLID Principles

### 1.1 Single Responsibility Principle (SRP)

> A class/module should have one, and only one, reason to change.

```typescript
// ❌ Bad — UserService handles DB, email, and auth
class UserService {
  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    await this.emailService.sendWelcome(user.email);
    await this.authService.generateToken(user.id);
    return user;
  }
}

// ✅ Good — each class has one responsibility
class UserCreator {
  async execute(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: dto });
  }
}
class WelcomeEmailSender {
  async send(user: User): Promise<void> {
    await this.emailService.sendWelcome(user.email);
  }
}
class AuthTokenGenerator {
  async generate(userId: string): Promise<string> { }
}
```

### 1.2 Open/Closed Principle (OCP)

> Entities should be open for extension, closed for modification.

```typescript
// ✅ Good — extend via strategy pattern
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>;
}

class StripeProcessor implements PaymentProcessor {
  async process(amount: number): Promise<PaymentResult> { }
}

class PayPalProcessor implements PaymentProcessor {
  async process(amount: number): Promise<PaymentResult> { }
}
```

### 1.3 Liskov Substitution Principle (LSP)

> Subtypes must be substitutable for their base types.

```typescript
// ✅ Good — derived classes fulfill the contract
interface IStorageProvider {
  upload(path: string, data: Buffer): Promise<string>;
}

class S3StorageProvider implements IStorageProvider { }
class LocalStorageProvider implements IStorageProvider { }
```

### 1.4 Interface Segregation Principle (ISP)

> Clients should not be forced to depend on interfaces they do not use.

```typescript
// ❌ Bad — fat interface
interface UserOperations {
  create(): void;
  update(): void;
  delete(): void;
  sendEmail(): void;
  generateReport(): void;
}

// ✅ Good — segregated interfaces
interface IUserCrud {
  create(): void;
  update(): void;
  delete(): void;
}
interface IEmailSender {
  sendEmail(): void;
}
interface IReportGenerator {
  generateReport(): void;
}
```

### 1.5 Dependency Inversion Principle (DIP)

> Depend on abstractions, not concretions. See [ARCHITECTURE_PRINCIPLES.md](#4-dependency-injection).

```typescript
// ✅ Good — depends on interface, not implementation
class UserService {
  constructor(
    private readonly repository: IUserRepository, // abstraction
    private readonly emailer: IEmailSender,        // abstraction
  ) {}
}
```

---

## 2. DRY, KISS, YAGNI

| Principle | Meaning | Application |
|-----------|---------|-------------|
| **DRY** | Don't Repeat Yourself | Extract shared logic into services/middleware |
| **KISS** | Keep It Simple, Stupid | Prefer simple solutions over complex patterns |
| **YAGNI** | You Ain't Gonna Need It | Don't add functionality until it's required |

```typescript
// ❌ YAGNI violation — over-engineered before needed
abstract class BaseRepository<T, K> {
  abstract find(id: K): Promise<T>;
  abstract findAll(filter: unknown): Promise<T[]>;
  abstract create(data: T): Promise<T>;
  // 10 more methods that aren't needed yet
}

// ✅ KISS — simple Prisma calls until abstraction is justified
class UserService {
  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

---

## 3. Clean Architecture Layers

```
┌──────────────────────────────────┐
│         Presentation             │  Controllers, Resolvers, Pages
├──────────────────────────────────┤
│        Application               │  Use Cases, DTOs, Ports
├──────────────────────────────────┤
│         Domain                   │  Entities, Value Objects, Interfaces
├──────────────────────────────────┤
│        Infrastructure            │  Prisma, S3, Redis, HTTP clients
└──────────────────────────────────┘
```

**Dependency Rule:** Dependencies point inward. Presentation depends on Application, which depends on Domain. Infrastructure implements Domain interfaces.

```typescript
// Domain layer — no external dependencies
export class JobListing {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly status: ListingStatus,
  ) {}

  publish(): void {
    if (this.status !== ListingStatus.DRAFT) throw new Error('Only drafts can be published');
    // ...
  }
}

// Application layer — depends only on Domain
export class PublishJobListingUseCase {
  constructor(private readonly repo: IJobListingRepository) {}

  async execute(id: string): Promise<void> {
    const listing = await this.repo.findById(id);
    listing.publish();
    await this.repo.save(listing);
  }
}
```

---

## 4. Dependency Injection

NestJS built-in DI is used throughout the backend:

```typescript
@Injectable()
export class JobListingService {
  constructor(
    @Inject('IJobListingRepository')
    private readonly repo: IJobListingRepository,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}
}
```

All dependencies are injected via constructor. Service locator patterns are prohibited.

---

## 5. Separation of Concerns

| Concern | Location | Technology |
|---------|----------|------------|
| API routing | `apps/api/src/modules/*/` | NestJS Controllers |
| Business logic | `apps/api/src/modules/*/services/` | NestJS Services |
| Data access | `apps/api/src/modules/*/repositories/` | Prisma |
| UI rendering | `apps/web/src/app/*/` | Next.js App Router |
| State management | `apps/web/src/lib/state/` | Zustand |
| Validation | `*.dto.ts` files | class-validator |
| Configuration | `config/` | @nestjs/config |

---

## 6. API-First Design

- API contracts are defined before implementation
- OpenAPI 3.1 spec in `docs/api/`
- Shared types in `packages/shared/src/types/`
- All endpoints follow RESTful conventions
- GraphQL is not used — see [DECISION_LOG.md](./DECISION_LOG.md#adr-002)

---

## 7. Stateless Where Possible

- Backend instances are stateless — session state in Redis
- JWT tokens contain all auth info (no server-side sessions)
- File uploads go directly to S3 via presigned URLs
- Horizontal scaling is achieved by adding instances

---

## 8. Fail-Fast Principle

```typescript
// ✅ Good — validate early, fail immediately
async createJobListing(dto: CreateJobListingDto): Promise<JobListing> {
  // Fail-fast validation
  if (!dto.title || dto.title.trim().length === 0) {
    throw new ValidationException('Title is required');
  }
  if (dto.title.length > 200) {
    throw new ValidationException('Title exceeds 200 characters');
  }

  const listing = await this.prisma.jobListing.create({ data: dto });
  return listing;
}
```

---

## 9. Principle of Least Privilege

- Each service/database user has minimal required permissions
- API tokens scoped to specific operations
- Prisma queries select only required fields
- Row-Level Security (RLS) in PostgreSQL for multi-tenancy

---

## 10. Defense in Depth

```
Network  →  WAF (Cloudflare)  →  HTTPS/TLS
  ↓
Auth     →  JWT verification → Guard → Role check
  ↓
Input    →  Validation pipe   →  DTO validation
  ↓
Data     →  Prisma prepared   →  RLS policies
             statements
  ↓
Output   →  Serialization     →  Exclude sensitive fields
             interceptor
```

---

## 11. Related Documents

- [CODING_STANDARDS.md](./CODING_STANDARDS.md) — Implementation-level rules
- [GOVERNANCE.md](./GOVERNANCE.md) — Decision-making process
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) — ADR index
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — Dev workflow
