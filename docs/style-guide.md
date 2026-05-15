# SolveX Style Guide

Проектный кодстайл и архитектурные правила. Применяется ко всему `apps/client/`.

Инструменты-сторожа:

- **ESLint** (`bun lint`) — формат + правила. Конфиг: `@siberiacancode/eslint` (antfu under the hood) + плагины React / Next / jsx-a11y / Tailwind / stylistic.
- **TypeScript** strict + `noUnusedLocals` + `noUnusedParameters`.
- FSD-границы держим руками + конвенции из этого документа.

Workspaces:

- `apps/client` — Next.js + Tauri UI.
- `apps/server` — Hono backend (Prisma, LiveKit token, Supabase auth verify).
- `apps/tauri` — Rust shell.

---

## 1. FSD-слои

Иерархия сверху вниз. Импорты только **вниз**, никогда вверх и не в бок.

```
app          ← Next.js routing (server pages-обёртки + layout + route handlers)
views        ← FSD-«pages» (контент роутов, client-компоненты). Назван views, не pages — иначе Next.js считает Pages Router.
widgets      ← композиции из features/entities, без бизнес-логики
features     ← интерактивы (SendMessage, JoinRoom, ToggleMute)
entities     ← доменные сущности (User, Room, Message), модели + базовый UI
shared       ← переиспользуемые кирпичи (ui/, lib/, api/, config/)
```

**Правило для `app/`**: `page.tsx` и `layout.tsx` — серверные компоненты (no `'use client'`). Вся клиентская логика (хуки, state, router) — в `views/<slug>` или `widgets/<name>`. Пример:

```tsx
// app/auth/page.tsx — серверный, тонкий
import { AuthPage } from '@/views/auth';
const Page = () => <AuthPage />;
export default Page;
```

```tsx
// views/auth/ui/AuthPage/AuthPage.tsx — клиентский, всё мясо здесь
'use client';
import { useRouter } from 'next/navigation';
// ...
```

Cross-import между слайсами одного слоя **запрещён**. Если двум features нужен общий код — поднять в `shared` или `widgets` (если это композиция).

---

## 2. Структура слайса

Каждый слайс — папка с сегментами:

```
widgets/voice-room/
  index.ts          ← public API (barrel)
  ui/               ← React-компоненты слайса
  model/            ← Zustand store, хуки, типы стейта
  lib/              ← чистые утилиты слайса
  api/              ← network-вызовы слайса (если есть)
  config/           ← константы, конфиг
```

Не все сегменты обязательны. Минимум — `ui/` + `index.ts`.

---

## 3. Структура `ui/` слайса

**Главный компонент слайса** живёт плоско прямо в `ui/`, файлы рядом:

```
widgets/voice-room/ui/
  VoiceRoom.tsx          ← JSX + логика (entry-компонент слайса)
  VoiceRoom.types.ts     ← все типы (Props, локальные unions)
  VoiceRoom.styles.ts    ← Tailwind class-строки / cva-варианты
```

**Одноразовые подкомпоненты** — каждый в своей папке внутри `components/`:

```
widgets/channels-panel/ui/
  ChannelsPanel.tsx              ← главный, плоско
  ChannelsPanel.styles.ts
  components/
    ChannelsHeader/
      ChannelsHeader.tsx
      ChannelsHeader.types.ts
      ChannelsHeader.styles.ts
      index.ts                   ← `export { ChannelsHeader } from './ChannelsHeader';`
    ChannelsList/
      ChannelsList.tsx
      ChannelsList.types.ts
      ChannelsList.styles.ts
      index.ts
    ...
```

**Почему так:**
- Главный entry без папки — короткий импорт `@/widgets/voice-room/ui/VoiceRoom` сразу резолвится в `.tsx`.
- Подкомпоненты — папка + `index.ts` для группировки трёх файлов и чистого относительного импорта `./components/ChannelsHeader` без `.tsx` хвоста.
- `*.types.ts` рядом — IDE сразу даёт перейти к Props.
- `*.styles.ts` отдельно — JSX чистый.

**`.types.ts` создаётся только при наличии типов.** Если у компонента нет Props (родительский no-prop entry), `.types.ts` не плодим.

**`.styles.ts` создаётся если 3+ Tailwind-классов** — иначе inline (см. секцию 4).

**Slice barrel** (`widgets/voice-room/index.ts`):

```ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

Прямой ре-экспорт типа из `.types.ts` — так как плоский `.tsx` сам Props не реэкспортит.

**Исключение**: примитивы из `shared/ui/` (shadcn-генерация) остаются плоскими файлами (`button.tsx`, `input.tsx`) — внешний код, не трогаем.

### Пример: `VoiceRoom.types.ts`

```ts
import type { LocalUserChoices } from '@livekit/components-core';
import type { DisconnectReason } from 'livekit-client';

export type VoiceRoomProps = {
  token: string;
  serverUrl: string;
  roomName: string;
  userChoices: LocalUserChoices;
  onLeave: () => void;
  onConnectFailure: (reason: DisconnectReason) => void;
};
```

### Пример: `VoiceRoom.styles.ts`

Два паттерна:

**A. Простые статичные классы** — `const`-объект:

```ts
export const voiceRoomStyles = {
  root: 'flex h-full flex-col',
  header: 'flex items-center gap-2 border-b px-4 py-2',
  controls: 'flex justify-center p-2',
} as const;
```

**B. Варианты с условиями** — `cva` (уже стоит в deps):

```ts
import { cva } from 'class-variance-authority';

export const channelItemStyles = cva(
  'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
  {
    variants: {
      active: {
        true: 'bg-sidebar-accent text-sidebar-accent-foreground',
        false: 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50',
      },
    },
    defaultVariants: { active: false },
  },
);
```

### Пример: `VoiceRoom.tsx`

```tsx
'use client';

import { LiveKitRoom /* ... */ } from '@livekit/components-react';

import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

export const VoiceRoom = ({ token, serverUrl, /* ... */ }: VoiceRoomProps) => (
  <LiveKitRoom className={s.root} /* ... */>
    <div className={s.header}>{/* ... */}</div>
    <div className={s.controls}>{/* ... */}</div>
  </LiveKitRoom>
);
```

### Пример: `index.ts`

```ts
export { VoiceRoom } from './VoiceRoom';
export type { VoiceRoomProps } from './VoiceRoom.types';
```

---

## 4. Когда tailwind inline vs в styles.ts

| Случай | Куда |
|---|---|
| 1-2 строки, локально, никогда не реюзается | inline в JSX |
| 3+ Tailwind-классов в одном `className` | в `styles.ts` под именем |
| Условный класс (active/disabled/error) | `cva` в `styles.ts` |
| Один и тот же набор в 2+ местах | `styles.ts`, имя по семантике |
| Класс зависит от prop | `cva` |
| `cn(...)` склейка | если 3+ аргументов — в `styles.ts` функцию |

Не плодить `styles.ts` на короткие однострочники. Принцип — JSX должен читаться, имена классов в `s.root`/`s.header` рассказывают структуру компонента.

---

## 5. Одноразовые подкомпоненты

**Правило**: компонент `ChildPart` используется только внутри родителя `Parent` → не торчит на верху `ui/`, а лежит в `ui/Parent/components/ChildPart/`.

```
widgets/channels-panel/ui/
  ChannelsPanel/
    ChannelsPanel.tsx
    ChannelsPanel.types.ts
    ChannelsPanel.styles.ts
    index.ts
    components/                  ← одноразовые куски
      ChannelsHeader/
        ChannelsHeader.tsx
        ChannelsHeader.types.ts
        ChannelsHeader.styles.ts
        index.ts
      ChannelsList/
        ...
      ChannelsFooter/
        ...
```

Если подкомпонент стал нужен ещё где-то — поднять до `ui/` слайса (или вынести в `shared/ui/`, если он generic).

Аналогично для **pages**: если кусок UI используется одной страницей — клади в `ui/components/` страницы, **не плоди виджет**.

---

## 6. Cap на размер компонента

**100 строк JSX-файла максимум.** Считается весь файл.

Перевалил — рефактор:
1. Вытащить подкомпоненты в `components/`.
2. Вытащить логику в `model/` (хук).
3. Вытащить утилиты в `lib/` слайса.

---

## 7. Naming

| Что | Как | Пример |
|---|---|---|
| Слайсы | kebab-case | `voice-room`, `channels-panel`, `auth-by-email` |
| Сегменты | kebab-case | `ui`, `model`, `lib`, `api`, `config` |
| Папка компонента | PascalCase | `VoiceRoom/`, `ChannelsFooter/` |
| Файл компонента | PascalCase + `.tsx` | `VoiceRoom.tsx` |
| Файл типов | `<Name>.types.ts` | `VoiceRoom.types.ts` |
| Файл стилей | `<Name>.styles.ts` | `VoiceRoom.styles.ts` |
| React-компонент (export) | PascalCase | `VoiceRoom` |
| Хук | `use` + camelCase | `useEnterRoom`, `useChatUpload` |
| Утилита | camelCase | `groupMessages`, `formatTime` |
| Тип Props | `<Name>Props` | `VoiceRoomProps` |
| Тип входных/выходных DTO | `<Name>Input/Output` | `EnterRoomInput` |

---

## 8. Импорты

### Алиасы

`@/` указывает на корень `apps/client/`. Используем для всего, кроме относительных в той же папке компонента.

```ts
// ✓ внешние импорты
import { Button } from '@/shared/ui/button';
import { useCurrentUser } from '@/entities/user';

// ✓ относительные внутри папки компонента
import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

// ✓ относительные внутри слайса (между сегментами/папками)
import { groupMessages } from '../lib/grouping';
```

### Запреты (Biome `noRestrictedImports`)

Глубокий импорт в сегменты слайса с верхних слоёв запрещён — только через barrel `@/<layer>/<slice>`:

```ts
// ✗ ЗАПРЕЩЕНО
import { ChannelsList } from '@/widgets/channels-panel/ui/components/ChannelsList';

// ✓ ОК (через barrel)
import { ChannelsPanel } from '@/widgets/channels-panel';
```

Исключения:
- `@/shared/ui/<primitive>` — допустимо (shadcn-конвенция).
- Внутри одного слайса — относительные ОК.

### Порядок групп (Biome auto-organize)

```
1. Bun/Node builtin
2. (пустая строка)
3. Внешние пакеты
4. (пустая строка)
5. @solvex/* workspace
6. (пустая строка)
7. @/ алиасы
8. (пустая строка)
9. ./ относительные
```

Сортировка внутри группы — Biome сам.

---

## 9. Barrel-экспорты (`index.ts`)

### Слайс

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom';
```

Экспортируем только то, что нужно снаружи. Внутренние сабкомпоненты — НЕ.

### Папка компонента

```ts
// ui/VoiceRoom/index.ts
export { VoiceRoom } from './VoiceRoom';
export type { VoiceRoomProps } from './VoiceRoom.types';
```

---

## 10. Типы

- Используем `type`, не `interface` (Biome enforce: `useConsistentTypeDefinitions: { style: 'type' }`).
- Props всегда в `<Name>.types.ts`, рядом с компонентом.
- Импорт типов через `import type { ... }` (Biome: `useImportType`).
- `unknown` вместо `any`. `any` запрещён (`noExplicitAny: error`).
- Discriminated unions для вариантов:

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number; mime: string };
```

---

## 11. React-конвенции

- Функциональные компоненты, arrow-функции.
- `'use client'` директива в каждом UI-файле, который использует hooks/state/event handlers.
- React Compiler **включён** (`reactCompiler: true` в `next.config.ts`) — не нужны `useMemo`/`useCallback` для микро-оптимизаций, компилятор сам мемоизирует. Оставляем хуки только когда нужен **семантический** stable ref (например для зависимостей `useEffect`, key в Map).
- Файлы клиента — strict `'use client'` сверху.
- Обработчики событий — `on<Event>` камелкейс: `onSubmit`, `onSelectRoom`.

### 11.1 Порядок хуков (hooks order)

ESLint **не** автофиксит — React требует stable call-order на каждый render, авто-перестановка опасна. Соблюдаем руками + ловим на review.

Порядок групп сверху вниз:

1. **Navigation** — `useRouter`, `usePathname`, `useSearchParams`, `useParams`.
2. **Store / context** — `useCurrentUser`, `useAuthStore`, `useTheme`, любые `use<Name>Store` / `use<Name>Context`.
3. **Data** — TanStack Query / Mutation хуки (`useRooms`, `useDeleteRoom`, `useRoomToken`).
4. **State** — `useState`, `useReducer`.
5. **Ref** — `useRef`.
6. **Memo / callbacks** — `useMemo`, `useCallback`, `useDeferredValue`, `useTransition`, `useId`, `useOptimistic`.
7. **Effects** — `useEffect`, `useLayoutEffect`, `useFormStatus`, `useActionState`.
8. **Derived const** — обычные `const x = params.get(...)` / `const displayName = user?.email?.split('@')[0]`. Сюда же распакованные значения хуков.

Между группами — **пустая строка**. Внутри группы — без пустой.

### Пример

✅ Каноничный порядок:

```tsx
export const ChannelsPanel = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { user, isAdmin } = useCurrentUser();

  const rooms = useRooms();
  const deleteMutation = useDeleteRoom();

  const [open, setOpen] = useState(false);

  const handleSelect = useCallback((id: string) => router.push(`/r/${id}`), [router]);

  useEffect(() => {
    // ...
  }, [rooms.data]);

  const activeRoom = params.get('name');
  const displayName = user?.email?.split('@')[0] ?? 'you';

  return /* ... */;
};
```

### Правила перестановки

- **Никогда** не переставляй хук с условным вызовом (`if (...) useFoo()` — это уже баг по `react-hooks/rules-of-hooks`, чинить, не сортировать).
- **Никогда** не переставляй вокруг data dependency: `const name = params.get(...)` → `useRoomToken({ roomName: name })` — `name` обязан быть **до** `useRoomToken`. Если порядок групп этому противоречит, оставь как есть и пометь комментом `// data dep: name → query`.
- В компонентах-обёртках с одним хуком — группа не нужна.

### Кастомные хуки (`use<Foo>`)

Кастомный хук = чёрный ящик. Его место — по семантике того что внутри:

- Хук, делающий `useQuery/useMutation` (`useRooms`, `useEnterRoom`) → группа **Data**.
- Хук-обёртка над контекстом/стором (`useCurrentUser`) → группа **Store**.
- Хук-эффект (`useDocumentTitle`, `useScrollLock`) → группа **Effects**.

---

## 12. Сегмент `model/`

Тут живут:
- Zustand store (`<entity>-store.ts`)
- TanStack хуки (`use-<action>.ts`)
- Локальные типы стейта (`types.ts`)

```
entities/room/model/
  use-enter-room.ts
  use-room-token.ts
  types.ts
```

Файлы хуков — kebab-case. Внутри — camelCase-функции.

---

## 13. Сегмент `lib/`

Чистые функции без побочки и без React-зависимостей (по возможности).

```
entities/room/lib/
  cache.ts          ← read/write/clearRoomTokenCache
  validation.ts     ← isRoomNameValid
```

Если функция возвращает JSX → она компонент, переместить в `ui/`.

---

## 14. Сегмент `api/`

Network-вызовы. Каждая операция — отдельный файл или группа по ресурсу.

```text
shared/api/
  http/             ← Hono RPC client (typed)
    api.ts          ← hc<App>(baseUrl) + auth header
    index.ts
  auth/             ← getFreshAccessToken (Supabase session token)
  supabase/         ← supabase browser client
  rooms/            ← listRooms / createRoom / deleteRoom (RPC wrappers)
  livekit/          ← fetchLiveKitToken
  index.ts          ← barrel
```

**HTTP — Hono RPC client из `shared/api/http`**. Базовый URL — `env.NEXT_PUBLIC_API_URL`. Авторизация автоматом через `getFreshAccessToken()` в `headers()` callback клиента.

Шаблон wrapper'а:

```ts
import { api } from '../http';
import type { CreateRoomInput, Room } from './rooms.schema';

export const createRoom = async (input: CreateRoomInput): Promise<Room> => {
  const res = await api.api.rooms.$post({ json: input });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `Failed to create room: ${res.status}`);
  }

  return res.json();
};
```

Запросы на сервер (`apps/server`) шарят типы через `import type { App } from '@solvex/server'` — RPC client сразу типизирует body/response. **Не** делаем `fetch` руками — теряется типизация.

`apiClient` (axios) удалён. axios как dep тоже.

---

## 15. Tailwind v4

- Темы — CSS variables в `globals.css` (`:root` + `.dark`).
- shadcn vars: `--background`, `--foreground`, `--primary`, `--sidebar-*` и т.д.
- Тёмная тема — корень `<html className="dark">`. Меняется хардкодом, не через `next-themes` (несовместимо с Tauri).
- Canonical-классы вместо arbitrary: `w-18` вместо `w-[72px]` если значение в шкале Tailwind.
- `cn()` из `@/shared/lib/cn` для склейки условных классов.

---

## 16. Пустые строки между логическими шагами

Чтобы код читался "блоками", а не сплошной стеной — обязательная пустая строка ПЕРЕД управляющими переходами, если им предшествует другой statement.

**Перед чем ставим пустую строку:**
- `return` (если не первый statement в блоке)
- `throw`
- `if` (early-return guard или branching)
- `await` вызов, после которого идёт логически отдельный шаг
- `try` / `for` / `while` / `switch`

**После `if`-блока** (открыто `{...}`) — пустая строка перед следующим statement, если есть.

ESLint **автофиксит**: правило `style/padding-line-between-statements` подключено в `apps/client/eslint.config.mjs`. `bun lint:fix` расставит пустые строки сам.

### Примеры

❌ Плотная стена:
```ts
const trimmed = room.trim();
if (!trimmed) throw new Error('Room name required');
const accessToken = await getFreshAccessToken();
const { token, url } = await fetchLiveKitToken({ room: trimmed }, accessToken);
writeRoomTokenCache(trimmed, { token, url });
router.push(`/room?name=${encodeURIComponent(trimmed)}`);
```

✅ Дышит:
```ts
const trimmed = room.trim();

if (!trimmed) throw new Error('Room name required');

const accessToken = await getFreshAccessToken();
const { token, url } = await fetchLiveKitToken({ room: trimmed }, accessToken);

writeRoomTokenCache(trimmed, { token, url });
router.push(`/room?name=${encodeURIComponent(trimmed)}`);
```

❌ try/catch без воздуха:
```ts
try {
  const { data } = await apiClient.post<TokenResponse>('/api/livekit-token', body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
} catch (e) {
  if (e instanceof AxiosError) {
    const message = e.response?.data?.error ?? e.message;
    throw new Error(message);
  }
  throw e;
}
```

✅ С пустыми:
```ts
try {
  const { data } = await apiClient.post<TokenResponse>('/api/livekit-token', body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return data;
} catch (e) {
  if (e instanceof AxiosError) {
    const message = e.response?.data?.error ?? e.message;

    throw new Error(message);
  }

  throw e;
}
```

❌ Множественные return'ы подряд:
```ts
if (!name) return null;
if (query.isLoading || !query.data) {
  return <Loader />;
}
if (!choices) {
  return <PreJoin />;
}
return <VoiceRoom />;
```

✅ С пустыми:
```ts
if (!name) return null;

if (query.isLoading || !query.data) {
  return <Loader />;
}

if (!choices) {
  return <PreJoin />;
}

return <VoiceRoom />;
```

**Исключения** (НЕ ставим пустую):
- Один statement в блоке — пустая не нужна.
- `if (...) return ...;` подряд (single-line guards), если коротко и однотипно:
  ```ts
  if (!a) return null;
  if (!b) return null;
  if (!c) return null;
  ```
- Между declaration'ами одного смысла (`const a = ...; const b = ...; const c = ...;`).

---

## 17. Запреты

- `console.log` оставлять в коммите (можно только локально для дебага).
- `any` (`@typescript-eslint/no-explicit-any: error`).
- Non-null assertion `!` без обоснования.
- Deep imports мимо barrel.
- Cross-import между слайсами одного слоя.
- Prettier, Biome, CSS-in-JS (emotion/styled-components). Только Tailwind + ESLint (siberiacancode).
- `axios` / ручной `fetch` для бизнес-вызовов. Только Hono RPC client (`shared/api/http`).

---

## 18. Чек-лист перед коммитом

```bash
bun lint:fix                                  # ESLint фиксит формат, импорты, padding-line
cd apps/client && bunx tsc --noEmit           # типы client
cd apps/server && bunx tsc --noEmit           # типы server
bun --filter @solvex/client build             # сборка client
bun --filter @solvex/server build             # сборка server
```

Все green.
