# Copilot Instructions for AssamCareerPoint

## Project Overview
**AssamCareerPoint** is a Next.js 16 job portal for government and private jobs in Assam/North East India. It features a public-facing job listings site with an admin dashboard to manage jobs, categories, and PDF documents.

## Architecture

### Core Stack
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Database**: SQLite with better-sqlite3 (file: `database.sqlite` at project root)
- **Auth**: NextAuth v4 with JWT & bcrypt hashing
- **Storage**: PDF files served from `public/` directory

### Key Data Models (see [src/lib/db.ts](src/lib/db.ts))
- **users**: Admin credentials (email + bcrypt-hashed password)
- **categories**: Job categories (govt-jobs, private-jobs, admit-card, etc.) with URL-friendly slugs
- **jobs**: Job postings with category_id foreign key, vacancy count, eligibility, application link
- **pdf_documents**: Uploaded PDFs (syllabus, answer keys, forms)

### Route Protection (see [src/middleware.ts](src/middleware.ts))
- `/admin/*` pages require valid NextAuth session cookie
- Unauthenticated requests to `/admin` paths redirect to `/admin/login`
- Middleware runs on every request matching `matcher: ['/admin/:path*']`
- Session token keys include both `next-auth.session-token` (dev) and `__Secure-next-auth.session-token` (prod)

## Key Patterns & Conventions

### Database Access
- Import `getDb()` from [src/lib/db.ts](src/lib/db.ts) to get singleton connection
- Use `.prepare()` for prepared statements (SQL injection safe)
- Example: `db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId)`
- Database tables auto-create on first run via `createTables()` function

### API Route Pattern
- GET endpoints: public access, auto-handle pagination (limit/page/search params)
- POST endpoints: protected by `getServerSession(authOptions)`, return 401 if unauthorized
- See [src/app/api/jobs/route.ts](src/app/api/jobs/route.ts) for example

### Path Aliases
Use `@/` prefix for all internal imports (automap to `src/` via [tsconfig.json](tsconfig.json)):
```tsx
import getDb from '@/lib/db';          // ← correct
import { authOptions } from '@/lib/auth';  // ← correct
import getDb from '../lib/db';         // ← avoid
```

### Component Markers
- Pages using client-side state (useState, useEffect) must start with `'use client'`
- See [src/app/page.tsx](src/app/page.tsx) for bilingual UI example with localStorage
- Layout/metadata files are Server Components by default

### Authentication Flow
1. Admin submits email + password at [/admin/login](src/app/admin/login/page.tsx)
2. NextAuth compares against bcrypt hash in `users` table via [src/lib/auth.ts](src/lib/auth.ts)
3. On success, JWT token sent as httpOnly cookie
4. Middleware validates token presence before allowing `/admin/*` access

## Critical Developer Workflows

### Local Development
```bash
npm run dev                  # Start dev server (localhost:3000)
npm run lint                 # Run ESLint checks
npm run build && npm run start  # Test production build locally
```

### Database
- SQLite file auto-created on first run at `database.sqlite`
- Default categories inserted automatically if empty
- Use better-sqlite3 synchronous APIs (no async/await)

### Adding a New Admin Page
1. Create route file: `src/app/admin/[feature]/page.tsx`
2. Middleware automatically protects it (requires session)
3. Fetch session via `getServerSession(authOptions)` if needed
4. Access DB via `getDb()` singleton

### Adding a New API Endpoint
1. Create [src/app/api/[resource]/route.ts](src/app/api/jobs/route.ts)
2. Export `GET` and/or `POST` functions
3. POST should check `getServerSession(authOptions)` and return 401 if missing
4. Always wrap in try-catch with error logging

## Important Integration Points

### NextAuth Configuration
- Secret key: `process.env.NEXTAUTH_SECRET` (must be set in `.env.local`)
- Session strategy: JWT (embedded in secure cookie)
- Callback pages: signIn → `/admin/login`
- Provider: CredentialsProvider only (email + password)

### Category System
- Each category has `slug` (URL-safe: `govt-jobs`, `private-jobs`) and `name` (display)
- Jobs reference categories via `category_id` foreign key
- API filter example: `/api/jobs?category=govt-jobs` matches slug in JOIN

### PDF Storage
- Files uploaded to `public/` with category subdirectory
- Path stored in `pdf_documents.file_path` column
- Serve via static route: `/[filename]`

## Styling & Fonts
- Tailwind CSS (TailwindCSS v4 with PostCSS)
- Fonts: Sora (headings), Nunito (body) imported from Google Fonts in [src/app/layout.tsx](src/app/layout.tsx)
- Avoid custom CSS; use Tailwind utilities

## Build & Deployment Notes
- Next.js 16 requires Node.js 18+
- Production build: `npm run build` (generates `.next/`)
- Deploy via Vercel (native Next.js support) or self-host with `npm run start`
- Environment variable: `.env.local` (not committed)

## Common Pitfalls to Avoid
1. **Forgetting `'use client'`** → Pages with hooks will break
2. **Sync DB calls in async context** → better-sqlite3 is synchronous; use `.wait()` or restructure
3. **Missing parameter in prepared statements** → SQL injection risk; always use `?` placeholders
4. **Hardcoding paths** → Use `@/` imports instead of relative paths
5. **Unauthenticated POST API calls** → Always check session in sensitive endpoints
