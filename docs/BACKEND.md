# Backend Architecture

Jobilo backend is built with **NestJS 11** using a modular monolith architecture. The API serves a freelance marketplace connecting clients and freelancers across the Arab world.

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `@nestjs/core` | ^11.1.27 | Framework core |
| `@nestjs/common` | ^11.1.27 | Common utilities, pipes, guards |
| `@nestjs/config` | ^4.0.4 | Configuration management |
| `@nestjs/swagger` | ^11.4.4 | OpenAPI/Swagger documentation |
| `@nestjs/jwt` | ^11.0.2 | JWT authentication |
| `@nestjs/passport` | ^11.0.5 | Passport strategies |
| `@nestjs/throttler` | ^6.5.0 | Rate limiting |
| `@nestjs/event-emitter` | ^3.1.0 | Event-driven communication |
| `@nestjs/schedule` | ^6.1.3 | Cron jobs, scheduling |
| `@nestjs/platform-socket.io` | ^11.1.27 | WebSocket support |
| `@nestjs/websockets` | ^11.1.27 | WebSocket decorators |
| `@prisma/client` | ^7.8.0 | Database ORM |
| `prisma` | ^7.8.0 | Schema management, migrations |
| `passport` | ^0.7.0 | Authentication middleware |
| `passport-jwt` | ^4.0.1 | JWT strategy |
| `bcrypt` | ^6.0.0 | Password hashing |
| `class-validator` | ^0.15.1 | DTO validation |
| `class-transformer` | ^0.5.1 | Object transformation |
| `socket.io` | ^4.8.3 | WebSocket engine |
| `helmet` | ^8.2.0 | Security headers |
| `cookie-parser` | ^1.4.7 | Cookie parsing |
| `multer` | ^2.2.0 | File upload handling |
| `openai` | ^6.45.0 | AI-powered features |
| `pg` | ^8.22.0 | PostgreSQL driver |
| `rxjs` | ^7.8.2 | Reactive extensions |
| `uuid` | ^11.1.1 | UUID generation |

## Module Structure

```
src/
  app.module.ts
  main.ts
  config/
    app.config.ts
  common/
    prisma.service.ts
    filters/
      all-exceptions.filter.ts
    guards/
      jwt.strategy.ts
      roles.guard.ts
    decorators/
      current-user.decorator.ts
      public.decorator.ts
      roles.decorator.ts
    pipes/
      uuid-validation.pipe.ts
    utils/
      auth-helpers.service.ts
  modules/
    auth/
      auth.module.ts
      auth.controller.ts
      auth.service.ts
      dto/
        register.dto.ts
        login.dto.ts
        verify-email.dto.ts
        forgot-password.dto.ts
        reset-password.dto.ts
        change-password.dto.ts
    users/
      users.module.ts
      users.controller.ts
      users.service.ts
    projects/
      projects.module.ts
      projects.controller.ts
      projects.service.ts
      dto/
        create-project.dto.ts
        query-projects.dto.ts
    proposals/
      proposals.module.ts
      proposals.controller.ts
      proposals.service.ts
      dto/
        create-proposal.dto.ts
    contracts/
      contracts.module.ts
      (controller, service)
    messages/
      messages.module.ts
      (controller, service, gateway)
    reviews/
      reviews.module.ts
      (controller, service)
    notifications/
      notifications.module.ts
      notifications.service.ts
    categories/
      categories.module.ts
      (controller, service)
    files/
      files.module.ts
      (controller, service)
    ai/
      ai.module.ts
      (service)
    admin/
      admin.module.ts
      (controller, service)
    super-admin/
      super-admin.module.ts
      super-admin.controller.ts
      super-admin.service.ts
      auth/
        admin-auth.controller.ts
        admin-auth.service.ts
        admin-jwt.strategy.ts
      guards/
        admin-auth.guard.ts
        admin-permissions.guard.ts
      decorators/
        admin-user.decorator.ts
        admin-permissions.decorator.ts
      dashboard/
        dashboard.controller.ts
        dashboard.service.ts
      analytics/
        analytics.controller.ts
        analytics.service.ts
      users/
        users.controller.ts
        users.service.ts
      projects/
        projects.controller.ts
        projects.service.ts
      proposals/
        proposals.controller.ts
        proposals.service.ts
      roles/
        roles.controller.ts
        roles.service.ts
      subscriptions/
        subscriptions.controller.ts
        subscriptions.service.ts
      content/
        content.controller.ts
        content.service.ts
      disputes/
        disputes.controller.ts
        disputes.service.ts
      reports/
        reports.controller.ts
        reports.service.ts
      settings/
        settings.controller.ts
        settings.service.ts
      security/
        security.controller.ts
        security.service.ts
      logs/
        logs.controller.ts
        logs.service.ts
```

## Dependency Injection Patterns

NestJS constructor-based DI is used throughout:

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authHelpers: AuthHelpersService,
  ) {}
}
```

Shared services (`PrismaService`, `AuthHelpersService`) are exported from `AppModule` and available to all modules. See [MODULES.md](./MODULES.md) for per-module details.

## Exception Filters

A global `AllExceptionsFilter` (defined in `src/common/filters/all-exceptions.filter.ts`) catches all exceptions:

- `HttpException` instances are mapped to structured error responses
- Unknown errors return 500 with `INTERNAL_ERROR` code
- Response format: `{ success: false, error: { code, message, details, traceId } }`

See [ERROR_HANDLING.md](./ERROR_HANDLING.md) for all error codes.

## Pipes

A global `ValidationPipe` is configured in `main.ts`:

- `whitelist: true` — strips unknown properties
- `forbidNonWhitelisted: true` — rejects unknown properties
- `transform: true` — auto-transform types
- `enableImplicitConversion: true` — query params converted to DTO types

## Guards

| Guard | Scope | Purpose |
|-------|-------|---------|
| `ThrottlerGuard` | Global | Rate limiting (100 req/60s) |
| `RolesGuard` | Global | Role-based access via `@Roles()` decorator |
| `AuthGuard('jwt')` | Per-route | JWT authentication |
| `AdminAuthGuard` | SuperAdmin | Admin token verification |
| `AdminPermissionsGuard` | SuperAdmin | Permission check for admin actions |

## Interceptors

- Global request logging (if configured)
- `ClassSerializerInterceptor` can be applied per-controller

## Swagger / OpenAPI

Setup in `main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Jobilo API')
  .setDescription('Jobilo Freelance Marketplace API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

Access at: `http://localhost:4000/api/docs`

## API Versioning

URI-based versioning is enabled with default version `1`:

```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
```

All routes are prefixed with `/api/v1`. See [API_OVERVIEW.md](./API_OVERVIEW.md).

## Security

- **Helmet.js** security headers
- **CORS** configured with whitelisted origins
- **Rate limiting** via `@nestjs/throttler` (100 requests per 60 seconds)
- **bcrypt** password hashing (auto-gen salt rounds)
- **JWT** access + refresh token rotation
- **Cookie parser** for HTTP-only cookie support
- **Input validation** via `class-validator` DTOs
- **SQL injection** protection via Prisma parameterized queries
