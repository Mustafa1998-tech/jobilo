# Coding Standards

> Last Updated: 2026-07-06

This document defines mandatory coding standards for all Jobilo code. All contributions must comply. See [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md) for architectural conventions and [CODE_REVIEW_GUIDE.md](./CODE_REVIEW_GUIDE.md) for how these are enforced in review.

---

## 1. TypeScript Configuration

The project uses **TypeScript strict mode** in both `apps/api/tsconfig.json` and `apps/web/tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Rationale:** Strict mode catches null/undefined errors at compile time, reducing runtime crashes. See [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md#fail-fast-principle).

---

## 2. Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| **Types / Interfaces** | PascalCase | `UserProfile`, `IAuthPayload` |
| **Enums** | PascalCase | `UserRole`, `HttpStatus` |
| **Classes / Decorators** | PascalCase | `UserService`, `@Controller()` |
| **Variables / Functions** | camelCase | `getUserById()`, `userName` |
| **Constants (global)** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| **Files / Folders** | kebab-case | `user-profile.service.ts` |
| **React Components** | PascalCase | `UserProfileCard.tsx` |
| **React Hooks** | camelCase, `use` prefix | `useUserSession()` |
| **Database Models** | PascalCase | `User`, `JobListing` |
| **Private members** | `#` prefix (ES private) | `#cache = new Map()` |

### File Organization Rules

```
apps/api/src/
  modules/
    users/
      users.controller.ts       # kebab-case files
      users.service.ts
      users.module.ts
      dto/
        create-user.dto.ts
      interfaces/
        user.interface.ts
      entities/
        user.entity.ts
```

---

## 3. Import Ordering

Imports must follow this order, grouped with a blank line between groups:

1. Node.js built-ins (`node:fs`, `node:path`)
2. External packages (`@nestjs/*`, `react`, `next/*`)
3. Internal absolute imports (`@jobilo/*`, `@api/*`, `@web/*`)
4. Relative imports (`./`, `../`)
5. Type imports (`import type { ... }`)

```typescript
// ✅ Correct
import { readFile } from 'node:fs';
import { readFile } from 'node:fs/promises';

import { Module } from '@nestjs/common';
import { useState } from 'react';

import { PrismaService } from '@api/common/prisma.service';
import { UserRole } from '@api/common/enums';

import { CreateUserDto } from './dto/create-user.dto';
import type { IUser } from './interfaces/user.interface';
```

---

## 4. Formatting Rules

| Rule | Value | Tool |
|------|-------|------|
| Max line length | **100 characters** | ESLint `max-len` |
| Indentation | 2 spaces | Prettier |
| Quotes | single quotes | Prettier |
| Semicolons | always | Prettier |
| Trailing commas | all | Prettier |
| Print width | 100 | Prettier |

### ESLint + Prettier

```jsonc
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'max-len': ['error', { code: 100, ignoreUrls: true }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

---

## 5. NestJS-Specific Rules

### Decorator Order

```typescript
// ✅ Correct order
@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) { }
}
```

Rules:
1. Controller decorator first
2. Guard decorators
3. Interceptor decorators
4. Route decorators (`@Get`, `@Post`)
5. Response decorators (`@HttpCode`, `@Header`)
6. Parameter decorators (`@Param`, `@Body`, `@Query`)

### Provider Naming

| Type | Suffix | Example |
|------|--------|---------|
| Service | `Service` | `UserService` |
| Controller | `Controller` | `UserController` |
| Module | `Module` | `UserModule` |
| Guard | `Guard` | `AuthGuard` |
| Interceptor | `Interceptor` | `LoggingInterceptor` |
| Pipe | `Pipe` | `ValidationPipe` |
| Filter | `Filter` | `HttpExceptionFilter` |
| Decorator | `Decorator` | `CurrentUserDecorator` |

---

## 6. Next.js-Specific Rules

### Server vs Client Components

```typescript
// app/users/page.tsx — Server Component (default)
import { prisma } from '@api/common/prisma';

export const metadata = {
  title: 'Users | Jobilo',
  description: 'Manage Jobilo users',
};

export default async function UsersPage() {
  const users = await prisma.user.findMany();
  return <UserList users={users} />;
}
```

```typescript
// app/users/_components/user-list.tsx — Client Component
'use client';
import { useState } from 'react';
// ...
```

Rules:
- Server Components by default (no `'use client'`)
- Metadata exports only in Server Components
- `'use client'` directive on first line of client files
- Data fetching in Server Components, pass props down

---

## 7. React Patterns

- Functional components with hooks (no class components)
- Custom hooks for reusable stateful logic (prefixed with `use`)
- Props typed with interface (not type alias) named `{ComponentName}Props`
- Event handlers named `handle{EventName}` (e.g., `handleSubmit`, `handleClick`)
- Avoid `any` — use `unknown` with type guards

```typescript
interface UserProfileCardProps {
  user: IUser;
  onUpdate: (user: IUser) => void;
}

export function UserProfileCard({ user, onUpdate }: UserProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const handleSave = () => { /* ... */ };
  return ( /* ... */ );
}
```

---

## 8. Error Handling Patterns

```typescript
// ✅ Correct — domain-specific exceptions
export class UserNotFoundError extends Error {
  public readonly code = 'USER_NOT_FOUND';
  constructor(public readonly userId: string) {
    super(`User with ID ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

// ✅ Correct — typed error boundaries
try {
  const user = await this.usersService.findById(id);
} catch (error) {
  if (error instanceof UserNotFoundError) {
    throw new NotFoundException(error.message);
  }
  throw error;
}
```

See [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md#fail-fast-principle) for more on error handling philosophy.

---

## 9. Enforcement

These standards are enforced by:
- **Pre-commit hooks** (husky + lint-staged)
- **CI pipeline** (`lint` and `typecheck` jobs)
- **Code review** per [CODE_REVIEW_GUIDE.md](./CODE_REVIEW_GUIDE.md)
