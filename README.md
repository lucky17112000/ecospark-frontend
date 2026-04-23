# EcoSpark Frontend

EcoSpark is a community-driven idea platform focused on sustainability.
Users can explore eco ideas, create and manage ideas, vote, and purchase premium idea content.

This repository contains the frontend built with Next.js App Router, React 19, TypeScript, and TanStack ecosystem tools.

## Live Backend

- Production backend: `https://ecospark-backend.vercel.app`

## Core Features

- Authentication flow
- Register, login, verify email, forgot/reset password, change password
- Cookie-based session/token handling
- Public idea browsing
- Idea listing with query params (page, limit, filters)
- Idea creation with multipart file upload
- Dashboard modules
- User dashboard for idea states and purchased ideas
- Admin dashboard for user and idea management
- Voting and purchase flow support
- API proxy routes inside Next.js (`src/app/api/*`) for backend forwarding
- Toast notifications, tooltips, theme support

## Tech Stack

### Framework and Language

- Next.js `16.2.4` (App Router)
- React `19.2.4`
- TypeScript `^5`

### Data, Forms, and State

- `@tanstack/react-query`
- `@tanstack/react-query-next-experimental`
- `@tanstack/react-form`
- `@tanstack/react-form-nextjs`
- `zod`
- `axios`

### UI and Styling

- Tailwind CSS `v4`
- `@base-ui/react`
- `shadcn`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `next-themes`
- `sonner`
- `lucide-react`
- `vaul`
- `embla-carousel-react`
- `input-otp`

### Auth and Token Utilities

- `jsonwebtoken`

### Lint and Build Tooling

- ESLint `v9`
- `eslint-config-next`
- Bun-powered scripts (`bun --bun next ...`)

## Project Structure

High-level folders:

- `src/app`: Next.js routes and layouts (public, auth, dashboard, API handlers)
- `src/components`: shared UI, feature modules, shadcn-style UI primitives
- `src/services`: API/service layer (auth, idea, vote, admin, purchase)
- `src/lib`: utilities (axios client, token/cookie helpers, nav config, providers)
- `src/types`: shared TypeScript types
- `src/zod`: validation schemas

## Environment Variables

Create `.env.local` for local development.

Minimum required variables:

```bash
NEXT_PUBLIC_API_BASE_URL=https://ecospark-backend.vercel.app/api/v1
JWT_ACCESS_SECRET=your_access_token_secret
```

Optional (currently not required by main flow):

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=https://ecospark-backend.vercel.app
```

Reference file: `.env.example`

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Note: Do not use `pm run ...`; correct command is `npm run ...`.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

- Copy values from `.env.example`
- Update `.env.local` with valid backend URL and secrets

3. Run development server:

```bash
npm run dev
```

4. Open:

- `http://localhost:3000`

## Deployment (Vercel)

Before deploy, add environment variables in Vercel Project Settings:

- `NEXT_PUBLIC_API_BASE_URL`
- `JWT_ACCESS_SECRET`

Add them for all environments:

- Production
- Preview
- Development

Then deploy:

```bash
vercel --prod
```

## Build and Runtime Notes

- Some dashboard pages depend on request-time data (`cookies`), so they are rendered dynamically.
- If you see `NEXT_PUBLIC_API_BASE_URL is not defined`, check Vercel env settings first.
- Local build may pass with `.env.local`, while Vercel fails if project envs are missing.

## Quick Troubleshooting

### `pm: command not found`

Use:

```bash
npm run build
```

### `NEXT_PUBLIC_API_BASE_URL is not defined`

- Ensure variable exists in local `.env.local`
- Ensure variable exists in Vercel environment settings
- Redeploy after updating env values

### `Dynamic server usage` warnings

- These usually appear when a route uses `cookies`/request-time APIs during static attempts
- Keep affected routes dynamic where needed

## Author

Built for EcoSpark frontend mission project.
