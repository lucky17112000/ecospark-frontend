# EcoSpark

**Where green ideas don't just get shared — they get reviewed, voted on, and sold.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![TanStack](https://img.shields.io/badge/TanStack-Query%20%2B%20Form-FF4154?style=flat-square)](https://tanstack.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

---

## What is EcoSpark?

Most platforms let you post things. EcoSpark lets you **build a case for your idea** — define the problem, propose the solution, back it with images, and let the community vote on whether it's worth pursuing. Admins review everything. High-value ideas can be monetized. The result is a structured pipeline, not a comment feed.

---

## The Life of an Idea

Every idea on EcoSpark takes this journey:

```
  YOU                PLATFORM              ADMIN              COMMUNITY
  ────               ────────              ─────              ─────────

  Write idea    →   UNDER REVIEW    →    Approve?    →    Public listing
  (title,            (locked from         │                  │
   problem,           public view)        ├─ YES  ──────→   Vote UP / DOWN
   solution,                              │                  Purchase (if paid)
   images,                                └─ NO   ──────→   Rejected
   price?)                                          (with feedback message)
```

Your dashboard shows exactly where each of your ideas sits in that pipeline.

---

## Who Uses EcoSpark?

| You are... | What you can do |
|---|---|
| **A visitor** | Browse public ideas, read details, see vote counts |
| **A registered user** | Submit ideas, vote, purchase premium ideas, manage your dashboard |
| **An admin** | Review all submitted ideas, approve or reject with written feedback, manage payments and users |

Role separation is enforced server-side — the frontend reads your JWT, the backend verifies it.

---

## What's Actually Happening Behind the UI

The browser never talks directly to the backend. Every request goes through **Next.js route handlers** that act as a private proxy layer:

```
  Browser                Next.js Server              Backend (Vercel)
  ───────                ──────────────              ────────────────

  fetch("/api/ideas") → /src/app/api/ideas/route.ts → ecospark-backend.vercel.app
                                │
                         Forwards cookies
                         Keeps secrets server-side
                         Handles CORS transparently
```

This means:
- `JWT_ACCESS_SECRET` is **never** in the browser bundle
- Cookie-based sessions work across server and client components
- The backend URL can change without touching frontend components

---

## Tech Stack

| Layer | Technology |
|---|---|
| RENDERING | [Next.js](https://nextjs.org) 16 App Router (SSR + RSC) |
| LANGUAGE | [TypeScript](https://www.typescriptlang.org) 5 |
| UI LAYER | [React](https://react.dev) 19 + [Tailwind CSS](https://tailwindcss.com) v4 |
| COMPONENTS | [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) |
| FORMS | [TanStack Form](https://tanstack.com/form/latest) + [Zod](https://zod.dev) |
| SERVER STATE | [TanStack Query](https://tanstack.com/query/latest) (with SSR prefetch) |
| TABLE | [TanStack Table](https://tanstack.com/table/latest) |
| HTTP | [Axios](https://axios-http.com) (custom httpClient) |
| AUTH | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) + cookie sessions |
| NOTIFICATIONS | [Sonner](https://sonner.emilkowal.ski) |
| BUILD | [Bun](https://bun.sh) |

---

## Pages at a Glance

```
/                        Landing — SSR prefetched idea cards
/idea                    Paginated idea browser (filter by category, status)
/idea/[id]               Full idea detail — votes, purchase gate, images
/login  /register        Auth entry points
/verify-email            OTP-based email confirmation
/forgot-password         Initiates reset flow
/reset-password          Token-validated new password
/change-password         Authenticated password update

/dashboard/create-idea           Submit a new idea (multipart upload)
/dashboard/under-review-idea     Your ideas awaiting admin review
/dashboard/selected-idea         Your approved ideas
/dashboard/rejected-idea         Rejected ideas with admin feedback
/dashboard/rejected-idea/[id]    View rejection reason in detail

/admin/dashboard/idea-managment        All ideas across all users
/admin/dashboard/selected-idea         Approved ideas management
/admin/dashboard/under-review-idea     Review queue
/admin/dashboard/rejected-idea/[id]    Rejection detail
/admin/dashboard/payment-managment     Purchase records
```

---

## Get Running Locally

**1. Clone and install**

```bash
git clone https://github.com/lucky17112000/ecospark-frontend.git
cd ecospark-frontend
npm install
```

**2. Set up environment**

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```bash
NEXT_PUBLIC_API_BASE_URL=https://ecospark-backend.vercel.app/api/v1
JWT_ACCESS_SECRET=your_jwt_secret_here
```

> `JWT_ACCESS_SECRET` must match what the backend uses to sign tokens — it's used server-side only to verify sessions.

**3. Start dev server**

```bash
npm run dev
# opens at http://localhost:3000
```

---

## Project Layout

```
src/
├── app/
│   ├── (commonLayout)/              # Public: home, ideas, about, blog, contact
│   │   └── (authRouteGroup)/        # Login, register, verify, reset, change password
│   ├── (dashboardLayout)/
│   │   ├── (user)/dashboard/        # User idea management
│   │   └── admin/dashboard/         # Admin moderation + payment views
│   └── api/                         # Proxy route handlers (never touch the browser)
│
├── components/
│   ├── modules/                     # Feature components: auth, dashboard, admin
│   ├── shared/                      # Navbar, footer, AppField, AppSubmitButton
│   └── ui/                          # shadcn-style primitives
│
├── services/                        # API functions: auth, idea, vote, purchase, admin
├── lib/                             # httpClient, JWT utils, cookie helpers
├── types/                           # Shared TypeScript interfaces
├── zod/                             # Validation schemas (auth + idea)
└── hooks/                           # use-mobile and other custom hooks
```

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Points to the backend API |
| `JWT_ACCESS_SECRET` | Yes | Verifies JWTs server-side |
| `NEXT_PUBLIC_APP_URL` | No | App origin (defaults to localhost:3000) |
| `NEXT_PUBLIC_BACKEND_URL` | No | Full backend origin |

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

---

## Deployment Notes (Vercel)

Add `NEXT_PUBLIC_API_BASE_URL` and `JWT_ACCESS_SECRET` to **all three environments** (Production, Preview, Development) in Vercel project settings.

Pages that call `cookies()` render dynamically by design — do not force static on auth-gated routes.

---

## Known Gotchas

> **`NEXT_PUBLIC_API_BASE_URL is not defined`**  
> The variable exists in `.env.local` locally but must also be set explicitly in Vercel. It is NOT auto-inherited.

> **`Dynamic server usage` during build**  
> Expected. Any route reading `cookies()` at request time is dynamic. This is intentional, not a bug.

---

<div align="center">

Built by **Alamin Mustafa Rahim** · EcoSpark Full-Stack Mission

*Backend lives at `ecospark-backend.vercel.app` — this repo is the frontend only.*

</div>
