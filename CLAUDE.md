# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
bun run dev       # Start dev server (uses bun --bun next dev)
bun run build     # Production build
bun run start     # Start production server
bun run lint      # Run ESLint
```

No test framework is configured in this project.

## Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api/v1  # Backend API base URL
JWT_ACCESS_SECRET=your_access_token_secret                        # Used server-side to decode JWTs
```

## Architecture Overview

**EcoSpark** is a community sustainability platform. This is a Next.js 16 App Router frontend that proxies requests to an external backend (`NEXT_PUBLIC_API_BASE_URL`).

### Route Groups

| Group | Path prefix | Protection |
|---|---|---|
| `(commonLayout)` | `/`, `/about`, `/contact`, `/idea` | Public |
| `(authRouteGroup)` | `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` | Redirects to dashboard if already logged in |
| `(dashboardLayout)` | `/dashboard/**`, `/my-profile` | Requires `USER` role |
| Admin | `/admin/dashboard/**` | Requires `ADMIN` or `SUPER_ADMIN` role |

### Middleware & Auth Flow

`src/proxy.ts` is the Next.js middleware. It:
- Decodes `accessToken` cookie (JWT, no signature verification — decode only)
- Proactively refreshes the token via `refreshToken` cookie when expiry is near
- Redirects unauthenticated users to `/login?redirect=<pathname>`
- Redirects wrong-role users to their own dashboard
- Treats `SUPER_ADMIN` as `ADMIN` for routing purposes

### HTTP Client (`src/lib/axios/httpClient.ts`)

All server-side data fetching goes through `httpClient` (get/post/put/patch/delete). Each call:
1. Creates an axios instance with cookies forwarded to the backend
2. Proactively refreshes the access token if it's expiring soon (checks `x-token-refreshed` header to avoid loops)
3. Returns typed `ApiResponse<TData>`

**Never use raw axios in pages/components** — always use `httpClient` for server-side calls and `services/*` for the actual API operations.

### Next.js API Routes (Proxy Layer)

Routes under `src/app/api/` forward requests to the backend. They exist primarily to:
- Strip/add auth headers the browser can't set
- Handle cookie-based auth transparently for client components

The real backend lives at `NEXT_PUBLIC_API_BASE_URL`. The Next.js API routes re-export from sibling route files (e.g. `/api/v1/idea/route.ts` re-exports from `/api/ideas/route.ts`).

### Data Fetching Pattern

- **Server Components** call `httpClient` directly (cookie headers forwarded automatically)
- **Client Components** use `@tanstack/react-query` hooks that call the Next.js API proxy routes
- Forms use `@tanstack/react-form` with Zod schemas from `src/zod/`

### Key Directories

- `src/services/` — typed wrappers around `httpClient` for each domain (auth, idea, admin, purchase, vote, category)
- `src/types/` — shared TypeScript types for API responses and domain models
- `src/zod/` — Zod v4 validation schemas for forms
- `src/lib/` — utilities: `authUtiles.ts` (role/route helpers), `cookie.utiles.ts`, `token.utiles.ts`, `jwtUtiles.ts`, `navItems.ts`
- `src/components/ui/` — shadcn-style primitives (do not modify unless adding new primitives)
- `src/components/shared/` — cross-cutting components (navbar, profile, submit button)
- `src/components/modules/` — feature-scoped components grouped by domain

### Styling

Tailwind CSS v4 with PostCSS. Theme variables use OKLch colors defined in `src/app/globals.css`. Dark mode via `next-themes`. Component variants use `class-variance-authority`.
