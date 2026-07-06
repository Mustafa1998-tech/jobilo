# Pagination

Jobilo API uses **offset-based pagination** for indexed list endpoints.

## Request Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | — | Page number (1-indexed) |
| `pageSize` | integer | 10 | 100 | Items per page |

### Example Request

```
GET /api/v1/projects?page=2&pageSize=20
```

```
GET /api/v1/users?page=1&pageSize=50&role=FREELANCER
```

## Response Format

All paginated responses include a `meta` object with pagination metadata:

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 2,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `page` | integer | Current page number |
| `pageSize` | integer | Items per page |
| `totalCount` | integer | Total number of items |
| `totalPages` | integer | Total pages calculated as `ceil(totalCount / pageSize)` |
| `hasNextPage` | boolean | `true` if there are more pages |
| `hasPrevPage` | boolean | `true` if current page > 1 |

## Default Values

- If `page` is omitted → defaults to `1`
- If `pageSize` is omitted → defaults to `10`
- If `page` is `0` or negative → treated as `1`
- If `pageSize` exceeds `100` → capped at `100`

## Cursor-Based Pagination

Certain high-performance endpoints (notably messages and notifications) may support **cursor-based pagination** as an alternative:

| Parameter | Type | Description |
|-----------|------|-------------|
| `cursor` | string (UUID) | ID of the last item from previous page |
| `take` | integer | Number of items to fetch (max 50) |

### Cursor Response

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "cursor": "uuid-of-last-item",
    "take": 20,
    "hasMore": true
  }
}
```

## Endpoints with Pagination

| Endpoint | Method | Default Pagination |
|----------|--------|-------------------|
| `/projects` | GET | Offset (page 1, size 10) |
| `/users` | GET | Offset (page 1, size 10) |
| `/proposals` | GET | Offset (page 1, size 10) |
| `/contracts` | GET | Offset (page 1, size 10) |
| `/messages/conversations` | GET | Offset (page 1, size 10) |
| `/messages/conversations/:userId` | GET | Cursor |
| `/notifications` | GET | Cursor |
| `/super-admin/users` | GET | Offset (page 1, size 10) |
| `/super-admin/projects` | GET | Offset (page 1, size 10) |
| `/super-admin/proposals` | GET | Offset (page 1, size 10) |
| `/super-admin/disputes` | GET | Offset (page 1, size 10) |
| `/super-admin/reports` | GET | Offset (page 1, size 10) |
| `/super-admin/logs/audit` | GET | Offset (page 1, size 50) |
| `/super-admin/logs/errors` | GET | Offset (page 1, size 50) |

## Client Usage Example

```typescript
// Fetch with pagination
const { data } = await apiClient.get('/projects', {
  params: { page: 1, pageSize: 20, status: 'OPEN' }
});

// data.meta contains pagination info
const { page, pageSize, totalCount, totalPages, hasNextPage } = data.meta;
```

## Search + Filter + Pagination

Most list endpoints combine search, filters, and pagination:

```
GET /projects?page=1&pageSize=10&search=react&categoryId=uuid&status=OPEN&budgetMin=500&budgetMax=5000&experienceLevel=INTERMEDIATE&isUrgent=true&sortBy=newest
```

Available sort options:
| Sort Value | Description |
|------------|-------------|
| `newest` | By `createdAt` descending (default) |
| `oldest` | By `createdAt` ascending |
| `budget_asc` | By budget ascending |
| `budget_desc` | By budget descending |
| `deadline` | By duration ascending |
| `popular` | By `proposalsCount` descending |

**See:** [ENDPOINTS.md](./ENDPOINTS.md) for endpoint-specific query parameters.
