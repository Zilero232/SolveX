# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep it short, link out for details.

## What this is

Chatovo — real-time voice rooms (web + desktop). Bun-workspaces monorepo.

- **Web client**: Next.js 16 / React 19 (`apps/client/`)
- **Desktop**: Tauri 2 (Rust) wraps the same client (`apps/tauri/`)
- **API**: Hono on Bun + Prisma + Supabase (`apps/server/`)
- **Realtime media**: LiveKit SFU (WebRTC), server-issued JWTs
- **Shared types**: Zod schemas in `packages/schemas/` (workspace dep `@chatovo/schemas`)

## Layout

```
apps/
├── client/          # Next.js — FSD architecture
├── server/          # Hono API (routes/, middleware/, lib/)
└── tauri/           # Rust shell (src/), capabilities/, tauri.conf.json
packages/schemas/    # Zod schemas, imported by both client and server
docs/
├── fsd.md           # Frontend architecture — read before structural changes
└── style.md         # Code style, import order, naming
infra/               # Caddy + LiveKit configs
```

## Frontend architecture (apps/client)

**Feature-Sliced Design** with two local tweaks:

1. `pages/` layer renamed to `views/` (collision with Next.js Pages Router avoided).
2. Slices grouped by **business domain** inside `features/`, `entities/`, `widgets/`:
   - `auth/` — sign-in, sign-up, google, user
   - `room/` — rooms, voice, chat, presence
   - `app/` — release, locale, system-tray, shortcuts, check-app-update, download-app
   - `layout/` (widgets only) — root shell

**Import alias**: `@/*` → `apps/client/*`.

**Public API**: import to the slice level, not the domain group:
- ✓ `@/features/auth/sign-in`
- ✓ `@/entities/room/room`
- ✗ `@/features/auth` (group folder is not a barrel)
- ✗ `@/features/auth/sign-in/ui/SignInForm` (deep import bypasses slice barrel)

**Layer hierarchy** (import direction, top → bottom):
`app → views → widgets → features → entities → shared`

Never import upward or sideways within the same layer. Cross-entity refs use `@x` pattern.

Full rules in [docs/fsd.md](docs/fsd.md).

## Code style essentials

Full guide in [docs/style.md](docs/style.md). Highlights:

- **Files**: kebab-case for slices/segments. PascalCase for component folders/files (`VoiceRoom/VoiceRoom.tsx`). camelCase for hooks/utils.
- **Component slice layout**: `ui/`, `model/`, `lib/`, `api/`, `config/`. Custom segments OK if named by purpose.
- **Styles**: separate `*.styles.ts` file exporting `xxxStyles` const, imported `as s`.
- **Types**: `*.types.ts` next to component or `model/types.ts` for shared.
- **Imports** sorted by biome (groups: external value, local value, styles, types). Run `bun lint:fix` to apply.
- **i18n**: all user-facing strings via `useTranslations('namespace')` from `next-intl`. Keys live in `messages.d.ts` + JSON locale files.
- **shadcn**: components live in `shared/ui/` (per `components.json`). `style: new-york`, `baseColor: neutral`, `iconLibrary: lucide`.

## Reuse over reinvention

**Rule**: before writing a helper / hook / util by hand, check if the installed libs already have it. Hand-rolled code only when nothing fits. This avoids duplicating bug-fixed, tested logic and keeps bundle predictable.

**Checklist before writing custom code:**

1. Generic React hooks (debounce, throttle, copy, mount, idle, intersection, media query, local storage, event listener, click outside, hover, boolean toggle, previous, timeout, interval, etc.) → check **`@siberiacancode/reactuse`** first. It's already a dep. Examples: `useBoolean`, `useCounter`, `useDebounceValue`, `useEventListener`, `useClickOutside`, `useLocalStorage`, `useMediaQuery`, `createContextHook`.
2. Array / object / data manipulation (groupBy, sortBy, pick, omit, partition, unique, mapValues, entries, isNullish, etc.) → use **`remeda`**. Already imported across the codebase.
3. Conditional rendering / pattern matching / discriminated unions → use **`ts-pattern`** (`match`, `.with`, `.exhaustive`, `P.*` patterns). No hand-rolled if/else ladders for typed branching.
4. Form state + validation → **`react-hook-form`** + **`@hookform/resolvers/zod`** + Zod schemas from `@chatovo/schemas`. No useState-driven forms.
5. Server state, caching, mutations, query keys → **`@tanstack/react-query`** (`useQuery`, `useMutation`, `QueryClient`). All query keys live in `shared/constants/query-keys.ts`. No `useEffect + fetch` patterns.
6. Date / time → **`date-fns`** (already in deps). No `Date` arithmetic by hand.
7. Class composition → **`clsx`** + **`class-variance-authority`** (cva). No string concatenation.
8. Validation schemas → **Zod 4** via `@chatovo/schemas`. Schema is source of truth, infer types with `z.infer`.
9. UI primitives (dialog, dropdown, tooltip, popover, slot, select, tabs, switch, etc.) → **Radix UI** primitives wrapped via shadcn in `shared/ui/`. Never reimplement accessibility / focus trap / aria from scratch.
10. Icons → **`lucide-react`**. No custom SVG inline unless brand-specific.
11. Toasts → **`sonner`** (`toast.success` / `toast.error`). No custom notification system.
12. LiveKit room state, participants, tracks, chat → **`@livekit/components-react`** hooks (`useChat`, `useParticipants`, `useTracks`, `useConnectionState`). No raw `Room` event listeners unless the hook genuinely doesn't cover it.
13. Tauri APIs (window, fs, deep-link, updater, global-shortcut, opener, os, process) → **`@tauri-apps/api`** + plugin packages. Always gate with `isTauri()`.
14. Internationalization → **`next-intl`** (`useTranslations`, `useFormatter`, `useLocale`). No string maps.

**When to roll your own:**

- Project-specific glue that no lib reasonably covers.
- Domain logic (`entities/`, `features/` business rules).
- Thin wrappers over lib APIs to enforce project conventions (e.g. a typed `useEventListener` for a specific custom event name).
- Lib has a real gotcha that hurts the call site. Document known ones:
  - `useBoolean` from `@siberiacancode/reactuse` returns a **new toggle function every render** — using it as a setter inside `useEffect` deps triggers `useExhaustiveDeps` warnings and re-runs the effect on each render. Use plain `useState(false)` when the setter is passed into effects, callbacks, or refs. `useBoolean` is fine for inline `<button onClick={() => toggle()}>`.
  - `useEventListener` from reactuse types `event` as `keyof WindowEventMap` — custom event names need a cast or module augmentation. For one-off custom events, plain `addEventListener` + cleanup is shorter.
  - `Intl.NumberFormat` with `style: 'unit', unit: 'byte', notation: 'compact'` produces inconsistent output (`1.5kB` vs `1.5K B`) across `unitDisplay` values. Hand-rolled byte formatter is fine.

**Process when adding a feature:**

1. Identify what category the new code falls into (state, side-effect, data, UI primitive, validation, ...).
2. Search the existing dep tree (`package.json` + `bun.lock`) for a fitting helper.
3. If nothing fits — check whether a lib **already used elsewhere in the codebase** has it (grep for similar patterns).
4. Only then write custom — and put it in `shared/lib/` or `shared/hooks/` if reusable, otherwise in the slice's `lib/` segment.

## Common commands

```bash
# Root
bun dev                    # client + server in parallel
bun dev:client             # client only
bun dev:server             # server only
bun dev:livekit            # local SFU + Caddy via docker
bun dev:full               # docker + bun dev
bun lint                   # biome check
bun lint:fix               # biome check --write
bun build                  # server + client production build

# Tauri (desktop)
bun tauri:dev              # run Tauri dev shell
bun tauri:build            # produce native binary

# Server / Prisma (run from apps/server/)
bun db:push                # push schema without migration
bun db:migrate             # create + apply migration
bun db:deploy              # apply pending migrations (prod)
bun db:studio              # Prisma Studio GUI

# Typecheck (no script — run directly)
cd apps/client && bun x tsc --noEmit
```

## Workflow

- **Type checking**: there's no `typecheck` script. Run `bun x tsc --noEmit` from `apps/client/` (or relevant workspace).
- **Lint**: `bun lint:fix` runs Biome; it also sorts imports and exports automatically. Don't fight its output.
- **Tests**: none currently. Don't fabricate test commands.
- **Commits**: Conventional Commits style (see git log).
- **Branches**: feature branches off `master`. PRs target `master`.

## Tauri specifics

- The Tauri shell loads the Next.js client at `apps/tauri/tauri.conf.json` → `frontendDist`.
- Desktop-only features (system tray, global shortcuts, deep links, updater) live in `apps/client/features/app/`. They use `@tauri-apps/api` + plugins and must gate runtime detection with `isTauri()` before calling Tauri APIs.
- Web build must work without Tauri — `isTauri()` returns false in the browser.

## Things to avoid

- **Don't add `'use client'` to `app/**/page.tsx` or `layout.tsx`** — keep route files server-side, delegate UI to `views/`.
- **Don't deep-import past slice barrel** — always import from `@/<layer>/<domain>/<slice>` (or `@/shared/ui/<primitive>` as the documented exception).
- **Don't put business logic in `shared/`** — `shared/` is project-agnostic. Business-domain hooks/types belong in `features/` or `entities/`.
- **Don't bundle Tauri APIs unconditionally** — gate with `isTauri()` to keep the web build working.
- **Don't edit `messages.d.ts` directly** — it's generated from locale JSON.
- **No emojis in code** unless explicitly requested.
