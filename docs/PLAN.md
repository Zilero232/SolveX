# План: SolveX — Voice/Video Chat на Tauri

## Context

Пользователь начинает разрабатывать Discord-подобное приложение: голосовые/видео комнаты, текстовые чаты, файлошеринг. Уже создан базовый скаффолд Tauri 2 + React 19 + Vite + Bun (`d:\Project\personal\solvex`). На данный момент в проекте только дефолтная команда `greet` в `src-tauri/src/lib.rs` и пустой компонент `src/App.tsx`. Этот документ — одновременно (а) обзорный гайд по Tauri и экосистеме, который запросил пользователь, и (б) конкретный план первой фазы реализации.

Выбранный стек (подтверждено пользователем):

- **Media:** LiveKit (open-source SFU, self-host или cloud)
- **Backend:** Supabase (Postgres + Realtime + Auth + Storage) — auth подключается уже в MVP
- **Платформа:** desktop сначала (Windows/macOS/Linux), mobile отложен
- **State:** Zustand + TanStack Query
- **UI:** shadcn/ui + Tailwind + @siberiacancode/reactuse (подтверждено в запросе)

---

## 0. MVP-скоуп (что в первой работающей сборке)

**Цель MVP:** логин → лобби → если admin, создаём комнату → второй залогиненный клиент заходит в ту же комнату → слышим/видим друг друга → расшариваем окно. Всё. Никакого чата, истории, профилей-карточек, друзей, серверов, mobile.

### Что входит

- **Auth (Supabase):** вход/выход через email+password (магник-линк опционально). Сессия живёт в `localStorage`, refresh-token автоматически. Логаут — кнопка в топбаре.
- **Роли:** admin / user. Определяется по `auth.users.app_metadata.role === 'admin'` в Supabase (выставляется руками в Supabase Studio либо SQL: `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where email = '...';`). НЕ через user_metadata — ту правит сам юзер, app_metadata только сервер. Для UI флаг прокидывается из JWT в Zustand-store.
- **Комнаты:** ephemeral, живут пока есть участники, имя свободного формата. В MVP не хранятся в БД — список активных комнат admin держит у себя на экране, шарит имя комнаты текстом. (Позже в Фазе 2 — таблица `rooms` в Postgres.)
- **Создание комнаты:** кнопка "Create Room" видна только admin'у, открывает форму "имя комнаты" → клиент идёт на token-сервер с Supabase access-token-ом → сервер проверяет роль → выдаёт LiveKit JWT с `roomCreate`, `roomAdmin`. Первый коннект создаёт комнату на LiveKit SFU.
- **Вход в комнату:** любой залогиненный юзер вводит имя комнаты → token-сервер выдаёт LiveKit JWT с `canPublish`, `canSubscribe` (без admin-прав).
- **Шеринг:** микрофон (audio), камера (video), окно/экран (screen share). Toggle для каждого.
- **Контролы:** mute mic, mute cam, toggle screen-share, leave room, список участников с индикаторами speaking/muted.
- **Token-сервер:** локальный `server/index.ts` на **Hono + Bun** (~60 строк, отдельный `server/package.json` с deps `hono`, `livekit-server-sdk`, `@supabase/supabase-js`, devDep `@types/bun`). Эндпоинт `POST /token`: проверяет Supabase JWT через `supabase.auth.getUser(token)` (admin-клиент с `SUPABASE_SERVICE_ROLE_KEY`), читает `app_metadata.role`, подписывает LiveKit JWT через `livekit-server-sdk`. Hono обеспечивает routing, CORS, JSON-helpers, type-safe handlers. Запускается параллельно с Tauri dev. На production — деплой на Cloudflare Workers (`wrangler deploy`, Hono работает out-of-the-box) или Bun на Render/Fly/Railway.
- **LiveKit:** [LiveKit Cloud](https://livekit.io) free tier (100 одновременных коннектов, 5 ГБ трафика/мес). Self-host через Docker — опция на потом.
- **Supabase:** managed cloud (бесплатный tier). Локальный `supabase start` — на потом.

### Что НЕ входит в MVP (явно отложено)

- Текстовый чат и история сообщений.
- OAuth-провайдеры (Google/GitHub) — только email+password.
- Профили (avatar, bio), друзья, серверы как у Discord.
- Постоянные комнаты в БД, инвайт-ссылки с подписанным токеном, ACL по участникам.
- Push-to-talk, system tray, deep-link, auto-update.
- Запись звонков, transcription, AI-features.
- Mobile.

### Архитектура MVP

```text
[Tauri app: AuthPage → LobbyPage → RoomPage]
   │
   │  1) signIn(email, password)
   ▼
[Supabase Auth] ──► access_token (JWT) + role в app_metadata
   │
   │  2) POST /token { room, supabase_access_token }
   ▼
[Hono + Bun token-server (localhost:3000)]
   │  - Hono routes + CORS middleware
   │  - проверяет Supabase JWT (admin SDK)
   │  - читает app_metadata.role
   │  - подписывает LiveKit JWT через livekit-server-sdk
   │      admin → roomCreate, roomAdmin, canPublish, canSubscribe
   │      user  → canPublish, canSubscribe
   ▼  LiveKit JWT
[LiveKit Cloud] ←──── WebRTC (audio/video/screen tracks) ────→ [второй клиент]
```

### MVP-файлы (поверх FSD-скаффолда из Фазы 0)

**Монорепа (Bun Workspaces, apps/ + packages/ convention):**

```
solvex/
├── apps/
│   ├── client/                       # @solvex/client (Vite + React, web bundle)
│   │   ├── src/                      # FSD-структура (app, pages, widgets, features, entities, shared)
│   │   ├── public/, index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json             # paths: { "@/*": ["./src/*"] }
│   │   ├── components.json           # shadcn config
│   │   ├── steiger.config.ts         # FSD-границы
│   │   ├── .env                      # client-only (VITE_*)
│   │   └── package.json              # name: "@solvex/client"
│   ├── desktop/                      # @solvex/desktop (Tauri Rust shell)
│   │   ├── src/                      # main.rs, lib.rs
│   │   ├── Cargo.toml, Cargo.lock, build.rs
│   │   ├── capabilities/             # Tauri 2 permissions
│   │   ├── icons/                    # bundle icons
│   │   ├── gen/, target/             # auto-generated / build artifacts (gitignored)
│   │   ├── tauri.conf.json           # frontendDist: ../client/dist, beforeDevCommand: bun --filter @solvex/client dev
│   │   └── package.json              # name: "@solvex/desktop", devDep: @tauri-apps/cli
│   └── server/                       # @solvex/server (Hono + Bun)
│       ├── src/
│       │   ├── index.ts, app.ts, env.ts
│       │   ├── middleware/auth.ts
│       │   ├── routes/{health,livekit-token}.ts
│       │   └── services/{supabase,livekit}.ts
│       ├── .env                      # server secrets
│       ├── tsconfig.json             # paths: { "@/*": ["./src/*"] }, types: ["bun"]
│       └── package.json              # name: "@solvex/server"
├── packages/
│   └── shared/                       # @solvex/shared (zod-схемы + типы)
│       ├── src/
│       │   ├── livekit.ts            # tokenRequestSchema, tokenResponseSchema
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json              # exports: { ".": "./src/index.ts" }
├── biome.json                        # root, scans apps/ + packages/
├── package.json                      # workspace root, scripts через bun --filter
├── bun.lock                          # один lockfile на всю монорепу
├── docs/
└── README.md
```

**Workspace-структура:**
- `apps/` = deployable apps (client, server). Каждый со своим `package.json`, `.env`, конфигами.
- `packages/` = shared libraries. Symlinkятся в `node_modules/@solvex/` в каждом workspace.
- Root `package.json` — pure workspace root. Только `workspaces: ["apps/*", "packages/*"]` + dev-deps (biome, steiger-plugin) + scripts-делегаторы через `bun --filter <name> <task>`.

**Bun-symlinks:** `apps/client/node_modules/@solvex/shared` → `packages/shared/`. Импорт `import { tokenRequestSchema } from '@solvex/shared'` работает одинаково в client и server. Один источник правды для типов LiveKit-эндпоинта.

**Root-скрипты (делегируют через filter):**

```
bun run dev            # → bun --filter @solvex/client dev    (только vite, без Tauri)
bun run server         # → bun --filter @solvex/server dev    (hono + bun --watch)
bun run tauri          # → bun --filter @solvex/desktop tauri (CLI passthrough)
bun run desktop        # → bun --filter @solvex/desktop dev   (tauri dev: окно + vite + рестарт Rust)
bun run desktop:build  # → bun --filter @solvex/desktop build (релиз-bundle: MSI/DMG/AppImage)
bun run lint           # biome check ./apps ./packages
bun run fsd            # steiger через filter в client
```

**Запуск приложения (MVP):**

```powershell
# Терминал 1 — token-server (Hono + Bun)
bun run server

# Терминал 2 — Tauri desktop (стартует Vite через beforeDevCommand + открывает окно)
bun run desktop
```

**Token-сервер (Hono + Bun, layered structure):**

```
server/
├── src/
│   ├── index.ts                # bootstrap, экспорт { fetch, port } для Bun.serve
│   ├── app.ts                  # Hono-app: logger, cors, route mounting
│   ├── env.ts                  # zod-валидация Bun.env → typed `env`
│   ├── middleware/
│   │   └── auth.ts             # requireSupabaseUser — Bearer JWT через supabase.auth.getUser
│   ├── routes/
│   │   ├── health.ts           # GET / → { ok: true }
│   │   └── livekit-token.ts    # POST / → выдаёт LiveKit JWT, zValidator на body
│   └── services/
│       ├── supabase.ts         # admin-клиент singleton (service-role-key)
│       └── livekit.ts          # issueLiveKitToken({ room, identity, name, role })
├── .env                        # серверные секреты (gitignored)
├── .env.example
├── package.json                # изолированные deps: hono, @hono/zod-validator, livekit-server-sdk, @supabase/supabase-js, zod
└── tsconfig.json               # types: ["bun"], paths: { "@/*": ["./src/*"] }
```

**Стандарты:**
- Слоистая архитектура: `routes → services → env`. Сторонние SDK инкапсулированы в `services/`.
- Middleware с типизацией `Variables` (hono `createMiddleware<{ Variables }>`) — `c.get('user')` type-safe.
- Валидация input через `@hono/zod-validator` (`zValidator('json', schema)`) — невалидное тело автоматом → 422.
- Все ошибки через `HTTPException` (hono) — единый формат, авто-статусы.
- Env через zod-schema (как на фронте) — крашится на старте при невалидной конфигурации.
- `hono/logger` middleware — request-логи в stdout.
- `hono/cors` middleware — origin из env.

**Env-сплит:**
- `.env` в корне — только `VITE_*` (Vite автозагружает из cwd при `bun run tauri dev`).
- `server/.env` — только серверные секреты, никаких `VITE_*`. Загружается через `bun --env-file=./.env` при запуске из `server/` cwd.
- Оба файла в `.gitignore`. Шаблоны: `.env.example` и `server/.env.example`.

**Frontend (FSD):**

- `src/shared/api/supabase.ts` — singleton Supabase client.
- `src/shared/api/livekit.ts` — `fetchLiveKitToken({ room, supabaseToken })` → строка JWT.
- `src/shared/config/env.ts` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_TOKEN_SERVER_URL`, `VITE_LIVEKIT_URL`.
- `src/entities/user/model/use-user.ts` — хук `useCurrentUser()`: возвращает `{ user, role, isAdmin, ... }`; внутри `useSession` (TanStack Query кэш сессии Supabase).
- `src/entities/user/model/auth-bridge.ts` — `subscribeAuth(queryClient)`: одна app-wide подписка на `supabase.auth.onAuthStateChange`, пишет сессию в кэш.
- `src/entities/voice-participant/ui/ParticipantTile.tsx` — карточка участника с видео + индикатор speaking.
- `src/features/auth-by-email/` — форма login/signup, кнопки sign-in/sign-up, обработка ошибок.
- `src/features/logout/` — кнопка в топбаре, `supabase.auth.signOut()` + редирект на /auth.
- `src/features/create-room/` — admin-only форма "имя комнаты" → fetchToken → router.navigate(`/room/$name`).
- `src/features/join-room/` — форма "имя комнаты" → fetchToken → router.navigate.
- `src/features/mute-toggle/` — кнопка mic on/off (через `useLocalParticipant().setMicrophoneEnabled`).
- `src/features/toggle-camera/` — кнопка cam on/off.
- `src/features/share-screen/` — toggle screen-share.
- `src/features/leave-room/` — disconnect + редирект.
- `src/widgets/voice-room/` — обёртка `<LiveKitRoom>` + `<RoomAudioRenderer>` + grid из ParticipantTile + ControlBar.
- `src/widgets/topbar/` — текущий nickname/email + Logout + admin-бейдж.
- `src/pages/auth/` — `/auth` — рендерит `<AuthByEmailForm>`.
- `src/pages/lobby/` — `/` (или `/lobby`) — топбар + JoinRoomForm + (если admin) CreateRoomForm.
- `src/pages/room/` — `/room/$name` — топбар + voice-room widget.

**Route guards:**

- `src/app/router/route-tree.ts` — `beforeLoad` на `/lobby` и `/room/$name` проверяет наличие сессии в auth-store; если нет — редирект на `/auth`.

### MVP-команды для dev

```powershell
# Терминал 1: token-server (требует .env с LiveKit + Supabase ключами)
bun run server

# Терминал 2: Tauri app
bun run tauri dev
```

В корневом `package.json` scripts: `"server": "cd server && bun --watch --env-file=./.env src/index.ts"`.

### MVP-настройка (одноразово)

1. Supabase: создать проект, в Auth → Providers включить Email. Скопировать `URL`, `anon key`, `service_role key`.
2. Создать первого admin-юзера через signUp в приложении, затем в Supabase Studio (или SQL):

   ```sql
   update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
   where email = 'admin@example.com';
   ```

3. LiveKit Cloud: создать проект, скопировать API key, API secret, URL.
4. Заполнить единый `.env` в корне проекта (по шаблону `.env.example`) — там и Vite-переменные с префиксом `VITE_`, и серверные ключи без префикса.

### MVP verification

1. Запускаем token-server и Tauri app.
2. Окно 1: signUp → подтверждаем email (или отключаем email confirm в Supabase для dev) → попадаем в /lobby. БД пометить как admin через SQL → перелогин → видим кнопку "Create Room".
3. Создаём комнату "test" → попадаем в /room/test, видим себя в гриде.
4. Окно 2 (другая машина либо второй экземпляр на другом порту): signUp как обычный юзер → /lobby → Join "test" → подключается, оба видят друг друга в гриде.
5. Mic toggle: размучиваемся, говорим — speaking-индикатор на обеих сторонах.
6. Cam toggle: включаем камеру — видео-стрим виден у другой стороны.
7. Share screen: расшариваем окно — другая сторона видит экран как отдельный трек.
8. Leave Room: один уходит, второй получает событие `ParticipantDisconnected`, плитка пропадает.
9. Logout: сессия чистится, при попытке зайти на /lobby редирект на /auth.

После прохождения чек-листа MVP считается готовым, можно стартовать следующую фазу (профили/чат/persistent rooms).

---

## 1. Tauri — что это и из чего состоит

### Архитектура

Tauri = тонкая обёртка над системным WebView (WebView2 на Windows, WKWebView на macOS, WebKitGTK на Linux). Фронт — обычный web (HTML/CSS/JS), backend-сторона приложения — Rust-процесс, который общается с фронтом через IPC. Bundle получается на порядок меньше Electron (~3-10 МБ против 100+ МБ), потому что движок рендеринга не везётся внутри приложения.

Два процесса:

- **Core (Rust)** — `src-tauri/`. Создаёт окна, владеет state, имеет полный доступ к ОС, экспортирует команды.
- **WebView (JS/TS)** — `src/`. UI-слой. Вызывает Rust через `invoke()`, слушает события через `listen()`.

### Ключевые крейты Rust-стороны

| Крейт | Назначение |
| --- | --- |
| `tauri` | ядро: окна, IPC, события, system tray, меню |
| `tauri-build` | build-script, генерирует контекст из `tauri.conf.json` |
| `tao` | кросс-платформенное окно (форк winit) |
| `wry` | абстракция над системным WebView |
| `serde` / `serde_json` | сериализация IPC payload-ов |

### Официальные плагины Tauri 2

Каждый плагин = пара (Rust crate + npm пакет). Подключается через `Builder::plugin(...)` и `import` на фронте. Релевантные для voice chat:

- `tauri-plugin-opener` — открыть URL/файл в системе (уже подключён)
- `tauri-plugin-shell` — запуск внешних процессов
- `tauri-plugin-fs` — работа с ФС из фронта (с разрешениями)
- `tauri-plugin-dialog` — нативные диалоги выбора файлов (для шеринга файлов в чате)
- `tauri-plugin-notification` — системные уведомления (новое сообщение, входящий звонок)
- `tauri-plugin-store` — KV-хранилище для настроек
- `tauri-plugin-sql` — локальная SQLite (для оффлайн-кэша чата)
- `tauri-plugin-window-state` — запоминать размер/позицию окна
- `tauri-plugin-os` — инфа об ОС
- `tauri-plugin-process` — рестарт/выход
- `tauri-plugin-updater` — auto-update (обязательно для production)
- `tauri-plugin-single-instance` — не давать запустить второй экземпляр (важно для chat: не нужны два окна на одного юзера)
- `tauri-plugin-deep-link` — открытие приложения по `solvex://room/abc` (приглашения в комнату)
- `tauri-plugin-autostart` — запуск при логине системы
- `tauri-plugin-global-shortcut` — глобальные хоткеи (push-to-talk!)
- `tauri-plugin-positioner` — расположение окон (мини-плеер для звонка)
- `tauri-plugin-log` — структурное логирование с ротацией
- `tauri-plugin-http` — HTTP-клиент с обходом CORS (полезно для REST-вызовов к LiveKit/Supabase из Rust)
- `tauri-plugin-clipboard-manager` — буфер обмена
- `tauri-plugin-biometric` — Touch ID / Windows Hello (mobile, опционально)

Community-плагины ставятся как обычные crate-ы.

### Permission model (Tauri 2)

В Tauri 2 безопасность строится на **capabilities** в `src-tauri/capabilities/*.json`. Каждое окно получает набор разрешений вида `core:webview:allow-create-webview`, `fs:allow-read-text-file`, `shell:allow-open`. Без явного разрешения IPC-вызов плагина из фронта будет отклонён. Это правильное место для аудита: каждое новое API → запись в capability.

### CLI и сборка

- `cargo tauri dev` (или `bun run tauri dev`) — параллельно стартует Vite-фронт и cargo watch для Rust.
- `cargo tauri build` — релизная сборка + bundling (MSI/NSIS на Windows, DMG на macOS, AppImage/deb/rpm на Linux).
- `cargo tauri signer` — подпись апдейтов.
- `cargo tauri icon path/to/source.png` — генерация всех иконок.
- `cargo tauri add <plugin>` — установка плагина (правит Cargo.toml + package.json одной командой).

### Что нужно установить локально (Windows)

- **Rust toolchain** (stable, msvc target): `rustup install stable-x86_64-pc-windows-msvc`
- **Microsoft C++ Build Tools** (есть в Visual Studio Installer → "Desktop development with C++")
- **WebView2 Runtime** — на Win11 уже стоит, на Win10 надо ставить вручную (Evergreen Bootstrapper)
- **Node 18+** или **Bun** (уже используешь Bun, судя по `tauri.conf.json`)
- **cargo-tauri CLI** (опционально, можно через `bun run tauri`): `cargo install tauri-cli --version "^2"`

Проверка: `rustc --version && bun --version && bun run tauri info`.

---

## 2. Стек фронтенда

### Базовый набор (текущий)

- React 19 + TypeScript + Vite — уже стоит, оставляем.

### UI-слой

- **Tailwind CSS v4** — utility-CSS. v4 ставится одним пакетом `@tailwindcss/vite` без `tailwind.config.js`.
- **shadcn/ui** — копируемые компоненты на Radix UI + Tailwind. CLI: `bunx shadcn@latest init`, потом `bunx shadcn@latest add button dialog dropdown-menu`. Компоненты ложатся в `src/shared/ui/` (см. FSD-структуру ниже).
- **Radix UI** — primitives (Dialog, DropdownMenu, Toast) — приходят транзитивно через shadcn.
- **lucide-react** — иконки (стандарт для shadcn).
- **class-variance-authority + tailwind-merge + clsx** — варианты компонентов (тоже из shadcn).

### Состояние и данные

- **Zustand** — UI-state, peer connections, mute/deafen, активная комната.
- **TanStack Query v5** — серверные данные (history, profile, friend list). Кэширование, infinite scroll для истории чата.
- **@siberiacancode/reactuse** — набор хуков (useDebounce, useMedia, usePrevious, useInterval, useCopyToClipboard и др.). Свежая активно развиваемая либа от siberiacancode, легче по бандлу чем `react-use`, tree-shakable, типизация на уровне.

### Роутинг

- **TanStack Router** или **React Router v7**. TanStack Router предпочтительнее для type-safe маршрутов и интеграции с TanStack Query.

### Формы и валидация

- **react-hook-form** + **zod** + **@hookform/resolvers** — стандарт. Те же схемы zod переиспользуются для валидации IPC payload-ов.

### Realtime / Media

- **`@livekit/components-react`** + **`livekit-client`** — готовые React-компоненты для voice/video комнат (RoomAudioRenderer, ParticipantTile, GridLayout).
- **`@supabase/supabase-js`** — клиент Supabase для auth + realtime + postgres.

### Утилиты

- **date-fns** — даты в чате.
- **react-virtuoso** — виртуализация длинного списка сообщений.
- **emoji-picker-react** — пикер эмодзи.
- **react-markdown** + **remark-gfm** — рендер markdown в сообщениях.
- **dompurify** — санитизация HTML, если разрешишь rich-text.

### Опционально

- **i18next** + **react-i18next** — локализация.
- **sonner** — тосты (есть в shadcn).
- **cmdk** — command palette (есть в shadcn).
- **framer-motion** — анимации переходов и звонков.

---

## 3. Стек бэкенда

### Supabase (managed либо self-host через Docker)

- **Auth** — email/password, OAuth (Google, GitHub, Discord), magic link.
- **Postgres** + **Row Level Security** — таблицы: `profiles`, `servers`, `channels`, `messages`, `memberships`, `room_invites`.
- **Realtime** — Postgres CDC через WebSocket. Подписка на новые сообщения, presence канал (онлайн/офлайн, активная комната), broadcast (typing-indicator).
- **Storage** — аватарки, вложения в чат (с S3-совместимым API).
- **Edge Functions** — генерация LiveKit access token-ов (нельзя выдавать API secret клиенту).

### LiveKit

- **livekit-server** — SFU. Self-host: `docker run livekit/livekit-server`. Cloud: livekit.io.
- **Access token** генерится на бэке (Supabase Edge Function) на основе авторизованного юзера и room name. Клиент получает JWT и подключается по WebSocket.
- **livekit-client** на фронте: подключение, publish/subscribe треков, screen share.
- **Egress** (опционально) — запись звонков на S3.

### Архитектура потоков данных

```text
[Tauri WebView (React)]
   │
   ├── @supabase/supabase-js ──→ Supabase (auth, chat realtime, presence)
   │
   ├── @livekit/components-react ──→ LiveKit SFU (media tracks)
   │
   └── @tauri-apps/api `invoke` ──→ [Rust core]
                                     ├── tauri-plugin-store (settings)
                                     ├── tauri-plugin-sql (offline chat cache)
                                     ├── tauri-plugin-global-shortcut (PTT)
                                     ├── tauri-plugin-notification (in-app push)
                                     └── tauri-plugin-deep-link (solvex:// links)
```

Никакого собственного бэкенд-сервера на старте — Supabase Edge Function закрывает один кейс генерации LiveKit-токена.

---

## 4. Tauri плагины конкретно для этого приложения

Минимальный набор для MVP:

```bash
cargo tauri add global-shortcut    # push-to-talk
cargo tauri add notification       # уведомления о сообщениях / входящем звонке
cargo tauri add deep-link          # solvex://invite/<token>
cargo tauri add single-instance    # один экземпляр на юзера
cargo tauri add window-state       # запоминание размера окна
cargo tauri add store              # JSON-настройки (output device, gain, theme)
cargo tauri add sql                # SQLite офлайн-кэш сообщений (sqlx)
cargo tauri add log                # ротация логов
cargo tauri add updater            # auto-update (нужна подпись)
cargo tauri add autostart          # запуск при логине (опционально)
```

`shell`, `dialog`, `fs`, `http`, `clipboard-manager` — добавлять по мере появления конкретных юзкейсов, не заранее.

---

## 5. Архитектура и правила кода

### Feature-Sliced Design (FSD)

Фронт строится по **FSD** — слоистая архитектура с однонаправленным графом импортов. Импорт разрешён только **вниз** по иерархии слоёв; cross-import внутри одного слоя между слайсами запрещён (общее — только через `shared` или через подъём в `widgets`).

Слои сверху вниз:

| Слой | Содержит | Примеры |
| --- | --- | --- |
| `app` | Глобальная инициализация: providers, router root, стили, плагины Tauri-клиента | `app/providers/`, `app/router/`, `app/styles/` |
| `pages` | Страничные компоненты, привязанные к роуту | `pages/auth`, `pages/channel`, `pages/settings` |
| `widgets` | Композиции features/entities без собственной бизнес-логики | `widgets/sidebar`, `widgets/message-panel`, `widgets/voice-room` |
| `features` | Конкретные пользовательские действия (use cases) | `features/send-message`, `features/join-voice-room`, `features/mute-toggle`, `features/auth-by-email` |
| `entities` | Доменные сущности + базовые карточки и модели | `entities/user`, `entities/server`, `entities/channel`, `entities/message` |
| `shared` | Reusable инфраструктура без доменной привязки | `shared/ui` (shadcn-компоненты), `shared/api`, `shared/lib`, `shared/config`, `shared/hooks` |

### Структура слайса

Каждый слайс (например `features/send-message/`) содержит сегменты:

```text
features/send-message/
├── ui/              # React-компоненты слайса
├── model/           # Zustand store, хуки бизнес-логики
├── api/             # запросы к Supabase / Tauri invoke
├── lib/             # внутренние утилиты слайса
├── config/          # константы, схемы zod
└── index.ts         # ПУБЛИЧНЫЙ API (barrel) — наружу торчит только это
```

Снаружи слайс импортируется только через barrel: `import { SendMessageForm } from '@/features/send-message'`. Внутрь лезть через `@/features/send-message/ui/...` запрещено.

### Правила компонентов

1. **Жёсткий потолок: компонент ≤ 100 строк (включая импорты и JSX).** Перевалил — рефактор:
   - Подкомпоненты выделить в тот же слайс (`ui/Header.tsx`, `ui/Body.tsx`).
   - Логику вытащить в кастомный хук в `model/`.
   - Generic-куски (кнопки, инпуты, badge, divider) — в `shared/ui`.
2. **Общее = вынести.** Если паттерн повторяется в 2+ местах, переносим в `shared/ui` или `shared/lib` сразу, не ждём третьего раза.
3. **JSX без логики.** Условия в JSX — только тернарка/&&. Сложная логика — переменная выше или хук.
4. **Файл = один компонент по умолчанию.** Хелперы, типы, варианты cva — рядом, но отдельный файл когда строки растут.
5. **Импорты:** абсолютные через `@/`. Линтер запрещает `../../..`.

### Контроль границ

- **Biome** — основной линтер + форматтер (заменяет ESLint + Prettier). Быстрый, написан на Rust, одной командой `biome check --apply`. Конфиг — `biome.json` в корне.
- **steiger** (CLI от FSD-команды) — статический анализ FSD-слоёв и слайсов: запрещает cross-import между слайсами одного слоя, запрещает обход barrel-ов (`@/features/x/ui/...`), требует public API через `index.ts`. Запускается в CI и как pre-commit hook. У Biome нет slice-aware правил, поэтому FSD-границы держит именно `steiger`.
- Дополнительно в `biome.json` — правило `noRestrictedImports` для запрета относительных импортов глубже `./` (только `@/`-алиасы) и для запрета прямых импортов сегментов слайса (паттерн `@/features/*/ui/**`, `@/features/*/model/**` и т.д.).

### Структура проекта (целевая)

```text
solvex/
├── src/                                    # Frontend (FSD)
│   ├── app/
│   │   ├── providers/                      # QueryProvider, ThemeProvider, RouterProvider
│   │   ├── router/                         # routeTree, router instance
│   │   ├── styles/                         # index.css, themes
│   │   └── index.tsx                       # bootstrap
│   ├── pages/
│   │   ├── auth/                           # /auth (login/signup)
│   │   ├── home/                           # / (server list)
│   │   ├── channel/                        # /servers/$id/channels/$cid
│   │   └── settings/                       # /settings
│   ├── widgets/
│   │   ├── sidebar/                        # server-list + channel-list композит
│   │   ├── message-panel/                  # история + composer
│   │   ├── voice-room/                     # LiveKitRoom + controls + grid
│   │   └── topbar/                         # presence, settings dropdown
│   ├── features/
│   │   ├── auth-by-email/
│   │   ├── auth-by-oauth/
│   │   ├── send-message/
│   │   ├── upload-attachment/
│   │   ├── join-voice-room/
│   │   ├── leave-voice-room/
│   │   ├── mute-toggle/
│   │   ├── push-to-talk/                   # завязан на tauri-plugin-global-shortcut
│   │   ├── share-screen/
│   │   ├── toggle-camera/
│   │   ├── create-server/
│   │   ├── create-channel/
│   │   └── theme-switch/
│   ├── entities/
│   │   ├── user/                           # User type, UserAvatar, useCurrentUser
│   │   ├── server/                         # Server type, ServerIcon, useServer
│   │   ├── channel/                        # Channel type, ChannelItem, useChannel
│   │   ├── message/                        # Message type, MessageItem
│   │   └── voice-participant/              # ParticipantTile, useParticipant
│   └── shared/
│       ├── ui/                             # shadcn компоненты (button, dialog, dropdown, ...)
│       ├── api/
│       │   ├── supabase.ts                 # singleton client
│       │   ├── livekit.ts                  # token fetch
│       │   └── tauri.ts                    # типизированные invoke-обёртки
│       ├── lib/
│       │   ├── cn.ts                       # tailwind-merge helper
│       │   ├── format-date.ts
│       │   └── ...
│       ├── hooks/                          # generic хуки (useDebounce и т.п. поверх @uidotdev)
│       ├── config/                         # env, routes, constants
│       └── types/                          # типы Supabase (сгенерированы CLI)
│
├── src-tauri/                              # Rust core
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs                          # инициализация плагинов
│   │   ├── commands/                       # invoke handlers
│   │   │   ├── mod.rs
│   │   │   ├── audio.rs                    # перечисление input/output устройств
│   │   │   └── settings.rs
│   │   └── tray.rs                         # system tray
│   ├── capabilities/
│   │   └── default.json                    # разрешения
│   └── tauri.conf.json
│
└── supabase/                               # SQL миграции и Edge Functions
    ├── migrations/
    └── functions/
        └── livekit-token/
```

### Соответствие FSD ↔ план фаз

- **Фаза 0** трогает: `app/`, `shared/ui` (shadcn), `shared/lib/cn.ts`, `pages/home` (заглушка), `widgets/sidebar` (заглушка), `features/theme-switch`.
- **Фаза 1**: `features/auth-by-email`, `features/auth-by-oauth`, `entities/user`, `pages/auth`, `shared/api/supabase.ts`.
- **Фаза 2**: `entities/server`, `entities/channel`, `entities/message`, `features/send-message`, `features/upload-attachment`, `widgets/message-panel`, `pages/channel`.
- **Фаза 3**: `entities/voice-participant`, `features/join-voice-room`, `features/leave-voice-room`, `features/mute-toggle`, `features/push-to-talk`, `widgets/voice-room`, `shared/api/livekit.ts`.
- **Фаза 4**: `features/share-screen`, `features/toggle-camera`.
- **Фаза 5**: `app/providers` для deep-link/notification/updater, обёртки в `shared/api/tauri.ts`.

---

## 6. Фазы реализации

Каждая фаза — отдельная итерация с PR. Не пытаемся сделать всё сразу.

### Фаза 0 — фундамент UI

- Tailwind v4 + shadcn init.
- TanStack Router, базовый layout (sidebar + main).
- Zustand store auth (без реальной авторизации, mock).
- TanStack Query provider.
- Темы (dark/light) через `next-themes`.

### Фаза 1 — Supabase auth

- Создать Supabase проект (cloud или локальный `supabase start`).
- Подключить `@supabase/supabase-js`, страница `/auth` (email + OAuth).
- RLS policies для `profiles`.
- Сгенерировать TS-типы: `supabase gen types typescript`.

### Фаза 2 — текстовый чат

- Таблицы `servers`, `channels`, `messages`, `memberships` + RLS.
- Realtime подписка на `messages` через Supabase channel.
- Виртуализация списка сообщений (react-virtuoso).
- Composer с автогрузкой файлов в Storage.
- Presence (онлайн/офлайн) через Supabase Realtime presence.

### Фаза 3 — Voice

- Поднять LiveKit (docker-compose) либо cloud.
- Edge Function `livekit-token` — выдаёт JWT по `user_id + room`.
- Voice-комната на `@livekit/components-react`: `LiveKitRoom`, `RoomAudioRenderer`, `useTracks`, `ControlBar`.
- Push-to-talk через `tauri-plugin-global-shortcut` → Zustand → mute/unmute local track.
- System tray + индикатор "в звонке".

### Фаза 4 — Video и screen share

- Включение камеры (`createLocalVideoTrack`).
- Screen share (`createScreenShareTracks`) — Tauri требует разрешения окон на macOS (`NSScreenCaptureUsageDescription` через bundle config).
- Grid layout участников.

### Фаза 5 — Polish

- `tauri-plugin-deep-link` для invite-ссылок `solvex://invite/<token>`.
- `tauri-plugin-notification` для входящих сообщений вне фокуса.
- `tauri-plugin-updater` + GitHub release pipeline.
- `tauri-plugin-sql` офлайн-кэш последних N сообщений.
- Логирование через `tauri-plugin-log`.

---

## 7. Файлы, которые меняем на ближайшей итерации (Фаза 0)

### Зависимости (`package.json`)

Runtime: `tailwindcss@^4`, `@tailwindcss/vite`, `tw-animate-css`, `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `@tanstack/react-router`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `zustand`, `@siberiacancode/reactuse`, `next-themes`.

Dev: `@tanstack/router-devtools`, `@tanstack/router-plugin`, `@biomejs/biome` (линтер + форматтер), `steiger` (FSD CLI-аудит для контроля слоёв и слайсов).

### Конфиги

- `vite.config.ts` — подключить `@tailwindcss/vite` и `@tanstack/router-plugin/vite`, alias `@` → `./src`.
- `tsconfig.json` — `baseUrl: "."`, `paths: { "@/*": ["src/*"] }`.
- `biome.json` (новый) — конфиг Biome: форматтер (2 пробела, single quotes, semicolons), линтер (recommended + строгие правила React/TS), `organizeImports`, `noRestrictedImports` под FSD-паттерны (запрет на `@/<layer>/*/ui/**` и т.п. из чужих слайсов).
- `steiger.config.ts` (новый) — конфиг steiger с включением FSD-rule-set: `public-api`, `forbidden-imports`, `insignificant-slice`, `inconsistent-naming`.
- `components.json` (новый) — конфиг shadcn CLI, `componentsDir: "src/shared/ui"`, `utils: "@/shared/lib/cn"`.

### Структура (создать)

- `src/shared/lib/cn.ts` — `cn()` обёртка над `clsx + tailwind-merge`.
- `src/shared/config/env.ts` — типизированные `import.meta.env` (anon key Supabase появится в Фазе 1).
- `src/shared/ui/` — пустая папка под shadcn-компоненты, добавим `button`, `input`, `dropdown-menu`, `dialog`, `scroll-area`, `tooltip`, `avatar`, `separator`, `sonner` (toast) через `bunx shadcn@latest add ...`.
- `src/app/styles/index.css` — `@import "tailwindcss"; @import "tw-animate-css";` + CSS-переменные тем shadcn.
- `src/app/providers/index.tsx` — композит `QueryProvider + ThemeProvider + RouterProvider`.
- `src/app/providers/query.tsx` — `QueryClient` + `QueryClientProvider` + devtools.
- `src/app/providers/theme.tsx` — `next-themes` (`ThemeProvider`).
- `src/app/router/route-tree.ts` — корневой routeTree TanStack Router (file-based через plugin либо code-based, выбираем code-based для простоты).
- `src/app/router/index.ts` — `createRouter` + типизация `Register`.
- `src/app/index.tsx` — bootstrap, рендерит `<Providers />`.
- `src/pages/home/ui/HomePage.tsx` — заглушка с приветствием.
- `src/pages/auth/ui/AuthPage.tsx` — пустая заглушка (наполним в Фазе 1).
- `src/widgets/sidebar/ui/Sidebar.tsx` — заглушка-плейсхолдер с дамми server-list.
- `src/widgets/sidebar/index.ts` — barrel.
- `src/features/theme-switch/ui/ThemeSwitch.tsx` — кнопка переключения темы.
- `src/features/theme-switch/index.ts` — barrel.

### Правки существующих

- `src/App.tsx` — удалить, функциональность переехала в `src/app/`.
- `src/App.css` — удалить, стили централизуются в `src/app/styles/index.css`.
- `src/main.tsx` — теперь импортирует `./app` (точка входа) и больше ничего не делает.
- `src/assets/react.svg` — удалить, демо-логотип не нужен.
- `src-tauri/tauri.conf.json` — `width: 1280, height: 800`, `minWidth: 940, minHeight: 560`.
- `src-tauri/capabilities/default.json` — оставить как есть (минимальные core + opener).
- `src-tauri/src/lib.rs` — `greet` оставить на одну итерацию как пример, удалим в Фазе 1.

### Линтер и формат: Biome (`biome.json`)

Biome — один бинарь под линтинг + формат. Заменяет связку ESLint + Prettier + plugin-import. Конфиг минимальный:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "ignore": ["dist", "src-tauri/target", "src/shared/types/supabase.ts"] },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": { "quoteStyle": "single", "jsxQuoteStyle": "double", "semicolons": "always", "trailingCommas": "all" }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": { "noNonNullAssertion": "warn", "useImportType": "error" },
      "correctness": { "noUnusedImports": "error", "noUnusedVariables": "error" },
      "suspicious": { "noExplicitAny": "error" }
    }
  },
  "organizeImports": { "enabled": true }
}
```

Дополнительно через `linter.rules.style.noRestrictedImports` запрещаем глубокие импорты в слайсы:

```json
"noRestrictedImports": {
  "level": "error",
  "options": {
    "paths": {
      "@/features/*/ui/**":     "Импортируй через barrel: '@/features/<slice>'",
      "@/features/*/model/**":  "Импортируй через barrel: '@/features/<slice>'",
      "@/widgets/*/ui/**":      "Импортируй через barrel: '@/widgets/<slice>'",
      "@/entities/*/ui/**":     "Импортируй через barrel: '@/entities/<slice>'"
    }
  }
}
```

Команды: `bunx biome check ./src` (проверка), `bunx biome check --write ./src` (автофикс + формат).

### FSD-границы: steiger (`steiger.config.ts`)

Slice-aware правила, которых Biome не умеет: cross-import между слайсами одного слоя, нарушение иерархии (`entities` импортирует `features`), отсутствие `index.ts` у слайса.

```ts
import { defineConfig } from 'steiger/config';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
]);
```

Команды: `bunx steiger ./src` (проверка), запуск в CI и pre-commit.

### Pre-commit (опционально)

`lefthook` или `simple-git-hooks` + `lint-staged`:

```yaml
pre-commit:
  commands:
    biome:
      glob: "src/**/*.{ts,tsx,js,jsx,json}"
      run: bunx biome check --write --no-errors-on-unmatched {staged_files}
      stage_fixed: true
    steiger:
      run: bunx steiger ./src
```

Параллельно (Фаза 1 готовится, но не делается сейчас): создать Supabase-проект, сгенерировать anon key, положить в `.env` (Vite читает только `VITE_*`).

---

## 8. Что переиспользовать из текущего кода

- Команда `greet` в `src-tauri/src/lib.rs:3` — оставить как пример, удалить когда появится первая реальная команда (например `commands::audio::list_devices`).
- `invoke()`-вызов в `src/App.tsx:12` — паттерн обёртки переедет в `src/shared/api/tauri.ts` (типизированные хелперы поверх `@tauri-apps/api/core`).
- Bun в `tauri.conf.json:7,9` уже настроен как пакет-менеджер — оставляем, все примеры команд буду писать через `bun`.

Ничего больше реально переиспользовать пока нечего — проект только что инициализирован.

---

## 9. Verification

После Фазы 0:

```powershell
bun install
bun run tauri dev
```

Ожидаемо: открывается окно 1280×800, видна заглушка с sidebar + main area, тема переключается, TanStack Router показывает корневой роут, DevTools TanStack Query доступны через флоатинг-кнопку. Никаких ошибок в консоли Tauri и в DevTools WebView.

После Фазы 1: логин через email открывает `/servers`, refresh не сбрасывает сессию (Supabase сохраняет JWT в localStorage).

После Фазы 3: два запущенных экземпляра приложения (на двух машинах либо на одной с двумя Supabase-юзерами) слышат друг друга в одной комнате; PTT-хоткей мутит/размучивает локальный трек; system tray показывает индикатор звонка.

End-to-end smoke test (минимум перед каждым релизом): логин → создать сервер → создать voice-канал → подключиться двумя клиентами → передать аудио → передать видео → screen share → отключиться → послать текстовое сообщение → закрыть приложение → переоткрыть → сообщение и сервер на месте.

---

## 10. Риски и развилки

- **WebRTC + Tauri WebView2 на Windows**: getUserMedia требует HTTPS либо localhost. Tauri dev грузит с `http://localhost:1420` — работает. В production WebView2 даёт `tauri://` — нужно проверить заранее, что getUserMedia не блокируется (известно, что работает, но стоит протестить на Фазе 3 минимально).
- **macOS permissions**: камера/микрофон/screen capture требуют usage descriptions в `Info.plist`. Tauri прокидывает их через `bundle.macOS.infoPlist` в `tauri.conf.json`. Без этого приложение упадёт при первом запросе доступа.
- **Tailwind v4 vs v3**: v4 сильно поменял конфиг, многие туториалы по shadcn ещё на v3. shadcn CLI поддерживает v4 — использовать свежие команды.
- **LiveKit token security**: НИКОГДА не класть API secret на клиент. Только Edge Function знает secret. Если сменим на свой Rust-бэк позже — генерация токена туда.
