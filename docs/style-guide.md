# Chatovo Style Guide

Проектные кодстайл-конвенции для `apps/client/`. Архитектурные правила — в [`docs/fsd.md`](./fsd.md).

Инструменты:

- **Biome** (`bun lint` / `bun lint:fix`) — форматтер + линтер + organize imports. Конфиг: корневой `biome.json`.
- **TypeScript** strict + `noUnusedLocals` + `noUnusedParameters`.
- FSD-границы и ряд React-конвенций держим руками + ловим на review (Biome не покрывает: порядок хуков, `padding-line-between-statements`, FSD cross-slice imports).

**Почему Biome:** один инструмент вместо ESLint+Prettier, на порядок быстрее, один конфиг без плагин-зоопарка. `useExhaustiveDependencies` и `useSortedClasses` (Tailwind) закрыты.

---

## 1. Структура слайса

Каждый слайс — папка с сегментами. Минимум — `ui/` + `index.ts`:

```
widgets/voice-room/
  index.ts          ← public API (barrel)
  ui/               ← React-компоненты
  model/            ← хуки, Zustand store, типы стейта
  lib/              ← чистые утилиты слайса
  api/              ← I/O-граница: подписки, мапперы, сервис-обёртки (если есть)
  config/           ← константы, конфиг
```

---

## 2. Структура `ui/` слайса

**Главный компонент** живёт плоско в `ui/`, файлы рядом:

```
widgets/voice-room/ui/
  VoiceRoom.tsx          ← JSX + entry-компонент
  VoiceRoom.types.ts     ← Props и локальные union-типы
  VoiceRoom.styles.ts    ← Tailwind class-строки / cva-варианты
```

**Подкомпоненты** (используются только внутри родителя) — каждый в папке `components/`:

```
widgets/channels-panel/ui/
  ChannelsPanel.tsx
  ChannelsPanel.styles.ts
  components/
    index.ts                   ← barrel: re-exports всех подкомпонентов
    ChannelsHeader/
      ChannelsHeader.tsx
      ChannelsHeader.types.ts
      ChannelsHeader.styles.ts
      index.ts                 ← `export { ChannelsHeader } from './ChannelsHeader';`
    ChannelsList/
      ...
```

Родитель импортирует через barrel:

```ts
// ✓ ОК
import { ChannelsHeader, ChannelsList } from './components';

// ✗ НЕ ОК
import { ChannelsHeader } from './components/ChannelsHeader';
```

**Правила файлов:**

- `.types.ts` — создаётся только если есть Props или локальные union-типы.
- `.styles.ts` — создаётся если 3+ Tailwind-классов в одном `className` (иначе inline, см. секцию 3).
- `shared/ui/` (shadcn) остаётся плоским (`button.tsx`, `input.tsx`) — не трогаем.

### Slice barrel

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

### Примеры

**`VoiceRoom.types.ts`:**

```ts
import type { DisconnectReason } from 'livekit-client';

export interface VoiceRoomProps {
  roomName: string;
  serverUrl: string;
  token: string;
  onConnectFailure: (reason: DisconnectReason) => void;
  onLeave: () => void;
}
```

**`VoiceRoom.styles.ts`** — два паттерна:

```ts
// A. Статичные классы
export const voiceRoomStyles = {
  root: 'flex h-full flex-col',
  header: 'flex items-center gap-2 border-b px-4 py-2',
} as const;

// B. Варианты с условиями
import { cva } from 'class-variance-authority';

export const channelItemStyles = cva(
  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm',
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

**`VoiceRoom.tsx`:**

```tsx
'use client';

import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

export const VoiceRoom = ({ token, serverUrl }: VoiceRoomProps) => (
  <div className={s.root}>
    <div className={s.header}>{/* ... */}</div>
  </div>
);
```

---

## 3. Tailwind: inline vs `styles.ts`

| Случай | Куда |
|---|---|
| 1-2 класса, не реюзается | inline в JSX |
| 3+ классов в одном `className` | `styles.ts` под именем |
| Условный класс (active/disabled/error) | `cva` в `styles.ts` |
| Один набор в 2+ местах | `styles.ts`, имя по семантике |
| `cn(...)` с 3+ аргументами | функция в `styles.ts` |

Принцип — JSX читается, `s.root`/`s.header` рассказывают структуру.

---

## 4. Размер компонента

**100 строк JSX-файла максимум.**

Перевалил — рефактор:

1. Подкомпоненты → `components/`.
2. Логика → `model/` (хук).
3. Утилиты → `lib/` слайса.

---

## 5. Naming

| Что | Как | Пример |
|---|---|---|
| Слайсы | kebab-case | `voice-room`, `channels-panel` |
| Сегменты | kebab-case | `ui`, `model`, `lib`, `api`, `config` |
| Папка компонента | PascalCase | `VoiceRoom/`, `ChannelsFooter/` |
| Файл компонента | PascalCase + `.tsx` | `VoiceRoom.tsx` |
| Файл типов | `<Name>.types.ts` | `VoiceRoom.types.ts` |
| Файл стилей | `<Name>.styles.ts` | `VoiceRoom.styles.ts` |
| Файл хука | kebab-case | `use-room-state.ts` |
| React-компонент (export) | PascalCase | `VoiceRoom` |
| Хук | `use` + camelCase | `useEnterRoom`, `useRoomState` |
| Утилита | camelCase | `groupMessages`, `formatTime` |
| Тип Props | `<Name>Props` | `VoiceRoomProps` |
| DTO тип | `<Name>Input/Output` | `EnterRoomInput` |

> Канон FSD: kebab-case для всех файлов. Chatovo отклонение: PascalCase для папок и файлов компонентов, kebab-case для хуков/утилит.

---

## 6. Импорты

### Алиасы

`@/` → корень `apps/client/`. Используем для всего кроме относительных в той же папке.

```ts
// 1-я группа: внешние пакеты + node:-builtins + @chatovo/*
import { useForm } from 'react-hook-form';
import type { Room } from '@chatovo/schemas/rooms';

// 2-я группа: @/ алиасы и относительные ./  ../ — вместе, без пустой строки
import { useCurrentUser } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { groupMessages } from '../lib/grouping';
import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';
```

Biome organize-imports (`bun lint:fix`) группирует так автоматически. Не воюй — формат после `lint:fix` и есть канон.

### Запреты

Deep import мимо barrel запрещён:

```ts
// ✗ ЗАПРЕЩЕНО
import { ChannelsList } from '@/widgets/channels-panel/ui/components/ChannelsList';

// ✓ ОК
import { ChannelsPanel } from '@/widgets/channels-panel';
```

Исключения: `@/shared/ui/<primitive>` (shadcn-конвенция), внутри слайса — относительные ОК.

Biome не проверяет FSD-границы — ловим на review.

---

## 7. Barrel-экспорты (`index.ts`)

**Слайс:**

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

Только то, что нужно снаружи. Внутренние подкомпоненты — не экспортируем.

**Папка компонента:**

```ts
// ui/VoiceRoom/index.ts
export { VoiceRoom } from './VoiceRoom';
export type { VoiceRoomProps } from './VoiceRoom.types';
```

Wildcard-экспорты (`export * from`) — запрещены. Только явные именованные.

---

## 8. Типы

- **Props — `interface`**, остальное — `type` (unions, алиасы, DTO).
- Props всегда в `<Name>.types.ts` рядом с компонентом.
- `import type { ... }` — Biome enforce (`useImportType: error`), `bun lint:fix` чинит сам.
- `export type { ... }` — Biome enforce (`useExportType: error`).
- `unknown` вместо `any`. `any` запрещён (`noExplicitAny: error`).
- Discriminated unions для вариантов состояния:

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number; mime: string };
```

---

## 9. React-конвенции

- Функциональные компоненты, arrow-функции.
- `'use client'` в каждом файле с хуками/state/event handlers.
- React Compiler включён — не нужны `useMemo`/`useCallback` для микро-оптимизаций. Оставляем только для семантического stable ref (зависимости `useEffect`, key в Map).
- Обработчики событий — `on<Event>` camelCase: `onSubmit`, `onSelectRoom`.

### 9.1 Порядок хуков

Biome не сортирует хуки — соблюдаем руками + ловим на review.

Порядок групп:

1. **Navigation** — `useRouter`, `usePathname`, `useSearchParams`, `useParams`.
2. **Store / context** — `useCurrentUser`, `useAuthStore`, любые `use<Name>Store`.
3. **Data** — TanStack Query/Mutation хуки.
4. **State** — `useState`, `useReducer`.
5. **Ref** — `useRef`.
6. **Memo / callbacks** — `useMemo`, `useCallback`, `useTransition`, `useId`.
7. **Effects** — `useEffect`, `useLayoutEffect`.
8. **Derived const** — `const x = params.get(...)`, распакованные значения хуков.

Между группами — пустая строка. Внутри группы — без пустой.

```tsx
export const ChannelsPanel = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { user, isAdmin } = useCurrentUser();

  const rooms = useRooms();
  const deleteMutation = useDeleteRoom();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    // ...
  }, [rooms.data]);

  const activeRoom = params.get('name');

  return /* ... */;
};
```

**Правила перестановки:**

- Не переставляй хук с data dependency: если `name` нужен `useRoomToken({ roomName: name })` — `name` обязан быть до хука. Если порядок групп противоречит — оставь как есть, пометь `// data dep: name → query`.
- `if (...) useFoo()` — это баг `rules-of-hooks`, чинить, не сортировать.

**Кастомные хуки** — по семантике содержимого: `useRooms` (делает `useQuery`) → группа Data; `useCurrentUser` (обёртка контекста) → группа Store; `useDocumentTitle` (эффект) → группа Effects.

### 9.2 Зависимости хуков / Effects

`deps`-массив `useEffect` — только то, что **реально должно триггерить перезапуск** эффекта. Знаем что эффекту нужен один `roomId` — не добавляем `room`, `router`, объекты мутаций «чтобы линтер молчал».

**Стабильные ref не идут в deps.** `router` из `next/navigation`, `reset`/`mutate` из react-query стабильны между рендерами. Добавлять их смысла нет — эффект не должен реагировать на их «смену». `// biome-ignore lint/correctness/useExhaustiveDependencies` с явной причиной — нормальная практика, не костыль.

```tsx
// ✗ ПЛОХО — лишние deps, объект мутации меняет ref каждый рендер
useEffect(() => {
  if (!roomId) router.replace(ROUTES.lobby);
}, [roomId, room, router, tokenMutation]);

// ✓ ОК — триггер только roomId, причина зафиксирована
// biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on roomId change; router is a stable ref
useEffect(() => {
  if (!roomId) router.replace(ROUTES.lobby);
}, [roomId]);
```

**Антипаттерн: `useEffect` + `mutate` для загрузки данных.** Объект мутации в deps → новый ref каждый рендер → рефетч-циклы. Декларативную загрузку делать через `useQuery` с ключом (`queryKey: [roomId]`) — react-query сам рефетчит при смене ключа, `useEffect` и `reset()` не нужны.

### 9.3 Деструктуризация результатов query / mutation

Результат `useQuery` / кастомного query-хука **деструктурируем сразу**, не носим объект и не лазаем через точку:

```tsx
// ✗ ПЛОХО — доступ через точку, объект-обёртка не нужен
const roomById = useRoomById(roomId);
const room = roomById.data;
// ... roomById.isLoading, roomById.isError

// ✓ ОК — деструктуризация на месте, переименование под смысл
const { data: room, isLoading } = useRoomById(roomId);
const { data: publicTokenData, isError: publicTokenFailed } = usePublicRoomToken(roomId, enabled);
```

`data` почти всегда переименовываем (`data: room`) — голое `data` не несёт смысла.

**Исключение — `useMutation`.** Объект мутации оставляем цельным: нужны и поля (`isPending`, `isError`, `error`, `data`), и методы (`mutateAsync`, `reset`). Деструктуризация 5+ имён хуже читается, а методы всё равно зовём как `tokenMutation.reset()`.

```tsx
// ✓ ОК — mutation остаётся объектом
const tokenMutation = useRoomTokenMutation();
// ... tokenMutation.isPending, tokenMutation.mutateAsync(...), tokenMutation.reset()
```

---

## 10. Сегменты `model/`, `lib/`, `api/`

**`model/`** — хуки, Zustand store, типы стейта:

```
entities/room/model/
  use-enter-room.ts
  use-room-token.ts
  types.ts
```

Файлы — kebab-case. Функции внутри — camelCase.

**`lib/`** — чистые функции без React-зависимостей:

```
entities/room/lib/
  cache.ts       ← readRoomTokenCache / writeRoomTokenCache
  validation.ts  ← isRoomNameValid
```

Если функция возвращает JSX — это компонент, переместить в `ui/`.

**`api/` в слайсе** — интеграция с внешним сервисом, привязанная к домену слайса: подписки, мапперы, сервис-специфичные обёртки. Отличие от `model/` — `api/` это I/O-граница (network, realtime, push-сервис), `model/` — хуки и типы стейта.

```
entities/user/
  api/
    auth-bridge.ts   ← subscribeAuth: подписка на supabase.auth.onAuthStateChange
  model/
    use-current-user.ts
    types.ts
```

Эвристика: код **слушает/шлёт** во внешний сервис → `api/`. Код **читает/выводит** доменный стейт → `model/`. Project-agnostic RPC-клиент (не привязан к домену) → `shared/api/` (ниже).

**`api/` в `shared/`** — Hono RPC wrappers:

```
shared/api/
  http/      ← hc<App>(baseUrl) + auth header
  rooms/     ← listRooms / createRoom / deleteRoom
  livekit/   ← fetchLiveKitToken
  auth/      ← getFreshAccessToken
  supabase/  ← supabase browser client
  index.ts
```

HTTP через Hono RPC client. `fetch` руками — теряется типизация. `axios` — удалён.

```ts
export const createRoom = async (input: CreateRoomInput): Promise<Room> => {
  const res = await api.api.rooms.$post({ json: input });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `Failed to create room: ${res.status}`);
  }

  return res.json();
};
```

---

## 11. Tailwind v4

- Темы — CSS variables в `globals.css` (`:root` + `.dark`).
- Тёмная тема — `<html className="dark">` хардкодом (несовместимо с `next-themes` + Tauri).
- Canonical-классы вместо arbitrary: `w-18` вместо `w-[72px]`.
- `cn()` из `@/shared/lib/cn` для склейки условных классов.

---

## 12. Пустые строки между логическими шагами

Biome не автофиксит `padding-line-between-statements`. Соблюдаем руками.

**Пустая строка перед:**

- `return` (если не первый statement)
- `throw`
- `if` (early-return guard или branching)
- `await` после которого идёт логически отдельный шаг
- `try` / `for` / `while` / `switch`

**После `if`-блока** — пустая строка перед следующим statement.

```ts
// ✓
const trimmed = room.trim();

if (!trimmed) throw new Error('Room name required');

const accessToken = await getFreshAccessToken();
const { token, url } = await fetchLiveKitToken({ room: trimmed }, accessToken);

writeRoomTokenCache(trimmed, { token, url });
router.push(`/room?name=${encodeURIComponent(trimmed)}`);
```

```ts
// ✓ множественные return
if (!name) return null;

if (query.isLoading) {
  return <Loader />;
}

return <VoiceRoom />;
```

**Исключения** (пустая НЕ нужна):

- Один statement в блоке.
- Однотипные single-line guards подряд:
  ```ts
  if (!a) return null;
  if (!b) return null;
  if (!c) return null;
  ```
- Последовательные `const` одного смыслового блока.

---

## 13. Shared схемы — `@chatovo/schemas`

Zod схемы и типы, общие для client/server, — в `packages/schemas`:

```
packages/schemas/src/
  rooms/
    inputs.ts    ← createRoomInputSchema
    outputs.ts   ← roomSchema
    types.ts     ← Room, CreateRoomInput, CreateRoomRawInput
    index.ts
  livekit/
    ...
```

```ts
// ✓ ОК
import { createRoomInputSchema, type Room } from '@chatovo/schemas/rooms';

// ✗ НЕ ОК
import { Room } from '@/shared/api';
```

`@/shared/api` экспортирует только runtime функции (RPC wrappers, supabase client).

**FormValues vs Request типы.** Одна zod-схема даёт два типа — `.default()` / `.transform()` делают `z.input` и `z.output` несовместимыми:

- `CreateRoomFormValues = z.input<typeof schema>` — форма данных **до** валидации, для `defaultValues` формы.
- `CreateRoomRequest = z.output<typeof schema>` — форма **после** валидации (default применён, transform отработал), для submit / API body.

Это ось «стадия валидации», не «HTTP request/response». Response-тип сущности — отдельный (`Room`), не `z.output` инпут-схемы.

---

## 14. Формы — react-hook-form + zodResolver

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createRoomInputSchema, type CreateRoomInput, type CreateRoomRawInput } from '@chatovo/schemas/rooms';

const DEFAULT_VALUES: CreateRoomRawInput = { name: '', isPrivate: false };

const { formState: { errors }, handleSubmit, register, reset } = useForm<
  CreateRoomRawInput,
  unknown,
  CreateRoomInput
>({
  resolver: zodResolver(createRoomInputSchema),
  defaultValues: DEFAULT_VALUES,
});
```

- Схема — в `@chatovo/schemas/<resource>`, не inline в форме.
- Server-side ошибки — `setError('field', { message: err.message })`.
- Boolean toggles вне формы — `useBoolean` из `@siberiacancode/reactuse`, не `useState`.

---

## 15. Conditional render — ts-pattern

3+ ветки render → `match`, не вложенные `if (...) return <X />` и не цепочки тернарников в JSX.

Что матчить — два варианта, оба ОК:

**A. На discriminated union из хука.** Хук собирает `state`-union, view только `match`. Берём когда логика сборки объёмна или переиспользуется:

```tsx
import { match } from 'ts-pattern';

return match(state)
  .with({ kind: 'loading' }, () => <RoomLoadingFallback />)
  .with({ kind: 'active' }, ({ token, url }) => <VoiceRoom token={token} serverUrl={url} />)
  .exhaustive();
```

`.exhaustive()` даёт TS-ошибку если добавили вариант union но забыли case.

**B. На объекте сырых хуков.** `match` прямо на `{ ...поля хуков }`, паттерны через `P.nullish` / `P.string` и т.п. Берём когда веток немного, логика компактна, отдельный хук-слой был бы лишней церемонией:

```tsx
import { match, P } from 'ts-pattern';

const { data: room, isLoading } = useRoomById(roomId);
const { data: publicTokenData } = usePublicRoomToken(roomId, !!room && !room.isPrivate);
const tokenData = room?.isPrivate ? tokenMutation.data : publicTokenData;

return match({ roomId, isLoading, room, tokenData })
  .with({ roomId: P.nullish }, () => null)
  .with({ room: P.nullish, isLoading: true }, () => <RoomLoadingFallback />)
  .with({ room: P.nullish }, () => <RoomNotFound />)
  .with({ tokenData: P.nullish }, () => <RoomConnecting />)
  .with({ tokenData: P.nonNullable, room: P.nonNullable }, ({ tokenData }) => (
    <VoiceRoom serverUrl={tokenData.url} token={tokenData.token} />
  ))
  .exhaustive();
```

Порядок `.with` важен — первый совпавший паттерн выигрывает. Узкие значения в хендлерах
бери из аргумента `match` (он narrowed), не из замыкания и не через `as` — каст обходит
проверку типов.

**Запрещено в любом случае** — `if`/тернарник-цепочки, собирающие JSX:

```tsx
// ✗ НЕ ОК — condition hell в view
return !roomId ? null : roomById.isLoading ? <Loading /> : !room ? <NotFound /> : <Room />;
```

**Когда выносить в хук:** сборка state переиспользуется в 2+ местах, либо тело логики
настолько объёмно, что view перестаёт читаться. Иначе вариант B инлайн в view — норма.

---

## 16. Drill cleanup

Если данные доступны через глобальный хук — leaf берёт сам, не принимает props:

```tsx
// ✗ ПЛОХО — drilling
<ChannelsList displayName={x} isAdmin={z} rooms={r} onDelete={d} />

// ✓ ОК
const ChannelsList = () => {
  const rooms = useRooms();
  const { displayName, isAdmin } = useCurrentUser();
  // ...
};
```

**Не делать generic параметризированные компоненты** для статичного контента:

```tsx
// ✗ НЕ ОК — text всегда один и тот же
<RoomLoader text="Loading room..." />

// ✓ ОК
<RoomLoadingFallback />   // текст внутри
<RoomConnecting displayName="x" /> // только динамическая часть
```

**Оставляем props когда:**

- Данные приходят из `.map` (`<ChannelsRoomItem room={room} />`).
- UI state оркестратора (`channelsOpened` в `ServerRail`).
- Колбэк требует контекст родителя.

---

## 17. Server routes — OpenAPI

```
apps/server/src/routes/
  rooms/
    routes.ts    ← createRoute({...}) определения
    handlers.ts  ← RouteHandler<typeof route, Env>
    index.ts     ← OpenAPIHono().openapi(route, handler)
  shared/
    schemas.ts   ← errorSchema
```

- `routes.ts` — только route definitions.
- Validation внутри `createRoute({ request: { body: { content: { ... schema } } } })`, не отдельный `zValidator`.
- Все ответы (включая 4xx/5xx) описаны в `responses`.

---

## 18. Запреты

- `console.log` в коммите. Biome `noConsole: warn` (`shared/ui/**`, `scripts/**` — off).
- `any` — Biome `noExplicitAny: error`. Используй `unknown`.
- Non-null assertion `!` без обоснования — Biome `noNonNullAssertion: warn`.
- Deep imports мимо barrel.
- Cross-import между слайсами одного слоя.
- ESLint, Prettier, CSS-in-JS. Только Biome + Tailwind.
- `axios` / ручной `fetch` для бизнес-вызовов. Только Hono RPC client.
- Дублирование схем client/server. Только `@chatovo/schemas`.
- `useState` для form fields. Только `react-hook-form`.
- Вложенные `if (...) return <X />` на 3+ ветки. Используй `ts-pattern match`.
- Prop-drilling когда leaf может вызвать хук сам.

---

## 19. Чек-лист перед коммитом

```bash
bun lint:fix                               # Biome: формат + organize imports + safe fixes
bun lint                                   # должно быть 0 errors/warnings
cd apps/client && bunx tsc --noEmit        # типы client
cd apps/server && bunx tsc --noEmit        # типы server
bun --filter @chatovo/client build          # сборка client
bun --filter @chatovo/server build          # сборка server
```

`bun lint:fix` не чинит: пустые строки (секция 12), порядок хуков (секция 9.1), FSD-границы импортов (→ [`docs/fsd.md`](./fsd.md)). Для unsafe-фиксов (Tailwind sort): `biome check --write --unsafe <file>` — точечно с проверкой диффа.
