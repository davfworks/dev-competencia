# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # Type-check with tsc -b, then build with Vite
npm run lint      # ESLint check
npm run preview   # Preview production build
```

Server (local dev only):
```bash
cd server && node server.js   # Express + Nodemailer on port 3001
cd server && npm run dev      # With nodemon
```

There are no tests configured. TypeScript strict mode is enforced (`noUnusedLocals`, `noUnusedParameters`) — the build will fail on type errors.

## Architecture

This is a single-page React 19 + TypeScript + Vite landing page for "Travesía Rieles del Lago 2026," a cycling event around Lake San Pablo, Ecuador.

### Content-driven design

All website copy lives in JSON files under `src/data/`. Components read from these files rather than hardcoding content. TypeScript interfaces in `src/types/index.ts` define the contracts for every JSON schema. When adding or changing visible content, edit the JSON files; when adding new data shapes, update the types first.

### Component → data mapping

| Component | JSON source |
|---|---|
| `Hero.tsx` | `hero.json` (logo, edition, video URL, slogan) |
| `Countdown.tsx` | `countdown.json` (target date, location, distance, cta) |
| `Competition.tsx` | `competition.json` (history, objectives) |
| `Registration.tsx` | `registration.json` (fields, categories, bank details) |
| `Sponsors.tsx` | `sponsors.json` (3-tier structure) |
| `Footer.tsx` | `footer.json`, `contact.json`, `social.json` |

`details.json` and `articles.json` exist but their sections are not yet implemented.

### Colors & theme

Defined in `src/index.css` via Tailwind v4 `@theme`:
- `--color-brand: #512286` (purple)
- `--color-brand-light: #f3e8ff`
- `--color-accent: #96e0bf` (mint green)

Global font: `paralucent` applied with `!important` on `*`. To override per-element use a CSS class with `!important` (e.g. `.font-indie-flower`).

### Styling

Tailwind CSS v4 utility classes only — `App.css` is unused. Responsive breakpoints follow mobile-first (`md:`, `lg:`).

### Animations

Framer Motion is used for scroll-triggered reveals, the registration form steps, and the Hero curtain loader.

### Static assets

Logo and sponsor images are served from `/public/assets/images/`. The Hero component supports local MP4, YouTube embed, or Vimeo embed — controlled via `hero.json`.

---

## Hero component

- **Video background**: YouTube iframe uses absolute positioning with `minWidth: 177.78vh` to cover mobile portrait screens. `100dvh` height avoids mobile browser bar shifts.
- **Loader**: Purple curtain (`#512286`) splits vertically on exit after 2 seconds minimum. For local video also waits for `onCanPlayThrough`. For YouTube/Vimeo `videoReady` starts as `true`.
- **Slogan**: Rendered word-by-word; odd-indexed words get `color: #96e0bf`. Font: `Indie Flower` (Google Fonts), loaded in `index.html`.
- **GPU layers**: `willChange: transform` + `translateZ(0)` on the video container to prevent trembling.

---

## Navbar

- `z-[60]` keeps it above the Hero loader (`z-50`).
- Mobile menu overlay is rendered **outside** `<nav>` (as a sibling) to avoid the CSS transform stacking context trapping fixed children. Background: `style={{ backgroundColor: '#512286' }}`, `z-[70]`.

---

## Registration flow (3 steps)

1. **Form** — validated with Zod + React Hook Form. Individual and team forms.
2. **Payment** — shows bank transfer details (from `registration.json → bank`), confirmation code, and file upload for payment proof.
3. **Success** — shows alphanumeric confirmation code (4 uppercase letters + 6 digits, e.g. `XVBK019283`).

### Validation rules
- Phone: exactly 10 digits (`/^\d{10}$/`)
- Birth date: text input with auto-mask, format `DD/MM/AAAA` (`/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/`)
- Removed fields: `category`, `country`
- Prices: individual $15, team $14/person

### Bank config
Edit `server/config.json` (gitignored — never commit). Keys: `bank.name`, `bank.accountHolder`, `bank.accountNumber`, `bank.accountType`, `bank.identification`, `bank.concept`.

---

## Backend — `server/server.js`

Express + Nodemailer on port 3001. Reads SMTP config from `server/config.json` (gitignored).

**`server/config.json` structure:**
```json
{
  "smtp": { "host": "smtp.ionos.com", "port": 587, "secure": false, "auth": { "user": "...", "pass": "..." } },
  "from": "...",
  "organizerEmail": "...",
  "frontendOrigin": "http://localhost:5173",
  "port": 3001
}
```

IONOS SMTP: use `host: smtp.ionos.com`, `port: 587`, `secure: false`. `smtp.ionos.es` does not work.

Sends two emails per registration:
- Participant: confirmation code + registration details
- Organizer: summary table + payment proof attached

`from` field must use plain ASCII (no accented characters) to avoid IONOS 550 rejection.

---

## Vercel deployment

- Frontend: auto-detected as Vite. `vercel.json` only contains `{ "framework": "vite" }`.
- Backend: `api/register.js` — Vercel serverless function (ESM). Reads SMTP from env vars when `process.env.SMTP_HOST` is set, falls back to `server/config.json` for local dev.

**Vercel environment variables required:**
| Variable | Value |
|---|---|
| `SMTP_HOST` | `smtp.ionos.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | IONOS email address |
| `SMTP_PASS` | IONOS password |
| `SMTP_FROM` | not used (built from SMTP_USER in code) |
| `ORGANIZER_EMAIL` | email to receive registrations |

GitHub repo: `https://github.com/davfworks/dev-competencia.git` — Vercel auto-deploys on every push to `master`.

---

## Footer

Social icons use inline SVG paths (Instagram, Facebook, YouTube, TikTok) — Lucide does not have brand icons. The `iconMap` in `Footer.tsx` maps the `icon` field from `social.json` to SVG components.
