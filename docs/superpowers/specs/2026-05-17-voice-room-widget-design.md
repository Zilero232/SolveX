# VoiceRoom: самодостаточный виджет + чистый use-room-state

Дата: 2026-05-17
Слой работы: `apps/client` (FSD: `widgets/voice-room`, `views/room`, `entities/room`) + `docs/style-guide.md`.

## Проблема

1. `use-room-state` содержит два `useEffect` с раздутыми зависимостями: один на `reset()` мутации при смене `roomId`, второй на императивный `mutate` токена. Зависимости включают объекты (`room`, `tokenMutation`, `router`), которые не являются настоящими триггерами эффекта. Это шумно и провоцирует рефетч-циклы.
2. `choices` (`LocalUserChoices`) собирается в `use-room-state` и прокидывается в `VoiceRoom` пропом `userChoices`. По факту объект статичен: `audioEnabled: true`, `videoEnabled: false`, все device-id пустые. Динамичен только `username` (из `session.user.email`). Прокидывать целый объект бессмысленно.
3. `VoiceRoom` не самодостаточен: обёртки `<div root>` / `<div frame>` живут в `RoomPage`, виджет принимает лишние данные пропами.

## Цель

- `use-room-state` без лишних `useEffect`-зависимостей; запрос токена публичной комнаты переведён с императивного `useEffect`+`mutate` на декларативный `useQuery`.
- `VoiceRoom` — готовый самодостаточный виджет: сам берёт `username`, хардкодит статичные `choices`, содержит обёртки `root`/`frame`.
- В `docs/style-guide.md` зафиксировано правило про минимальные зависимости хуков.

## Подход

Гибрид токен-flow (выбран из 2 вариантов):

- **Публичная комната** — `useQuery` с ключом `[roomId]`. React-query сам рефетчит при смене ключа, `reset()` и `useEffect` не нужны.
- **Приватная комната** — `useMutation` остаётся: токен запрашивается императивно после ввода пароля в password-форме. У query нет места для input-пароля, поэтому mutation для этого flow сохраняется.

Чистый query не покрывает оба flow — отсюда split хука на два.

## Изменения

### 1. `entities/room` — split token-хука

**`use-room-token.ts`** — переименовать экспорт `useRoomToken` → `useRoomTokenMutation`. Тело mutation без изменений. Используется только приватным flow (submit пароля).

**`use-public-room-token.ts`** (новый) — query для публичной комнаты:

```ts
import { useQuery } from '@tanstack/react-query';

import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const usePublicRoomToken = (roomId: string | null, enabled: boolean) =>
  useQuery({
    queryKey: QUERY_KEYS.roomToken(roomId),
    queryFn: () => fetchLiveKitToken({ roomId: roomId as string }),
    enabled: enabled && !!roomId,
    staleTime: 0,
  });
```

`QUERY_KEYS.roomToken(roomId)` — добавить в `shared/constants` (по образцу `QUERY_KEYS.rooms()`).

**`index.ts`** — экспорт `useRoomTokenMutation` + `usePublicRoomToken`.

### 2. `use-room-state.ts`

- Удалить оба `useEffect` с `reset()` и `mutate`. Удалить `reset()`.
- Публичный токен: `usePublicRoomToken(roomId, !!room && !room.isPrivate)`.
- Приватный токен: `useRoomTokenMutation()` — только для `onSubmit` password-формы.
- Редирект `!roomId → ROUTES.lobby` остаётся как **единственный** `useEffect`, deps строго `[roomId]` (router — стабильный ref, в deps не идёт, `// biome-ignore` с причиной).
- `choices` удаляется из хука целиком. Тип `RoomState.active` теряет поле `choices`, импорт `LocalUserChoices` уходит.
- `useCurrentUser` / `session` в хуке больше не нужны (username переехал в VoiceRoom) — удалить.
- Состояния `loading` / `not-found` / `password` / `connecting` / `active` маппятся на статусы query (`isLoading`, `data`, `isPending`) и mutation для приватной ветки.

### 3. `VoiceRoom`

**`VoiceRoom.types.ts`** — убрать `userChoices` и импорт `LocalUserChoices`. Итог:

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

**`VoiceRoom.tsx`**:

- `audio` хардкодится `true`, `video` — `false`. `userChoices.*` удаляются: `audio={true}`, `video={false}`.
- Обёртки `root` (`h-full p-4`) и `frame` (`flex h-full flex-col overflow-hidden rounded-lg border`) переезжают из `RoomPage` внутрь `VoiceRoom`, оборачивают `LiveKitRoom`.
- `useCurrentUser` в `VoiceRoom` **не добавляется**: `username` нигде в виджете не использовался (проверено grep — только в сборке `choices`-объекта), а identity участника несёт JWT-токен с сервера.

**`VoiceRoom.styles.ts`** — добавить `root` и `frame`. Существующий `root` (`flex h-full flex-col`) переименовать в `room` (это класс самого `LiveKitRoom`), чтобы не было коллизии с новой внешней обёрткой `root`.

### 4. `RoomPage.tsx`

- Удалить локальный объект `styles` (`root` / `frame`).
- `active`-ветка: `<VoiceRoom key={roomId} roomName={displayName} serverUrl={url} token={token} onConnectFailure={...} onLeave={onLeave} />` — без `userChoices`, без внешних `<div>`.

### 5. `docs/style-guide.md` — новый раздел 9.2 «Зависимости хуков / Effects»

Вставить после раздела «9.1 Порядок хуков». Содержание:

- **Правило:** в `deps` `useEffect` — только то, что реально должно триггерить перезапуск. Знаем что эффекту нужен только `roomId` — не добавляем `room`, `router`, мутации «чтобы линтер молчал».
- Стабильные ref (`router` из next, `reset`/`mutate` из react-query) — стабильны между рендерами; добавлять их в deps смысла нет, эффект не должен реагировать на их «смену». `// biome-ignore lint/correctness/useExhaustiveDependencies` с явной причиной — нормальная практика, не костыль.
- Антипаттерн: объект мутации/`tokenMutation` целиком в deps → новый ref каждый рендер → рефетч-циклы. Декларативную загрузку делать через `useQuery` с ключом, а не `useEffect` + `mutate`.
- Пример до/после на `roomId`-эффекте.

## Тестирование

Проект тестов не содержит (проверено по структуре). Верификация — ручная по чек-листу style-guide §19:

```bash
bun lint:fix && bun lint
cd apps/client && bunx tsc --noEmit
bun --filter @solvex/client build
```

Плюс smoke: вход в публичную комнату, вход в приватную (пароль), смена комнаты (key+рефетч токена), fail-коннект.

## Вне scope

- Реальный выбор устройств (device picker) — `choices` намеренно хардкодятся.
- Видео-flow — остаётся `false`.
- Рефактор password-формы.

---

## Ревизия 2 (2026-05-17) — расформировать хук-слой, отдельный запрос комнаты

После реализации разделов 1, 3, 4 (закоммичено: split token-хука + самодостаточный
`VoiceRoom` + чистый `RoomPage`) принято решение продолжить рефактор:

1. **`use-room-state` удаляется как слой.** Хук-обёртка признана лишней. Вся логика
   (хуки данных + эффекты-редиректы + сборка `RoomState` union) переезжает прямо
   в `RoomPage`. Файл `views/room/model/use-room-state.ts` удаляется.
2. **Получение комнаты — отдельным запросом.** `useRooms()` + `.find()` заменяется
   на `useRoomById(roomId)` — `useQuery` за одной комнатой. Требует нового
   серверного эндпоинта `GET /rooms/:id`.

### R2.A — серверный `GET /rooms/:id`

- `apps/server/src/routes/rooms/routes.ts` — `getRoomRoute`: `method: 'get'`,
  `path: '/{id}'`, `request: { params: idParamSchema }` (idParamSchema уже есть),
  responses `200 → roomSchema`, `404 → errorSchema`.
- `apps/server/src/routes/rooms/handlers.ts` — `getRoomHandler`:
  `prisma.room.findUnique({ where: { id }, select: { id: true, name: true, isPrivate: true } })`;
  нет → `c.json({ error: 'Room not found' }, 404)`.
- `apps/server/src/routes/rooms/index.ts` — `.openapi(getRoomRoute, getRoomHandler)`.
- Схема не меняется — `roomSchema` уже описывает `id/name/isPrivate`. Миграции БД нет.

### R2.B — клиентский RPC + хук

- `apps/client/shared/api/rooms/rooms.ts` — `getRoom(id: string): Promise<Room>`
  через `api.api.rooms[':id'].$get({ param: { id } })`; `!res.ok` → `throw` с
  сообщением из тела (по образцу `deleteRoom`).
- `apps/client/shared/api/rooms/index.ts` — добавить `getRoom` в экспорт.
- `apps/client/shared/constants/query-keys.ts` — новый ключ
  `room: (id: string | null) => ['room', id] as const`.
- `apps/client/entities/room/model/use-room-by-id.ts` (новый):

```ts
import { useQuery } from '@tanstack/react-query';

import { getRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRoomById = (roomId: string | null) =>
  useQuery({
    queryKey: QUERY_KEYS.room(roomId),
    queryFn: () => getRoom(roomId as string),
    enabled: !!roomId,
    retry: false,
  });
```

- `entities/room/index.ts` — экспорт `useRoomById`.

### R2.C — расформировать хук, всё инлайн в `RoomPage`

- Удалить `apps/client/views/room/model/use-room-state.ts`.
- Тип `RoomState` переезжает в `apps/client/views/room/ui/RoomPage.types.ts`
  (FSD §2 — union-тип рядом с компонентом).
- `RoomPage.tsx` инлайн содержит: `useRouter`, `useSearchParams`, `useRoomById`,
  `useRoomTokenMutation`, `usePublicRoomToken`; `roomId` из params; 2 `useEffect`
  редиректа (нет `roomId` → lobby; `publicToken.isError` → lobby); сборку
  `RoomState` union перед `return match(state)`.
- `publicToken` enabled-условие: `usePublicRoomToken(roomId, !!room && !room.isPrivate)`,
  где `room` — `roomById.data`.
- Ветки маппинга: `roomById.isLoading` → `loading`; `roomById.isError` → `not-found`;
  приватная без токена → `password`; нет токена → `connecting`; есть → `active`.

### R2.D — style-guide §15

§15 сейчас абсолютно запрещает «condition hell в view» и требует derived state
в хуке. Поскольку Ревизия 2 осознанно убирает хук и собирает state инлайн в `RoomPage`,
§15 переформулируется: сборка discriminated-union state допустима инлайн в view,
если она компактна, не переиспользуется и view остаётся читаемым; хук выделяют
когда логика переиспользуется или объёмна. Абсолютный запрет снимается, даётся критерий.

### Вне scope ревизии 2

- `useRooms` (list) остаётся — используется `channels-panel` и др.
- Авторизация/доступ к приватной комнате на `GET /rooms/:id` — эндпоинт отдаёт
  метаданные (`id/name/isPrivate`) как и `listRooms`, без `passwordHash`. Не меняем модель доступа.
