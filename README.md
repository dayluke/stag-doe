# Stag & Doe

A mobile-friendly stag-and-doe weekend site and RSVP form built with
**Next.js 16**, **Tailwind CSS v4**, **shadcn/ui primitives**, **Framer
Motion** and **Supabase**. Deploys as a static site to **GitHub Pages** via
GitHub Actions.

## The look

The whole site is a web translation of the printed invite,
[`public/Stag-and-Doe-invite.png`](./public/Stag-and-Doe-invite.png):

- **Palette** — the invite's cream ground (`#f8f6ea`) and its five inks:
  blue, rose, red, olive and gold. Sampled straight from the artwork and
  declared as `--brand-*` in `src/app/globals.css`. Each ink also has a
  darker `--brand-*-ink` cousin, because the drawing colours don't clear
  AA contrast at body-copy sizes.
- **Type** — Block Berthold, the invite's own poster face, self-hosted
  from `public/fonts` (font by [OnlineWebFonts](https://www.onlinewebfonts.com/fonts),
  CC BY 4.0 — keep the credit if you keep the font). Nunito for body copy.
- **The wavy frame** — `src/components/ui/wavy-frame.tsx`. It measures its
  container and regenerates the path rather than stretching one SVG, so
  the wave period and line weight stay constant on any aspect ratio.
  `WavyRule` is the same line as a single horizontal rule.
- **The drawings** — the hand-drawn SVGs in `/public`, wrapped by
  `src/components/ui/doodle.tsx`. Where a section has no matching drawing
  it falls back to a lucide glyph in an ink stamp (`InkBadge`).

## What's here

Sections, in order of appearance:

1. **Hero** — the invite itself: names, the doodle grid, "Stag & Doe".
2. **The essentials** — the photo in a wavy frame, dates, place, cost.
3. **Itinerary** — one swipeable card per day.
4. **The house** — description, rooms carousel, what's provided.
5. **Getting there** — address, map link, car / train / lifts.
6. **Food & drink** — what's covered vs. bring your own.
7. **What to bring** — the packing list.
8. **What it costs** — the per-person total, the breakdown, how to pay.
9. **RSVP** — a dedicated section, plus a sticky bottom bar that appears
   once the user scrolls past the hero.
10. **Good to know** — house rules and who to contact.
11. **Footer** — names, date, a closing line.

The **RSVP dialog** lets a guest:

- Search by name (case-insensitive substring match on the guest list).
- Pick the right party if multiple matches come back.
- Mark each person in their party as attending or not.
- Set which days each attending person is around for, with a two-handle
  slider (arrival day → departure day; the nights in between are what
  gets saved).
- Leave dietary / other notes.
- Come back later and edit their response (just searching again loads
  their existing answers).

If Supabase isn't configured yet, the dialog runs in a friendly **demo
mode** so you can still click through the UI.

## Quick start

```bash
npm install
cp .env.example .env.local    # and fill in your Supabase URL + anon key
npm run dev
```

Then open http://localhost:3000.

## Customising your content

Almost everything you'll want to change lives in one file:

```text
src/lib/site-config.ts
```

Names, the dates, the itinerary, the house, travel, food, the packing
list, the costs and the RSVP deadline are all edited there. The palette
and typography live in `src/app/globals.css` — override the `--brand-*`
variables at the top to reskin the whole site.

Put your photo in `/public` and update `heroImageUrl` in `site-config.ts`
(e.g. `/our-photo.jpg`) — it's used in **The essentials** section.

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor → New query**, paste in
   [`supabase/schema.sql`](./supabase/schema.sql) and run it. This creates
   the `parties` and `guests` tables, the search index, and the RLS
   policies that allow the anon key to read and update RSVPs but **not**
   insert or delete rows.
3. Load your guest list. You can either:
   - Edit `supabase/seed.example.sql` and run it in the SQL editor; or
   - Use the table editor UI to add parties and guests directly.
4. Find your project URL and anon key in **Project Settings → API**, and
   put them in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

### Why is the anon key safe to expose?

It is — that's what it's designed for. All security is enforced by Row
Level Security policies in Postgres. The policies in `schema.sql`:

- allow anyone to **read** `parties` and `guests` (required for
  name-based search); and
- allow anyone to **update** guest rows (required to submit / edit
  RSVPs), but explicitly do **not** allow inserts or deletes.

So the worst a malicious visitor could do is flip someone else's RSVP —
which, for a guest list of people you know, is an acceptable risk. If
you want tighter control, replace the update policy with a
`security definer` RPC that only touches the specific RSVP columns.

## Deploying to GitHub Pages

1. Create a repo on GitHub and push this code to it (`main` branch).
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. In **Settings → Secrets and variables → Actions**, add two
   repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Push to `main`. The workflow in
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
   will build the static site and publish it.

Your site will be live at
`https://<username>.github.io/<repo-name>/`. The `basePath` is
automatically derived from the repo name during the GitHub Actions
build, so all links and images work on that sub-path. If you're using a
custom domain at the root, unset `basePath` by setting
`NEXT_PUBLIC_BASE_PATH=` to an empty string.

## Scripts

| Command         | What it does                               |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Local dev server at http://localhost:3000  |
| `npm run build` | Static export into `out/`                  |
| `npm run lint`  | ESLint                                     |

## Tech

- **Next.js 16** App Router, static export (`output: 'export'`)
- **Tailwind CSS v4** with CSS variables for theming
- **Radix UI** primitives (Dialog, RadioGroup, Label)
- **Embla Carousel** for the itinerary and rooms sliders
- **Framer Motion** for scroll-triggered fades and the sticky CTA
- **Sonner** for toasts
- **Supabase** as the RSVP backend

## Project layout

```text
src/
  app/
    layout.tsx          Fonts + metadata + toaster
    page.tsx            Composes the sections in order
    globals.css         Palette + tokens (edit me to reskin)
  components/
    ui/                 Button, Dialog, Input, Carousel, WavyFrame, Doodle
    sections/           One file per page section
    rsvp/               Sticky CTA + dialog flow
  lib/
    site-config.ts      All your weekend content (edit me!)
    supabase.ts         Client + search / submit helpers
    utils.ts            cn() helper
supabase/
  schema.sql            Tables + indexes + RLS
  seed.example.sql      Example guest-list seed
.github/workflows/
  deploy.yml            GitHub Pages deployment
public/
  hero-placeholder.svg  Replace with your photo
  .nojekyll             Required for GitHub Pages + /_next
```
