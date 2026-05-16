# SolveX Style Guide

Проектный кодстайл и архитектурные правила. Применяется ко всему `apps/client/`.

Инструменты-сторожа:

- **Biome** (`bun lint` / `bun lint:fix`) — форматтер + линтер + organize imports в одном бинаре. Конфиг: корневой `biome.json` (один на весь монорепо).
- **TypeScript** strict + `noUnusedLocals` + `noUnusedParameters`.
- FSD-границы держим руками + конвенции из этого документа.

**Почему Biome, а не ESLint+Prettier:** один инструмент вместо связки, на порядок быстрее, конфиг — один `biome.json` без плагин-зоопарка. Цена: Biome не покрывает часть React-специфики, которую давал antfu-набор. Чего у Biome нет и что держим руками (см. ниже): порядок React-хуков, расширенный jsx-a11y, next-плагин, пустые строки между логическими шагами. `useExhaustiveDependencies` и `useSortedClasses` (Tailwind) Biome закрывает.

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

**Одноразовые подкомпоненты** — каждый в своей папке внутри `components/`, плюс **обязательный** `components/index.ts` barrel:

```
widgets/channels-panel/ui/
  ChannelsPanel.tsx              ← главный, плоско
  ChannelsPanel.styles.ts
  components/
    index.ts                     ← barrel слоя: re-exports всех подкомпонентов
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

Родитель импортирует один barrel:

```ts
// ✓ ОК
import { ChannelsHeader, ChannelsList, ChannelsFooter } from './components';

// ✗ НЕ ОК
import { ChannelsHeader } from './components/ChannelsHeader';
import { ChannelsList } from './components/ChannelsList';
```

**Почему так:**
- Главный entry без папки — короткий импорт `@/widgets/voice-room/ui/VoiceRoom` сразу резолвится в `.tsx`.
- Подкомпоненты — папка + `index.ts` для группировки трёх файлов и чистого относительного импорта `./components/ChannelsHeader` без `.tsx` хвоста.
- `components/index.ts` barrel — родитель импортирует одной строкой, плюс служит явным public API слоя подкомпонентов.
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

export interface VoiceRoomProps {
  token: string;
  serverUrl: string;
  roomName: string;
  userChoices: LocalUserChoices;
  onLeave: () => void;
  onConnectFailure: (reason: DisconnectReason) => void;
}
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
// 1-я группа: внешние пакеты + node:-builtins + @solvex/*
import { useForm } from 'react-hook-form';
import type { Room } from '@solvex/schemas/rooms';

// 2-я группа: @/ алиасы и относительные ./ ../ — вместе
import { useCurrentUser } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { groupMessages } from '../lib/grouping';
import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';
```

### Запреты (держим руками)

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

Biome **не** проверяет FSD-границы (`noRestrictedImports` в `biome.json` не включён — он требует ручного перечисления путей и плохо ложится на слайсовую структуру). Это правило ловим на review.

### Порядок импортов (Biome organize)

`assist.actions.source.organizeImports` в `biome.json` сортирует импорты автоматически при `bun lint:fix`. Biome группирует так:

1. Внешние пакеты (включая `node:`-builtins и `@solvex/*` workspace).
2. (пустая строка)
3. Алиасы `@/` и относительные `./`, `../` — **в одной группе**, без пустой строки между ними.

Внутри каждой группы — алфавитная сортировка, `import type` идёт по тому же порядку что и обычные импорты (не отдельной группой).

> Biome organize-imports проще, чем antfu/perfectionist: он **не** делает отдельных групп под builtin / workspace / alias с пустыми строками между ними. Не воюй с ним вручную — формат, который ставит `bun lint:fix`, и есть канон.

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

- **Props — `interface`**, всё остальное — `type`. Biome не форсит выбор (`useConsistentTypeDefinitions` в конфиг не включён), поэтому это ручная конвенция: `interface FooProps {}` для пропсов компонента, `type` для unions / алиасов / DTO.
- Props всегда в `<Name>.types.ts`, рядом с компонентом.
- Импорт типов через `import type { ... }` — Biome enforce (`useImportType: error`), `bun lint:fix` чинит сам.
- Экспорт типов через `export type { ... }` — Biome enforce (`useExportType: error`).
- `unknown` вместо `any`. `any` запрещён (`noExplicitAny: error`).
- Discriminated unions для вариантов:

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number; mime: string };
```

```ts
// Props — interface
export interface VoiceRoomProps {
  roomName: string;
  token: string;
  onLeave: () => void;
}
```

---

## 11. React-конвенции

- Функциональные компоненты, arrow-функции.
- `'use client'` директива в каждом UI-файле, который использует hooks/state/event handlers.
- React Compiler **включён** (`reactCompiler: true` в `next.config.ts`) — не нужны `useMemo`/`useCallback` для микро-оптимизаций, компилятор сам мемоизирует. Оставляем хуки только когда нужен **семантический** stable ref (например для зависимостей `useEffect`, key в Map).
- Файлы клиента — strict `'use client'` сверху.
- Обработчики событий — `on<Event>` камелкейс: `onSubmit`, `onSelectRoom`.

### 11.1 Порядок хуков (hooks order)

Biome **не** проверяет и не сортирует порядок хуков — React требует stable call-order на каждый render, авто-перестановка опасна. Соблюдаем руками + ловим на review.

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

Biome **этого не автофиксит** — у него нет аналога ESLint-правила `padding-line-between-statements`. `bun lint:fix` пустые строки между statements не расставит. Соблюдаем руками + ловим на review. Biome-форматтер схлопывает только подряд идущие пустые строки (2+ → 1), но не добавляет недостающие.

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

## 17. Shared схемы — `@solvex/schemas`

Все Zod схемы и типы общие между client/server живут в `packages/schemas`:

```text
packages/schemas/src/
  livekit/
    inputs.ts          ← tokenRequestSchema
    outputs.ts         ← tokenResponseSchema
    types.ts           ← TokenRequest, TokenResponse
    index.ts
  rooms/
    inputs.ts          ← createRoomInputSchema
    outputs.ts         ← roomSchema
    types.ts           ← Room, CreateRoomInput, CreateRoomRawInput
    index.ts
```

Импорт **прямой** из package, не через `@/shared/api`:

```ts
// ✓ ОК
import { createRoomInputSchema, type Room } from '@solvex/schemas/rooms';

// ✗ НЕ ОК — `shared/api` re-export схем удалён
import { Room } from '@/shared/api';
```

`@/shared/api` экспортирует **только runtime функции** (RPC wrappers, supabase client): `createRoom`, `deleteRoom`, `listRooms`, `fetchLiveKitToken`, `getFreshAccessToken`, `supabase`.

**Input vs Output типы:**

- `CreateRoomInput = z.output<typeof schema>` — после `.parse()`, defaults применены, required.
- `CreateRoomRawInput = z.input<typeof schema>` — raw form value, optionals до defaults.
- Используй `CreateRoomRawInput` для `defaultValues` формы, `CreateRoomInput` для submit / API body.

---

## 18. Формы — react-hook-form + zodResolver

Все формы строятся через `useForm` + `zodResolver`. Никаких самописных `useState` для полей.

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createRoomInputSchema, type CreateRoomInput, type CreateRoomRawInput } from '@solvex/schemas/rooms';

const DEFAULT_VALUES: CreateRoomRawInput = { name: '', isPrivate: false };

const {
  formState: { errors },
  handleSubmit,
  register,
  reset,
  watch,
  setError,
} = useForm<CreateRoomRawInput, unknown, CreateRoomInput>({
  resolver: zodResolver(createRoomInputSchema),
  defaultValues: DEFAULT_VALUES,
});
```

**Правила:**

- Схема живёт в `@solvex/schemas/<resource>`, не inline в форме (исключение — мелкие form-local schemas в `*.styles.ts` рядом).
- `defaultValues` типизирован `RawInput`, generic `useForm<RawInput, _, Output>` — RHF держит state в input shape, `handleSubmit` callback получает output.
- Server-side ошибки через `setError('field', { message: err.message })`.
- Boolean toggles вне формы (`isSignup`, `isPrivate` modal mode) — `useBoolean` из `@siberiacancode/reactuse`, не useState.

---

## 19. Conditional render — ts-pattern

Множественные условные ветки render — через `match` + discriminated union state, не вложенные `if (...) return`:

```tsx
import { match } from 'ts-pattern';

type RoomState =
  | { kind: 'loading' }
  | { kind: 'not-found' }
  | { kind: 'password'; roomId: string; displayName: string }
  | { kind: 'active'; token: string; url: string };

const state: RoomState = !room && rooms.isLoading
  ? { kind: 'loading' }
  : !room
    ? { kind: 'not-found' }
    : /* ... */;

return match(state)
  .with({ kind: 'loading' }, () => <RoomLoader text="Loading..." />)
  .with({ kind: 'not-found' }, () => <RoomNotFound />)
  .with({ kind: 'password' }, ({ roomId, displayName }) => (
    <RoomPasswordForm displayName={displayName} roomId={roomId} />
  ))
  .with({ kind: 'active' }, ({ token, url }) => <RoomActive token={token} url={url} />)
  .exhaustive();
```

`.exhaustive()` — TS error если добавили state но забыли case.

**Когда НЕ нужен `match`:** один-два guard early return (`if (!id) return null;`). Только при 3+ ветках render.

**Derived state выносить в hook.** View не должен содержать логику вычисления `state` — только `match`. Тернарные цепочки вычисления + `useEffect` живут в `model/use-<name>-state.ts`:

```tsx
// ✓ ОК — view только match
export const RoomPage = () => {
  const state = useRoomState();

  return match(state)
    .with({ kind: 'loading' }, () => <RoomLoadingFallback />)
    .with(/* ... */)
    .exhaustive();
};

// ✗ НЕ ОК — condition hell в самом view
export const RoomPage = () => {
  const state = !roomId ? { kind: 'no-id' } : !room ? /* ... */ : /* ... */;
  // ...
};
```

---

## 20. Drill cleanup — данные через хуки в leaf, не props

Если данные доступны через глобальный хук (`useCurrentUser`, `useRooms`, `useRouter`), **leaf компонент сам вызывает хук**, а не принимает props.

```tsx
// ✗ ПЛОХО — drilling
<ChannelsPanel>
  <ChannelsList displayName={x} initial={y} isAdmin={z} rooms={r} onDelete={d} />
</ChannelsPanel>

// ✓ ОК — leaf берёт сам
const ChannelsList = () => {
  const rooms = useRooms();
  // ...
};
```

**Не делать параметризированные generic компоненты.** Если контент статичный — пиши его прямо в компоненте, не передавай через prop:

```tsx
// ✗ НЕ ОК — text всегда один и тот же на месте вызова
<RoomLoader text="Loading room..." />

// ✓ ОК — два specific компонента
<RoomLoadingFallback />            // содержит "Loading room..." внутри
<RoomConnecting displayName="x" /> // только динамическая часть как prop
```

Pass через prop **только динамические значения**. Статичные строки — внутри компонента.

**Когда оставлять props:**

- Данные приходят из родителя который сам их получает по событию (`room` в `<ChannelsRoomItem room={room} />` из `.map`).
- UI state шеллов (`channelsOpened` в `ServerRail` — orchestrator state).
- Колбэк который требует контекст родителя.

`useCurrentUser` возвращает derived поля прямо в hook: `displayName`, `initial`, `isAdmin`, `isAuthenticated` — не вычисляй в каждом компоненте.

---

## 21. Server routes — OpenAPI

Server использует `@hono/zod-openapi`. Структура per-resource:

```text
apps/server/src/routes/
  shared/
    schemas.ts         ← errorSchema (общий)
  rooms/
    routes.ts          ← createRoute({...}) определения
    handlers.ts        ← RouteHandler<typeof route, Env>
    index.ts           ← OpenAPIHono().openapi(route, handler)
  livekit/
    ...
```

`routes.ts` чистый — только route definitions. `handlers.ts` — типизированные handlers через `RouteHandler<typeof route, Env>`. `index.ts` связывает.

Validation **внутри** `createRoute({ request: { body: { content: { ... schema } } } })` — не отдельный middleware `zValidator`. Все ответы (включая 4xx/5xx) описаны в `responses` с error schema.

Swagger UI на `/docs`, OpenAPI JSON на `/openapi.json`.

---

## 22. Запреты

- `console.log` оставлять в коммите (можно только локально для дебага). Biome ловит как `noConsole: warn`, в `shared/ui/**` и `scripts/**` правило отключено.
- `any` (Biome `noExplicitAny: error`). `unknown` вместо него.
- Non-null assertion `!` без обоснования (Biome `noNonNullAssertion: warn`).
- Deep imports мимо barrel.
- Cross-import между слайсами одного слоя.
- ESLint, Prettier, CSS-in-JS (emotion/styled-components). Только Biome (форматтер + линтер) + Tailwind.
- `axios` / ручной `fetch` для бизнес-вызовов. Только Hono RPC client (`shared/api/http`).
- Дублирование схем между client/server. Только `@solvex/schemas`.
- Самописный form state (`useState` для name/email/password). Только `react-hook-form`.
- Вложенные `if (...) return <X />` цепочки на 3+ ветки. Используй `ts-pattern` `match`.
- Drill пропсов когда leaf может сам вызвать hook.

---

## 18. Чек-лист перед коммитом

```bash
bun lint:fix                                  # Biome: формат + organize imports + safe lint fixes
bun lint                                       # Biome: проверка, должно быть 0 errors/warnings
cd apps/client && bunx tsc --noEmit           # типы client
cd apps/server && bunx tsc --noEmit           # типы server
bun --filter @solvex/client build             # сборка client
bun --filter @solvex/server build             # сборка server
```

Все green.

`bun lint:fix` (= `biome check --write`) чинит формат, импорты и безопасные lint-фиксы. Что он **не** чинит и надо глазами: пустые строки между логическими шагами (секция 16), порядок хуков (секция 11.1), FSD-границы импортов. Unsafe-фиксы (например сортировка Tailwind-классов в JSX) применяются только через `biome check --write --unsafe` — запускай точечно на конкретном файле и проверяй диф.
