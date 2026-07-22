# BootXamp 1.0 — Complete Implementation Plan

Build the entire Career Operating System in one implementation pass. JavaScript only. No sample data. Every page ships its final layout with editorial empty states until real JSON is imported. All business logic in the Domain layer. Single localStorage key `bootxamp`. GSAP for the four allowed motion cases only. Architecture optimized for years of maintenance — no duplicated logic, no coupled systems, no hardcoded values, no shortcuts.

## Stack (unchanged constraint)

The spec requires Next.js App Router; this Lovable project is TanStack Start (React + Vite + Tailwind v4). Lovable cannot scaffold Next.js here. I will build on TanStack Start with `.jsx` route files — same React, Tailwind, GSAP, Lucide, localStorage, JSON I/O; only the router differs. Stop me now if that's wrong.

## Architecture (strict, one-way, no coupling)

```
Data (localStorage envelope)
  ↓ services/       storage · import · export · analytics · backup
  ↓ domain/         xp · levels · ranks · streaks · promotions · reviews
  ↓ selectors.js    pure derivations
  ↓ hooks/          useBootxamp · useTheme · useImport · useExport · useAnalytics
  ↓ components/     presentation only
  ↓ routes/*.jsx    composition only
```

Rules enforced across the codebase:
- Components never compute XP, levels, ranks, streaks, promotions, or statistics.
- Domain is pure and framework-agnostic (no React imports).
- Selectors are pure reads (no mutation, no I/O).
- Services own persistence and I/O; nothing else touches `localStorage`.
- Hooks are the only bridge between React and the store.
- Constants centralize every magic string; config centralizes every tunable.

## Folder structure (exactly as specified)

```
src/
  components/{layout,navigation,dashboard,today,departments,profile,analytics,shared}/
  hooks/            useBootxamp.js  useTheme.js  useImport.js  useExport.js  useAnalytics.js
  lib/bootxamp/
    domain/         xp.js  levels.js  ranks.js  streaks.js  promotions.js  reviews.js
    services/       storage.service.js  import.service.js  export.service.js
                    analytics.service.js  backup.service.js
    selectors.js  schema.js  store.js  io.js
  constants/        departments.js  ranks.js  routes.js  themes.js  animations.js  limits.js
  config/           app.js  storage.js  routes.js  features.js
  utils/            dates.js  format.js  validation.js  storage.js  download.js  xp.js
  routes/           TanStack Start file routes (.jsx)
  styles.css
```

Routing constraint: TanStack Start reads routes from `src/routes/`. All other code lives in the tree above exactly.

## Data model

Root `BootXampData` matches the Data Model spec exactly: `app`, `employee`, `manager`, `sprint`, `weeks[] → days[] → departments[] → tasks[]`, `achievements[]`, `analytics`, `history { timeline[], activity[], promotions[], imports[], exports[] }`, `notifications[]`, `settings`, `ui`, `imports[]`, `exports[]`.

Every persistent object carries `id` (nanoid), `createdAt`, `updatedAt` (ISO), `metadata: {}`. All shapes documented via JSDoc `@typedef` in `lib/bootxamp/schema.js`.

**Envelope:** `{ version: 1, schema: 1, data: BootXampData }` under localStorage key `bootxamp`. First-load initializes an empty but structurally complete `BootXampData` — no fake content.

## Domain layer (pure, framework-agnostic)

- `xp.js` — XP awards (task, project, application, reading, exercise, consistency, weekly completion). All values in `constants/limits.js`.
- `levels.js` — XP → level curve, department-independent.
- `ranks.js` — seven tiers Apprentice → Junior → Software → Senior → Lead → Architect → Principal. Thresholds in `constants/ranks.js`. `getRank(xp)`, `getNextRank(xp)`, `getRankProgress(xp)`.
- `streaks.js` — daily / reading / exercise / applications / coding / overall. Broken streaks reduce bonus only, never subtract XP.
- `promotions.js` — detect promotion on XP change, append to `employee.promotionHistory` + timeline event `PROMOTION_EARNED`.
- `reviews.js` — review shape helpers, rating normalization, day-lock enforcement.

## Services layer

- `storage.service.js` — envelope read/write, cross-tab `storage` event, migration scaffold.
- `import.service.js` — Zod-validate sprint / week / day / review JSON → diff preview → merge → append `ImportRecord` + typed timeline event.
- `export.service.js` — daily / weekly / department / career serializers → append `ExportRecord` + timeline event.
- `analytics.service.js` — build datasets for the nine graph slots from `analytics` + `history`.
- `backup.service.js` — forced full-career download → wipe → reload for Reset. Honors `settings.exportBeforeReset`.

## Selectors (`lib/bootxamp/selectors.js`)

`getCurrentDay`, `getCurrentWeek`, `getDayProgress`, `getWeekProgress`, `getDepartmentXP`, `getDepartmentLevel`, `getOverallXP`, `getOverallRank`, `getRecentTimeline(limit=10)`, `getStreak(kind)`, `getEmployeeStats`, `getManagerBrief(day)`, `getDeptTasks(day, deptId)`, `getDayStatus(day)`, `getAnalyticsSeries(kind)`.

## Hooks

- `useBootxamp()` — `useSyncExternalStore` over the storage envelope; returns `{ data, mutate }`. `mutate(recipe)` produces an immutable draft, bumps `updatedAt`, persists, notifies.
- `useTheme()` — reads `settings.theme`, applies `.dark` on `<html>`, respects `prefers-color-scheme` on first load.
- `useImport()` — parse + validate + preview + apply.
- `useExport()` — Daily / Weekly / Department / Career.
- `useAnalytics()` — returns graph-ready datasets from `analytics.service`.

## Immutable timeline (typed events)

`history.timeline[]` is append-only. Every event: `{ id, type, title, description, timestamp, metadata }`. Types: `SPRINT_IMPORTED`, `WEEK_IMPORTED`, `DAY_IMPORTED`, `MISSION_STARTED`, `TASK_COMPLETED`, `DAY_SUBMITTED`, `REVIEW_SUBMITTED`, `PROMOTION_EARNED`, `EXPORT_CREATED`, `BACKUP_CREATED`, `APPLICATION_ADDED`, `COMMIT_ADDED`, `ACHIEVEMENT_UNLOCKED`. Nothing is ever mutated or deleted. Dashboard Recent Activity reads the last 10 items.

## Design system (`src/styles.css`, Tailwind v4)

- Radius max **6px**; `--radius: 6px`, smaller variants derived.
- **No shadows.** 1px hairline borders as separators.
- Neutral light + dark palettes, one restrained accent per theme, all as semantic tokens under `@theme inline`.
- Typography scale: very large display (72–120px) + small metadata (11–13px, uppercase, tracked). Single sans family via `<link>` in `__root.jsx` head — **Inter Tight** display + **Inter** body unless you name another.
- `.dark` on `<html>`; first-load respects `prefers-color-scheme`; Settings toggles.
- Zero hardcoded colors in components; only semantic tokens.

## Routing & layout

TanStack Start file routes (`.jsx`):

```
src/routes/
  __root.jsx    shell: theme, layout, <Outlet/>
  index.jsx     Dashboard
  today.jsx     Today
  learn.jsx     Learn
  build.jsx     Build
  grow.jsx      Grow
  career.jsx    Career
  profile.jsx   Profile
  analytics.jsx Analytics
```

Each route has its own `head()` with unique title + description.

Layout:
- **Desktop:** fixed left `AppSidebar` — logo, nav, Current Week, Current Day, XP, Current Rank, Theme Switch, Collapse. shadcn Sidebar `collapsible="icon"`. Active route via `useRouterState`.
- **Mobile:** `BottomNav` with all 8 destinations, icon + label, active state.
- Slim top bar carries `SidebarTrigger`.
- GSAP page transitions (fade + 4px rise); disabled under reduced motion.

## Pages — full final structure (not empty-state stubs)

Every page ships its complete section layout on day one; sections render "—" or scoped empty states until data exists.

### Dashboard — "Where am I?"
Hero: `Day X / 50` · `Week X / 7` · date · today's Theme · today's Mission · **Open Today's Work**. Weekly Progress ring with five department arcs. Today's Progress bars. Recent Activity (last 10 timeline events).

### Today — "What do I do now?"
Header: Theme · Mission · Manager Brief · Estimated Hours. Five collapsible department sections; task row: checkbox · estimated time · evidence link · status. Toggling a task calls `domain/xp.awardForTask`, updates streaks, appends `TASK_COMPLETED`. **Submit Day** → `reviews.finalizeDay()` → lock day (`submitted: true`, read-only forever) → `DAY_SUBMITTED` → `promotions.check()` → Promotion modal with GSAP reveal if promoted → carry-forward of incomplete tasks to next day.

### Learn — Department Dashboard
Overall Level · XP · Current Topic · Week Progress · Completed Days · Upcoming Days · History · Resources. Read-only.

### Build
Projects · Features · Commits · Project Completion · Milestones · Build XP · History.

### Grow
Reading · Writing · Communication · Social · Consistency · Distraction · Reading Streak · Writing Streak.

### Career
Resume · Portfolio · GitHub · Applications · Networking · Interview Practice · Leetcode · Career XP · Application History · Interview History.

### Profile — "Who am I becoming?"
Large avatar · Name · Position · XP · Overall Level · Department Levels · Current Streak · Longest Streak · Hours Worked · Projects · Applications · Commits. **Import** / **Export** / **Backup** / **Reset** wired end-to-end. **Settings** drawer trigger.

Settings drawer: Dark / Light · Accent · Animation Toggle · Reduced Motion · Reset · Export · Import · Version · Storage Usage. Avatar picker with preset avatars.

### Analytics — "What patterns exist?" — graphs only
Nine graph slots: XP · Hours · Sleep · Applications · Commits · Department Progress · Weekly Completion · Focus · Energy. Lightweight SVG graphs driven by `analytics.service` — no chart library. Each graph has an **Export PNG** button (SVG → canvas → PNG). "No analytics available." until data exists.

## Shared components (`components/shared/`)

`EmptyState`, `Metric`, `SectionHeader`, `ProgressRing`, `ProgressBar`, `Drawer`, `ThemeToggle`, `Badge`, `Button`, `TaskItem`, `DepartmentCard`, `MissionCard`, `StatCard`, `GraphCard`, `AvatarPicker`, `ImportDialog`, `ExportDialog`, `ReviewModal`, `PromotionModal`. Typography-only empty states. ProgressRing/Bar animate with GSAP on mount, render "—" when input is null.

## Import / Export / Reset

- **Import:** dropzone → detect kind → Zod validate → diff preview → Apply. Errors surfaced per field. Appends `ImportRecord` + timeline event.
- **Export:** Daily / Weekly / Department / Career. Appends `ExportRecord` + timeline event.
- **Reset:** confirmation → forced full-career backup download → wipe `bootxamp` → reload.

**No sample files.** App opens empty until real JSON is imported.

## Motion (GSAP only, four cases)

Page transitions · drawer animations · progress animations · promotion animations. Everything else is immediate. `settings.reducedMotion` and `prefers-reduced-motion` disable motion globally.

## Notifications & Achievements

`notifications[]` items surface via a bell trigger in the top bar; mark-read + clear-all supported. `achievements[]` unlocked by domain rules (first task, first day submitted, first week completed, first promotion, streak milestones). Unlocks append `ACHIEVEMENT_UNLOCKED` + push a notification.

## Technical notes

- **JavaScript only.** All files `.js` / `.jsx`. JSDoc `@typedef` in `schema.js` for editor intellisense. `tsconfig.json` gets `allowJs: true, checkJs: false`. Existing `.ts`/`.tsx` template files converted to `.jsx` where the app touches them.
- **TanStack Start** routes only under `src/routes/`. `createFileRoute("/path")` strings match filenames exactly.
- **Storage envelope:** `{ version: 1, schema: 1, data }` under key `bootxamp`. Future migrations add a `migrate(fromSchema)` step in `storage.service.js`.
- **Backend later:** swap `storage.service.js` for an async client with the same signature; everything else untouched.
- **Validation:** Zod for import shapes; also runs on stored envelope load to catch corruption.
- **Styling:** Tailwind v4, `@theme inline` tokens. Fonts via `<link>` in `__root.jsx` head — never `@import` remote URL in `styles.css`.
- **Icons:** Lucide, `strokeWidth={1.5}`, single size scale.

## Deliverable

At the end of the build:
- 8 routes with final layouts and editorial empty states.
- Full data model + Zod validators.
- Domain layer for XP, levels, ranks, streaks, promotions, reviews.
- Services for storage, import, export, analytics, backup.
- Import / Export / Reset flows wired.
- Today task interaction → Submit Day → lock → promotion check → carry-forward.
- Analytics graphs + PNG export.
- Notifications + achievements.
- Light / dark theme with editorial brutalist design language.
- GSAP motion in the four allowed cases only.
- Zero fake data anywhere.

Approve to build.