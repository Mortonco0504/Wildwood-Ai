# Wildwood Studio

AI-powered animated storytelling studio for **The Little Wildwood**.

Automates creation and distribution of original animated animal stories to YouTube Shorts, TikTok, and Instagram Reels.

## Phase 1 (this branch)

Foundation only:

- Next.js App Router + TypeScript + Tailwind + shadcn/ui + Lucide
- Supabase Auth (email/password + magic link) with RLS
- Full database schema migrations (all product tables)
- Dashboard shell + Character Studio CRUD
- Canonical cast seed: Rocky, Rosie, Ranger, Finn
- Worker / provider stubs for later phases (no live AI/social calls)

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. Copy `.env.example` → `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only — never `NEXT_PUBLIC_`)
3. Apply migrations:

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
# or: paste SQL from supabase/migrations in order via the SQL editor
```

4. In Supabase Auth settings, allow redirect URL:
   `http://localhost:3000/auth/callback`

5. Install and run:

```bash
npm install
npm run dev
```

6. Sign up → Dashboard → Character Studio → **Seed Rocky, Rosie, Ranger, Finn**.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run verify:migrations` | Static migration schema check |

## Project layout

See the product spec. Key dirs: `app/`, `components/`, `lib/`, `workers/` (stubs), `supabase/migrations/`, `types/`.

## Later phases

Phases 2–8 (story, images, Kling, ElevenLabs/FFmpeg, social publishing, analytics, full automation) are **not** implemented here. Provider env vars are documented in `.env.example` for future use.
