# Filtering & Search Guide

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Backend API (`backend/`) & Frontend (`frontend/`)

## Table of Contents

1. [Query Parameter Format for List Endpoints](#query-parameter-format-for-list-endpoints)
2. [Supported Operators](#supported-operators)
3. [Full-Text Search Configuration](#full-text-search-configuration)
4. [Category and Skill Filtering](#category-and-skill-filtering)
5. [Budget Range Filtering](#budget-range-filtering)
6. [Date Range Filtering](#date-range-filtering)
7. [Sorting Options](#sorting-options)
8. [Examples](#examples)

---

## Query Parameter Format for List Endpoints

### Standard Query Structure

All list endpoints follow a consistent query parameter format:

```
GET /api/{resource}?page=1&limit=20&sort=createdAt:desc&filters=...
```

### Common Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number (1-indexed) |
| `limit` | number | `20` | Items per page (max: 100) |
| `sort` | string | `createdAt:desc` | Sort field and direction |
| `search` | string | — | Full-text search query |
| `filters` | JSON string | — | Structured filter criteria |

### Filter Encoding

Filters are passed as URL-encoded JSON string in the `filters` parameter:

```
GET /api/projects?filters=%7B%22status%22%3A%7B%22eq%22%3A%22open%22%7D%7D
```

Decoded equivalent:
```
GET /api/projects?filters={"status":{"eq":"open"}}
```

### Backend DTO

```ts
// backend/src/common/dto/query-params.dto.ts
export class QueryParamsDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @IsOptional()
  sort?: string = 'createdAt:desc'

  @IsOptional()
  search?: string

  @IsOptional()
  filters?: Record<string, FilterCriteria>
}

export class FilterCriteria {
  eq?: string | number | boolean
  neq?: string | number
  gt?: number
  gte?: number
  lt?: number
  lte?: number
  in?: (string | number)[]
  contains?: string
  between?: [number, number]
  dateBetween?: [string, string]
}
```

---

## Supported Operators

### Operator Definitions

| Operator | Symbol | Type | Description | Example |
|----------|--------|------|-------------|---------|
| Equals | `eq` | any | Exact match | `status: { eq: "open" }` |
| Not Equals | `neq` | any | Not equal to value | `status: { neq: "closed" }` |
| Greater Than | `gt` | number/date | > value | `budget: { gt: 1000 }` |
| Greater Than or Equal | `gte` | number/date | >= value | `budget: { gte: 500 }` |
| Less Than | `lt` | number/date | < value | `budget: { lt: 10000 }` |
| Less Than or Equal | `lte` | number/date | <= value | `budget: { lte: 5000 }` |
| In Array | `in` | array | Value in list | `status: { in: ["open", "in_progress"] }` |
| Contains | `contains` | string | Partial string match | `title: { contains: "react" }` |
| Between | `between` | [number, number] | Range inclusive | `budget: { between: [1000, 5000] }` |
| Date Between | `dateBetween` | [string, string] | Date range (ISO) | `createdAt: { dateBetween: ["2026-01-01", "2026-06-30"] }` |

### Operator Availability by Field Type

| Field Type | Supported Operators |
|-----------|-------------------|
| String (exact) | `eq`, `neq`, `in` |
| String (text) | `eq`, `neq`, `in`, `contains` |
| Number | `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `between` |
| Boolean | `eq` |
| Date | `eq`, `gt`, `gte`, `lt`, `lte`, `dateBetween` |
| Enum | `eq`, `neq`, `in` |
| Array | `contains` (element match) |

### Multiple Filters

Multiple filters are combined with **AND** logic:

```json
{
  "status": { "eq": "open" },
  "budget": { "between": [1000, 5000] },
  "category": { "in": ["web-dev", "mobile"] }
}
```

---

## Full-Text Search Configuration

### How It Works

Full-text search uses PostgreSQL's `tsvector`/`tsquery` on the backend:

```sql
-- Search configuration for Arabic + English
ALTER TABLE projects ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'B')
  ) STORED;

CREATE INDEX projects_search_idx ON projects USING GIN(search_vector);
```

### Search Input

```
GET /api/projects?search=react+developer+cairo
```

This searches across:
- Project titles
- Project descriptions
- Freelancer profile titles/ bios
- Skill names

### Search Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `search` | Search query string | — |
| `searchFields` | Comma-separated field names | `title,description` |
| `searchMode` | `'any'` (OR) or `'all'` (AND) | `'any'` |

### Backend Implementation

```ts
// backend/src/common/helpers/search.helper.ts
export function buildSearchQuery(search: string, fields: string[]) {
  const sanitized = search.replace(/[^\w\s\u0600-\u06FF]/g, '').trim()
  const terms = sanitized.split(/\s+/).filter(Boolean)

  if (terms.length === 0) return {}

  const searchConditions = terms.map((term) =>
    fields.map((field) => ({
      [field]: { contains: term },
    }))
  ).flat()

  return { OR: searchConditions }
}
```

### Arabic Search Support

- PostgreSQL supports Arabic text search via the `arabic` configuration
- The search index uses `simple` configuration to support both Arabic and English in the same field
- Arabic stop words are handled by the `arabic` text search configuration
- Stemming is not applied to Arabic to preserve exact matches

---

## Category and Skill Filtering

### Category Filter

```
GET /api/projects?filters={"categoryId":{"eq":"cat-123"}}
GET /api/projects?filters={"category":{"in":["web-dev","mobile","design"]}}
```

### Skill Filter

```
GET /api/projects?filters={"skills":{"contains":"react"}}
GET /api/projects?filters={"skills":{"in":["react","typescript","nodejs"]}}
```

### AND/OR for Skills

By default, multiple skills use OR logic. Use `skillsMode` parameter:

```
GET /api/projects?filters={"skills":{"in":["react","typescript"]}}&skillsMode=all
```

| Mode | Behavior |
|------|----------|
| `any` (default) | Project has at least one of the listed skills |
| `all` | Project has ALL of the listed skills |

### Hierarchical Categories

Categories support parent-child hierarchy. Use `includeSubcategories`:

```
GET /api/projects?filters={"categoryId":{"eq":"web-dev"}}&includeSubcategories=true
```

---

## Budget Range Filtering

### Single Budget Filter

```
GET /api/projects?filters={"budget":{"gt":1000}}
GET /api/projects?filters={"budget":{"lt":10000}}
GET /api/projects?filters={"budget":{"between":[5000,15000]}}
```

### Budget Type

Projects have `budgetMin` and `budgetMax` for range budgets, or `budgetFixed` for fixed-price:

```
GET /api/projects?filters={"budgetMin":{"gte":1000},"budgetMax":{"lte":10000}}
GET /api/projects?filters={"budgetFixed":{"between":[500,5000]}}
```

### Budget Type Filter

```
GET /api/projects?filters={"budgetType":{"eq":"fixed"}}
GET /api/projects?filters={"budgetType":{"eq":"hourly"}}
GET /api/projects?filters={"budgetType":{"eq":"range"}}
```

---

## Date Range Filtering

### Single Date Filters

```json
// Projects created after January 1, 2026
{ "createdAt": { "gte": "2026-01-01" } }

// Projects with deadline before December 31, 2026
{ "deadline": { "lte": "2026-12-31T23:59:59Z" } }
```

### Date Between

```json
{ "createdAt": { "dateBetween": ["2026-01-01", "2026-06-30"] } }
```

### Common Date Presets

Frontend sends date range as preset or custom:

```
GET /api/projects?filters={"createdAt":{"gte":"2026-06-01"}}
```

| Preset | Backend Translation |
|--------|-------------------|
| `today` | `createdAt >= 2026-07-06` |
| `week` | `createdAt >= 2026-06-29` |
| `month` | `createdAt >= 2026-06-06` |
| `quarter` | `createdAt >= 2026-04-06` |
| `year` | `createdAt >= 2025-07-06` |
| `custom` | User-defined range |

---

## Sorting Options

### Sort Syntax

```
GET /api/projects?sort=createdAt:desc
GET /api/projects?sort=budget:asc
GET /api/projects?sort=title:asc
```

### Multiple Sorts

```
GET /api/projects?sort=status:asc,createdAt:desc
```

### Available Sort Fields by Resource

| Resource | Sortable Fields |
|----------|----------------|
| Projects | `createdAt`, `updatedAt`, `title`, `budgetMin`, `budgetMax`, `budgetFixed`, `deadline`, `status`, `proposalCount` |
| Proposals | `createdAt`, `updatedAt`, `amount`, `status` |
| Users | `createdAt`, `updatedAt`, `name`, `email`, `rating`, `completedProjects` |
| Contracts | `createdAt`, `startDate`, `endDate`, `amount`, `status` |
| Payments | `createdAt`, `amount`, `status` |

### Default Sort

All list endpoints default to `sort=createdAt:desc` (newest first).

---

## Examples

### Complete Examples

**1. Search for React projects in Cairo with budget between $1k–$5k:**

```
GET /api/projects?search=react&limit=20&page=1&sort=createdAt:desc
  &filters={"status":{"eq":"open"},
            "location":{"contains":"cairo"},
            "budgetFixed":{"between":[1000,5000]}}
```

**2. Filter freelancers by skills (must have React AND TypeScript):**

```
GET /api/freelancers?filters={"skills":{"in":["react","typescript"]}}&skillsMode=all
  &sort=rating:desc&limit=10
```

**3. Admin view: suspended users, sorted by suspension date:**

```
GET /api/admin/users?filters={"status":{"eq":"suspended"}}
  &sort=updatedAt:desc&limit=50&page=1
```

**4. Active contracts with payment disputes (client view):**

```
GET /api/contracts?filters={"status":{"eq":"active"},
                             "hasDispute":{"eq":true}}
  &sort=createdAt:asc
```

**5. Projects in web-dev or mobile categories, created this month:**

```
GET /api/projects?filters={"categoryId":{"in":["cat-web-dev","cat-mobile"]},
                            "createdAt":{"gte":"2026-07-01"}}
  &sort=budgetMin:desc
```

**6. Proposals for a specific project, sorted by amount ascending:**

```
GET /api/proposals?filters={"projectId":{"eq":"proj-abc-123"}}
  &sort=amount:asc&limit=50
```

**7. Payment history for Q2 2026:**

```
GET /api/payments?filters={"createdAt":{"dateBetween":["2026-04-01","2026-06-30"]},
                            "status":{"eq":"completed"}}
  &sort=createdAt:desc
```

### Frontend Hook Example

```tsx
// hooks/useFilteredProjects.ts
interface ProjectFilters {
  search?: string
  status?: string
  categoryId?: string
  skills?: string[]
  budgetMin?: number
  budgetMax?: number
  createdAt?: DateRange
  sort?: string
  page?: number
}

export function useFilteredProjects(filters: ProjectFilters) {
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: filters.page || 1,
      limit: 20,
      sort: filters.sort || 'createdAt:desc',
    }

    if (filters.search) params.search = filters.search

    const filterObj: Record<string, any> = {}
    if (filters.status) filterObj.status = { eq: filters.status }
    if (filters.categoryId) filterObj.categoryId = { eq: filters.categoryId }
    if (filters.skills?.length) filterObj.skills = { in: filters.skills }
    if (filters.budgetMin) filterObj.budgetFixed = { ...filterObj.budgetFixed, gte: filters.budgetMin }
    if (filters.budgetMax) filterObj.budgetFixed = { ...filterObj.budgetFixed, lte: filters.budgetMax }
    if (filters.createdAt) filterObj.createdAt = {
      dateBetween: [filters.createdAt.from, filters.createdAt.to],
    }

    if (Object.keys(filterObj).length > 0) {
      params.filters = JSON.stringify(filterObj)
    }

    return params
  }, [filters])

  return useQuery({
    queryKey: ['projects', queryParams],
    queryFn: () => projectsApi.getAll(queryParams),
    placeholderData: keepPreviousData,
  })
}
```

---

## Cross-References

| Document | Link |
|----------|------|
| API Endpoints | [ENDPOINTS.md](../ENDPOINTS.md) |
| Pagination | [PAGINATION.md](../PAGINATION.md) |
| Database Schema | [DATABASE.md](../DATABASE.md) |
| Error Codes | [ERROR_CODES.md](./ERROR_CODES.md) |
| State Management | [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) |
