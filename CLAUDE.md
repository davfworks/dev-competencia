# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # Type-check with tsc -b, then build with Vite
npm run lint      # ESLint check
npm run preview   # Preview production build
```

There are no tests configured. TypeScript strict mode is enforced (`noUnusedLocals`, `noUnusedParameters`) — the build will fail on type errors.

## Architecture

This is a single-page React 19 + TypeScript + Vite landing page for "Travesía Rieles del Lago 2026," a cycling event around Lake San Pablo, Ecuador.

### Content-driven design

All website copy lives in JSON files under `src/data/`. Components read from these files rather than hardcoding content. TypeScript interfaces in `src/types/index.ts` define the contracts for every JSON schema. When adding or changing visible content, edit the JSON files; when adding new data shapes, update the types first.

### Component → data mapping

| Component | JSON source |
|---|---|
| `Hero.tsx` | `hero.json` (logo, edition, video URL) |
| `Countdown.tsx` | `countdown.json` (target date, slogan) |
| `Competition.tsx` | `competition.json` (history, objectives) |
| `Registration.tsx` | `registration.json` (fields, categories) |
| `Sponsors.tsx` | `sponsors.json` (3-tier structure) |
| `Footer.tsx` | `footer.json`, `contact.json`, `social.json` |

`details.json` and `articles.json` exist but their sections are not yet implemented.

### Form submission

`Registration.tsx` validates with Zod + React Hook Form, then POSTs to `http://localhost:3001/api/register`. The backend (`server/`) is not yet implemented — the server directory is empty. When building the backend, it will be an Express + Nodemailer app on port 3001.

### Styling

Tailwind CSS v4 utility classes only — `App.css` is unused. The accent color palette is black/white/orange-500/orange-600. Responsive breakpoints follow mobile-first (`md:`, `lg:`).

### Animations

Framer Motion is used for scroll-triggered reveals, the conditional team-name field in the registration form, and button hover effects.

### Static assets

Logo and sponsor images are served from `/public/assets/images/`. The Hero component supports local MP4, YouTube embed, or Vimeo embed — controlled via `hero.json`.
