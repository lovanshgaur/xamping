# BootXamp — Detail

BootXamp is a personal **Career Operating System** for a 7-week frontend apprenticeship. It's an editorial-minimalist, data-driven web app that runs entirely on your device: everything renders from a single JSON model persisted in `localStorage` under the key `bootxamp`.

- Framework: **TanStack Start v1** on **Vite 7**
- Language: **JavaScript (JSX)** only
- Styling: **Tailwind CSS v4** via `src/styles.css` (semantic tokens)
- Charts: **Chart.js** via `react-chartjs-2`
- Motion: **GSAP** + CSS keyframes + `prefers-reduced-motion` aware
- Icons: **lucide-react**
- Avatars: **DiceBear** (single `adventurer` style, 12 curated seeds)
- Storage: single `localStorage` envelope, schema-validated with **Zod**

## Design language

**Editorial Minimalism × Contemporary Brutalism.**

- 6px max radius, hairline (1px) borders, zero shadows
- Two font stacks: `Inter Tight` (display) + `Inter` (body)
- Semantic tokens only — never hardcode colors in components
- 8 palettes × 3 modes (light / dark / system) driven by `data-theme` on `<html>`
- Micro-interactions: `.press`, `.lift`, `.halo`, `.fade-up`, `.shimmer`

## Directory

```
public/
  manifest.webmanifest      PWA manifest
  icon.svg                  App icon
  icon-maskable.svg         Android maskable icon
  apple-touch-icon.svg      iOS home-screen icon
  bootxamp-day1-temp.json   Legacy sample; use docs/samples/ instead

docs/
  detail.md                 (this file)
  samples/                  Ready-to-import JSON templates
    sprint.json             Full sprint shell
    week.json               Single week
    day.json                Single day, all 5 departments
    review-daily.json       Manager daily review
    personal.json           Personal profile import

src/
  config/                   Static app config (name, tagline, storage key, feature flags)
  constants/                Enumerations: routes, ranks, departments, palettes, avatars, animations, limits
  utils/                    Pure helpers: dates, format, download, validation, xp, storage-size
  lib/
    utils.ts                cn() classname helper
    error-*.ts              Lovable error capture (framework)
    bootxamp/
      schema.js             Zod schemas + JSDoc typedefs + detectImportKind()
      store.js              createEmptyData() + hydrateData()
      selectors.js          Pure derivations for the UI
      io.js                 Timeline event constants + appendTimeline()
      domain/               Pure business logic (no React)
        xp.js               Level curve + XP math
        levels.js           Level thresholds
        ranks.js            Rank progression
        streaks.js          Daily streak logic
        promotions.js       Promotion detection
        reviews.js          Weighted review scoring
        operate.js          Health input normalization + composite score
        manager.js          Manager tier progression
        avatar.js           DiceBear URL builder + seed normalization
      services/             Side-effectful adapters
        storage.service.js  Load/save/subscribe to the envelope
        import.service.js   detectImportKind + applyImport (sprint/week/day/review/personal)
        export.service.js   JSON snapshot serialization
        analytics.service.js Build Chart.js-ready series
        backup.service.js   Force backup + wipe + reload
    hooks/
      useBootxamp.js        Central store hook (useSyncExternalStore)
      useTheme.js           Mode + palette application
      useReducedMotion.js   OS + in-app motion preference
      useDayActions.js      Task toggle + day submission XP pipeline
      useOperate.js         Daily health metrics
      useManagerReview.js   Daily + weekly review submission
      useImport.js          Import flow
      useExport.js          Export flow
      useAnalytics.js       Memoized analytics series
    components/
      shared/               Reusable primitives (Button, GraphCard, TaskItem, EmptyState, ...)
      layout/               AppShell, AppSidebar, BottomNav, NotificationsBell
      dashboard/            DashboardHero, ProgressPanels, RecentActivity
      today/                DepartmentSection, SubmitDayBar
      departments/          DepartmentDashboard (Learn/Build/Grow/Career)
      operate/              InputCard, ScoreCard
      manager/              ManagerProfile, DailyReviewForm, WeeklyReviewForm
      profile/              AvatarPicker, SettingsDrawer
      ui/                   shadcn/ui primitives
    routes/
      __root.jsx            Root layout + PWA head + AppShell wrap
      index.jsx             Dashboard (/)
      today.jsx             Daily workspace (/today)
      learn.jsx             Learn department dashboard
      build.jsx             Build department dashboard
      grow.jsx              Grow department dashboard
      career.jsx            Career department dashboard
      operate.jsx           Operate — health + performance
      manager.jsx           Manager profile + reviews
      analytics.jsx         Chart.js analytics
      profile.jsx           Employee identity + data controls
    router.tsx              Router bootstrap
    server.ts / start.ts    TanStack Start entry
    styles.css              Design tokens, palettes, utilities
```

## Data model — single source of truth

Everything is stored in one `localStorage` envelope:

```
{ version, schema, data: BootXampData }
```

Where `BootXampData` contains: `sprint`, `weeks[]`, `employee`, `manager`, `analytics`, `operate`, `history`, `notifications`, `settings`, `imports[]`, `exports[]`, and `app` (currentWeekId / currentDayId / lastUpdated).

Never hardcode content — every screen renders from this model.

## Import types

The Import dialog auto-detects the shape and routes to the right applier. Try these from `docs/samples/`:

| File | Kind | Merges into |
| --- | --- | --- |
| `sprint.json` | `sprint` | Replaces sprint + weeks |
| `week.json` | `week` | Appends/replaces a week |
| `day.json` | `day` | Attaches a day to the active week |
| `review-daily.json` | `review` | Attaches a manager review to a day |
| `personal.json` | `personal` | Updates employee profile fields |

Import from **Profile → Import** or **Settings → Import**.

## Themes

- **Mode**: light / dark / system — toggled via `<html>.dark`
- **Palette**: `editorial` (default), `ocean`, `forest`, `sunset`, `violet`, `mono`, `neon`, `sepia` — applied via `[data-theme]`

Only the accent (and, for sepia, base surfaces) changes per palette; everything else derives from semantic tokens for guaranteed contrast.

## Avatars

DiceBear `adventurer` style with 12 curated persona seeds (Nova, Atlas, Juno, Orion, Vega, Luna, Kai, Iris, Rio, Zephyr, Sable, Wren). Choose from **Profile → Avatar**.

## PWA

Installable on iOS + Android via `public/manifest.webmanifest`. No offline caching — the manifest only enables Add-to-Home-Screen and standalone display.

## Accessibility & motion

- Global `:focus-visible` ring
- Scrollbars hidden but scroll works
- `prefers-reduced-motion` (OS) **and** in-app "Reduced motion" toggle both short-circuit every animation and transition via `[data-reduced-motion]` on `<html>`

## Reset

**Settings → Reset** exports a full JSON backup (when the "Auto-backup on reset" toggle is on), wipes storage, and reloads.
