# Деплой Chatovo на Timeweb Cloud

Документ описывает, как развернуть Chatovo на одном VPS Timeweb Cloud
и настроить автоматический деплой через GitHub Actions.

## Архитектура

Всё работает на одном VPS. Сайт, API и LiveKit разнесены по поддоменам одного
домена `chatovo.ru`:

| Поддомен | Что отдаёт |
|----------|------------|
| `chatovo.ru` | Статика веб-клиента |
| `api.chatovo.ru` | Hono API (Bun) |
| `livekit.chatovo.ru` | LiveKit SFU (WSS-сигналинг) |

Клиент и сервер упакованы в Docker-образы — образы собираются в CI и
публикуются в приватном реестре GitHub Container Registry (ghcr.io). VPS
ничего не собирает: он только скачивает готовые образы и запускает их.

```text
   push в master
        │
        ▼
   GitHub Actions:  собирает 2 образа  ──►  ghcr.io (приватный реестр)
        │                                        │
        │ SSH                                    │ pull
        ▼                                        ▼
   ┌──────────────── VPS (Timeweb Cloud) ─────────────────┐
   │                                                       │
   │  web     — Caddy + статика клиента, держит HTTPS для  │
   │            chatovo.ru / api.chatovo.ru /              │
   │            livekit.chatovo.ru; порты 80/443 наружу    │
   │  server  — Hono на Bun, :4000 (только внутри сети)    │
   │  livekit — SFU, host networking, 7881/tcp + UDP-медиа │
   │                                                       │
   └───────────────────────────────────────────────────────┘
                              │
          postgres — самостоятельный PostgreSQL в этом же compose
```

- **Клиент** — Next.js со `output: 'export'`. Образ `chatovo-web` собирает
  статику и раздаёт её через встроенный Caddy, который терминирует HTTPS
  для всех трёх поддоменов. Это единственный контейнер, смотрящий в интернет.
- **Сервер** — Hono на Bun. Образ `chatovo-server`, слушает порт 4000 только
  внутри docker-сети — снаружи доступен лишь через `web` (Caddy проксирует
  `api.chatovo.ru` → `server:4000`).
- **LiveKit** — свой SFU на этом же VPS, контейнер `livekit/livekit-server`.
  Caddy проксирует `wss://livekit.chatovo.ru` на сигнальный порт. Media-трафик
  WebRTC идёт напрямую через UDP-диапазон 50000–50100 (см. ниже).
- **Реестр** — образы `chatovo-web` и `chatovo-server` хранятся в приватном
  ghcr.io. CI публикует их встроенным `GITHUB_TOKEN`; VPS скачивает по личному
  токену (PAT). Образ LiveKit берётся напрямую с Docker Hub.
- **БД** — самостоятельный PostgreSQL, контейнер `postgres` в этом же compose
  (данные в volume `pgdata`). Авторизация — better-auth поверх этой же БД.
  Схема управляется вручную командой `bun db:push` с машины разработчика.
- **Tauri** — десктоп-приложение собирается локально, на хостинг не идёт.

```text
   Браузер / Tauri
        │
        │ HTTPS + WSS
        ▼
   ┌──────── VPS ────────────────────────────────────────────────┐
   │                                                             │
   │  Caddy (контейнер web)                                       │
   │     • chatovo.ru          → статика веб-клиента              │
   │     • api.chatovo.ru      → server:4000 (Hono)               │
   │     • livekit.chatovo.ru  → host.docker.internal:7880 (WSS) │
   │                                                             │
   │  livekit (host network)                                      │
   │     • :7880/tcp       WebSocket signalling (за Caddy)        │
   │     • :7881/tcp       TURN/TCP fallback (наружу)             │
   │     • :50000-50100/udp  WebRTC media (наружу)                │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘
```

## Переменные окружения — как это работает

Используется **один файл `.env`** — и локально, и на VPS. Различаются только
значения внутри. В git коммитится только шаблон `.env.example`.

Серверные переменные:

1. На VPS ты создаёшь файл `.env` в рабочей папке (`/opt/chatovo/.env`) —
   за образец берёшь `apps/server/.env.example` из репозитория. Файл лежит
   физически на сервере, в git его нет.
2. При запуске контейнера Docker читает его — строка `env_file: ./.env`
   в `docker-compose.yml` — и кладёт переменные в окружение процесса.
3. Сервер читает их через `process.env`, Zod-схема (`apps/server/src/lib/env.ts`)
   проверяет, что всё на месте.

Клиентские переменные (`NEXT_PUBLIC_*`):

- Впекаются в статику **в момент сборки** образа клиента. CI передаёт их в
  `docker build` как build-args, беря значения из GitHub Secrets. Это не
  секреты — они всё равно видны в браузерном бандле.

## Что лежит в репозитории

| Файл | Назначение |
|------|------------|
| `apps/client/Dockerfile` | Образ клиента: сборка статики + Caddy; собирается в CI |
| `apps/server/Dockerfile` | Образ сервера (Bun + Prisma); собирается в CI |
| `infra/caddy/Caddyfile` | Конфиг Caddy (копируется внутрь образа клиента) |
| `infra/livekit/livekit.yaml` | Шаблон конфига self-hosted LiveKit-сервера |
| `infra/caddy/README.md` | Этот документ — инструкция по деплою |
| `docker-compose.yml` | Запуск web + server + livekit на VPS (образы из ghcr.io) |
| `.github/workflows/deploy.yml` | CI/CD: lint → сборка образов → деплой |
| `apps/server/.env.example` | Шаблон переменных сервера |
| `apps/client/.env.example` | Шаблон переменных клиента (web и Tauri) |

---

## Часть 1. Подготовка VPS (один раз)

### 1.1. Создать сервер

В панели Timeweb Cloud создайте облачный сервер:

- ОС: **Ubuntu 24.04 LTS**
- Тариф: минимум **1 vCPU / 2 ГБ RAM** (VPS только запускает образы — сборка
  идёт в CI, поэтому много ресурсов не нужно).
- Запишите выданный публичный **IP-адрес**.

### 1.2. Настроить DNS

В настройках домена `chatovo.ru` добавьте A-записи на IP сервера:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `@` | `<IP сервера>` |
| A | `www` | `<IP сервера>` |
| A | `api` | `<IP сервера>` |
| A | `livekit` | `<IP сервера>` |

Дождитесь распространения (`ping chatovo.ru` отдаёт ваш IP). Поддомены:

- `api.chatovo.ru` — основной HTTPS-эндпоинт API;
- `livekit.chatovo.ru` — для собственного LiveKit-сервера (см. раздел
  "Self-hosted LiveKit"; если используете LiveKit Cloud — A-запись `livekit`
  можно пропустить).

> Это обязательно: Caddy не сможет выпустить TLS-сертификат, пока домен
> не указывает на сервер.

### 1.3. Установить Docker и открыть порты

Подключитесь по SSH (`ssh root@<IP>`):

```bash
# Docker + compose plugin
curl -fsSL https://get.docker.com | sh

# Открыть порты:
#   80/443       — Caddy (HTTPS + выпуск сертификата)
#   7881/tcp     — LiveKit TURN/TCP fallback
#   50000-50100/udp — LiveKit WebRTC media
ufw allow OpenSSH \
  && ufw allow 80/tcp && ufw allow 443/tcp \
  && ufw allow 7881/tcp && ufw allow 50000:50100/udp \
  && ufw --force enable
```

> Если LiveKit на сервере **не нужен** (используется LiveKit Cloud) —
> 7881/tcp и UDP-диапазон можно не открывать. См. раздел "Self-hosted LiveKit".

> Git на VPS не нужен — репозиторий сюда не клонируется. CI сам копирует
> `docker-compose.yml` на сервер при каждом деплое.

### 1.4. Создать рабочую папку

VPS не хранит код проекта. Нужна лишь одна папка, в которой будут жить
два файла: `docker-compose.yml` (его кладёт CI) и `.env` (создаёте вручную).

```bash
mkdir -p /opt/chatovo
```

> Путь `/opt/chatovo` — произвольный, он же `DEPLOY_PATH` в секретах GitHub.

### 1.5. Создать файл переменных сервера

В папке `/opt/chatovo` создайте файл `.env`. За образец возьмите шаблон
`apps/server/.env.example` из репозитория (откройте его на GitHub):

```bash
nano /opt/chatovo/.env
```

Впишите реальные значения для better-auth (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
`GOOGLE_CLIENT_ID/SECRET`), Postgres (`DATABASE_URL`/`DIRECT_URL`) и LiveKit,
поставьте `NODE_ENV=production`,
а **`CORS_ORIGINS=https://chatovo.ru`** — без этого браузер будет блокировать
запросы со страницы сайта к `api.chatovo.ru`. Файл `.env` лежит только на VPS,
в git его нет. `docker-compose.yml` ожидает его рядом с собой — поэтому он
именно `/opt/chatovo/.env`.

### 1.6. Создать файл livekit.yaml (только для self-hosted LiveKit)

Если планируете использовать LiveKit Cloud — пропустите этот шаг и в `.env`
впишите `LIVEKIT_URL=wss://<project>.livekit.cloud` с ключами из дашборда Cloud.

Для собственного LiveKit-сервера в той же папке `/opt/chatovo` создайте файл
`livekit.yaml` по образцу `infra/livekit/livekit.yaml` из репозитория.
Подробности — в разделе "Self-hosted LiveKit" ниже.

### 1.7. Проверить домен в Caddyfile

Домен зашит в образ клиента при сборке. Если домен не `chatovo.ru` — поправьте
`infra/caddy/Caddyfile` (включая блок `livekit.chatovo.ru`) ДО первого прогона CI.

### 1.8. Логин в GitHub Container Registry

Образы приватные, поэтому VPS должен один раз авторизоваться в ghcr.io.
Нужен Personal Access Token — как его создать, см. раздел 2.2.

Получив токен, на VPS выполните:

```bash
echo "<ВАШ_PAT>" | docker login ghcr.io -u <ВАШ_GITHUB_ЛОГИН> --password-stdin
```

Docker сохранит авторизацию — повторять при каждом деплое не нужно.

> Имена образов в `docker-compose.yml` — `ghcr.io/zilero232/chatovo-web` и
> `ghcr.io/zilero232/chatovo-server`. Если ваш GitHub-аккаунт другой —
> поправьте владельца в строках `image:` (только строчными буквами).

### 1.9. Запустить

Образы должны уже существовать в реестре — они попадают туда после первого
прогона CI (Часть 2). Первый прогон CI также копирует `docker-compose.yml`
в `/opt/chatovo`. Порядок такой: сначала настройте CI и сделайте push
(Часть 2), затем вернитесь сюда и на VPS выполните:

```bash
cd /opt/chatovo
docker compose pull      # скачать образы web/server из ghcr.io + livekit
docker compose up -d     # запустить web, server, livekit
```

Caddy внутри образа `web` при первом запуске сам получит TLS-сертификаты
сразу для трёх доменов: `chatovo.ru`, `api.chatovo.ru` и `livekit.chatovo.ru`.
Проверка:

```bash
curl https://chatovo.ru                 # отдаётся HTML сайта
curl https://api.chatovo.ru/health      # ожидается {"ok":true}
curl -I https://livekit.chatovo.ru      # ожидается 200/426 от LiveKit
```

> До первого прогона CI образов в реестре ещё нет и `docker compose pull`
> завершится ошибкой — это ожидаемо. Сначала Часть 2.

Если сертификат не выпустился — проверьте DNS и порты 80/443, затем
`docker compose logs web`.

---

## Self-hosted LiveKit

LiveKit-сервер для голосовых комнат живёт на том же VPS как третий контейнер
(`livekit/livekit-server:latest`). Это альтернатива LiveKit Cloud — код проекта
не отличает их, разница только в значениях `LIVEKIT_URL`/`LIVEKIT_API_KEY`/
`LIVEKIT_API_SECRET`.

### Почему host networking

В `docker-compose.yml` контейнер LiveKit запущен с `network_mode: host`.
WebRTC требует, чтобы сервер рекламировал ICE-кандидаты с реальным внешним
IP и слушал media-порты на нём напрямую. За Docker NAT (bridge) это сломалось
бы — медиа-трафик не нашёл бы дорогу к серверу.

Из-за host networking сигнальный порт 7880 публикуется прямо на хосте, но
наружу его открывать **не нужно** — Caddy внутри bridge-сети дотягивается до
него через `host.docker.internal` (см. `extra_hosts` в `web`-сервисе).

### Порты

| Порт | Протокол | Кто открывает | Зачем |
|------|----------|---------------|-------|
| 443 | tcp | Caddy (наружу) | HTTPS → WSS на сигналинг LiveKit |
| 7880 | tcp | LiveKit (на хосте) | Signalling, доступен только локально |
| 7881 | tcp | LiveKit (наружу) | TURN/TCP fallback для клиентов без UDP |
| 50000-50100 | udp | LiveKit (наружу) | WebRTC media (RTP) |

Все наружные порты открываются в шаге 1.3.

### Создание `livekit.yaml`

На VPS, рядом с `docker-compose.yml`:

```bash
# Сгенерировать пару ключей — просто две случайные строки. Секрет минимум
# 32 символа. На VPS (есть openssl):
echo "API$(openssl rand -hex 8)"   # API key
openssl rand -base64 36            # API secret
# На Windows-машине — см. PowerShell-вариант в infra/livekit/README.md.
# Скопировать вывод — пригодится дважды: в livekit.yaml и в /opt/chatovo/.env

# Создать конфиг по образцу из репозитория
nano /opt/chatovo/livekit.yaml
```

Содержимое — по образцу `infra/livekit/livekit.yaml`. Минимально нужно вписать
один блок `keys:` с парой `<API key>: <secret>`. `use_external_ip: true` оставьте
включённым — он сам определит внешний IP VPS.

### Совпадение ключей

Один и тот же `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` должен быть прописан
**в двух местах** на VPS:

1. В `livekit.yaml` (блок `keys:`) — этим ключом LiveKit-сервер валидирует
   входящие JWT и API-запросы.
2. В `/opt/chatovo/.env` (`LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`) — этим же
   ключом Hono-сервер подписывает JWT, которые отдаёт клиентам.

Если они разойдутся — токен, выданный сервером, не примет LiveKit, и клиент
не подключится. Браузер ключа никогда не видит, только подписанный токен.

### Клиентский URL

`NEXT_PUBLIC_LIVEKIT_URL` впекается в бандл клиента при `next build`. После
смены LiveKit Cloud → self-hosted (или наоборот) нужен **новый прогон CI**,
чтобы изменения попали в браузерный бандл и в Tauri-сборку.

| Где задаётся | Значение для self-hosted |
|--------------|--------------------------|
| GitHub Secret `NEXT_PUBLIC_LIVEKIT_URL` | `wss://livekit.chatovo.ru` |
| `apps/client/.env` (локальная dev-сборка / Tauri) | `wss://livekit.chatovo.ru` |
| `/opt/chatovo/.env` → `LIVEKIT_URL` | `wss://livekit.chatovo.ru` |

### Проверка после запуска

```bash
# 1. Контейнер жив
docker compose ps livekit
docker compose logs --tail=50 livekit
# В логах ожидается строка "starting LiveKit server" и
# "using external IP <ваш-IP>".

# 2. Сигналинг доступен через Caddy
curl -I https://livekit.chatovo.ru
# Ожидается 200 или 426 Upgrade Required (это нормально — WSS endpoint).

# 3. Открытие реальной комнаты — через приложение Chatovo.
#    Если медиа не идёт, но соединение установилось, на 99% дело в портах:
#    проверьте, что 7881/tcp и 50000-50100/udp реально открыты у хостера
#    (некоторые VPS-провайдеры режут UDP-диапазоны на уровне фаервола).
```

### Когда оставить LiveKit Cloud

Self-hosting экономит деньги и убирает зависимость от внешнего сервиса,
но даёт два минуса: голос ест bandwidth VPS (≈ 50 кбит/с на участника
в каждую сторону), и нужно следить за обновлениями LiveKit-сервера.
До ~50 одновременных голосов на одном небольшом VPS — спокойно; дальше
имеет смысл либо вертикально масштабировать VPS, либо вернуться к Cloud.

---

## Часть 2. Настройка CI/CD (GitHub Actions)

После push в `master` workflow `.github/workflows/deploy.yml`:

1. прогоняет линтер по всему монорепо;
2. собирает Docker-образ клиента и публикует его в ghcr.io;
3. собирает Docker-образ сервера и публикует его в ghcr.io;
4. копирует `docker-compose.yml` на VPS (`scp`), затем по SSH запускает там
   скачивание обоих образов и перезапуск стека.

Образы собираются на стороне CI (а не на VPS). Для публикации CI использует
встроенный `GITHUB_TOKEN` — отдельный секрет для этого не нужен.

### 2.1. SSH-ключ для деплоя

GitHub Actions заходит на ваш VPS по SSH (копировать compose-файл, запускать
`docker compose pull`). Для этого нужен **отдельный SSH-ключ**, который будет
использоваться только для деплоя — не личный.

Что такое SSH-ключ: это **пара из двух файлов**, которые работают вместе:

- **приватный** (без расширения, например `chatovo_deploy`) — секрет, как пароль;
- **публичный** (`chatovo_deploy.pub`) — не секрет, его можно показывать.

Принцип: владелец приватного ключа доказывает свою личность серверу,
у которого есть соответствующий публичный. То есть приватный — у того, кто
заходит (CI), а публичный — у того, к кому заходят (VPS).

#### 2.1.1. Создать пару ключей (на локальной машине)

```bash
ssh-keygen -t ed25519 -f chatovo_deploy -N "" -C "github-actions"
```

Эта команда создаёт **два файла** в текущей папке:

- `chatovo_deploy` — **приватный** ключ;
- `chatovo_deploy.pub` — **публичный** ключ.

Расшифровка флагов: `-t ed25519` — современный алгоритм; `-f chatovo_deploy` —
имя файла; `-N ""` — без пароля на ключ (иначе CI не сможет им автоматически
пользоваться); `-C "github-actions"` — пометка-комментарий для удобства.

#### 2.1.2. Положить публичный ключ на VPS

```bash
ssh-copy-id -i chatovo_deploy.pub root@<IP>
```

Эта команда копирует **содержимое `chatovo_deploy.pub`** в файл
`~/.ssh/authorized_keys` на VPS. С этого момента любой, у кого есть
**приватный** `chatovo_deploy`, может зайти на VPS по SSH как `root` без пароля.

> Если `ssh-copy-id` нет под рукой (например, на Windows без WSL) — то же
> руками: откройте `chatovo_deploy.pub`, скопируйте его содержимое (одна
> строка), на VPS допишите её отдельной строкой в `~/.ssh/authorized_keys`
> (создайте файл, если его нет). Права папки: `chmod 700 ~/.ssh && chmod 600
> ~/.ssh/authorized_keys`.

#### Альтернатива: сгенерировать ключ прямо на VPS

Раз ключ нужен не вам лично, а CI — приватная часть всё равно переезжает
в GitHub Secrets. В этом случае удобнее создать пару на VPS одной сессией,
без `ssh-copy-id`:

```bash
# Подключиться к VPS и выполнить:
ssh-keygen -t ed25519 -f ~/chatovo_deploy -N "" -C "github-actions"
cat ~/chatovo_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

cat ~/chatovo_deploy   # содержимое → GitHub Secret SSH_PRIVATE_KEY

# После копирования приватного в GitHub Secrets файлы с VPS можно удалить:
rm ~/chatovo_deploy ~/chatovo_deploy.pub
```

Результат тот же: публичный ключ остался в `authorized_keys`, приватный —
в GitHub Secrets. Дальше — шаг 2.1.3 (для альтернативы он уже выполнен:
приватный вы уже скопировали выше).

#### 2.1.3. Положить приватный ключ в GitHub Secrets

Содержимое приватного ключа `chatovo_deploy` пойдёт в секрет `SSH_PRIVATE_KEY`
(см. таблицу в 2.3). Берётся **целиком**, включая строки `-----BEGIN OPENSSH
PRIVATE KEY-----` и `-----END OPENSSH PRIVATE KEY-----`.

Если ключ создавался **на локальной машине** — он у вас уже под рукой:

```bash
cat chatovo_deploy
```

Если ключ создавался **на VPS** — есть три способа достать его оттуда:

**A. Скачать файл к себе через `scp` (рекомендуется).** Из обычного терминала
на локальной машине:

```bash
scp root@<IP>:~/chatovo_deploy ./chatovo_deploy
cat chatovo_deploy   # открыть и скопировать содержимое
```

После того как вставите в GitHub Secret — удалите файл и с локальной,
и с VPS.

**B. Просто `cat` в SSH-сессии и выделить мышкой.** Подходит для обычных
SSH-клиентов (Windows Terminal, iTerm, Terminal.app, PuTTY). В веб-консоли
панели Timeweb так лучше не делать — там бывают проблемы с буфером обмена.

```bash
cat ~/chatovo_deploy
```

Выделите от строки `-----BEGIN OPENSSH PRIVATE KEY-----` до
`-----END OPENSSH PRIVATE KEY-----` включительно. В Windows Terminal
выделение копируется автоматически; в других — Ctrl+C / Cmd+C.

**C. Что НЕ нужно делать** — копировать через `base64`, отправлять через
Telegram/почту и подобное. Приватный ключ не должен проходить через сторонние
сервисы.

#### Проверка перед сохранением секрета

Вставляя ключ в GitHub Secret, убедитесь:

- Первая строка — ровно `-----BEGIN OPENSSH PRIVATE KEY-----`
- Последняя строка — ровно `-----END OPENSSH PRIVATE KEY-----`
- Между ними — несколько строк из букв, цифр и символов `+`, `/`, `=`
- Никаких лишних пробелов в начале строк и пустых строк внутри ключа

Если CI потом упадёт на шаге `Configure SSH` — почти всегда дело в кривом
копировании. Удалите секрет и сохраните заново.

#### Итог — где что должно оказаться

| Файл | Куда | Зачем |
|------|------|-------|
| `chatovo_deploy` (приватный) | GitHub Secrets → `SSH_PRIVATE_KEY` | Чтобы CI мог зайти на VPS |
| `chatovo_deploy.pub` (публичный) | VPS → `~/.ssh/authorized_keys` | Чтобы VPS принял этот ключ |
| Оба файла на локальной машине | можно удалить или сохранить в безопасном месте | На случай потери — пересоздайте пару |

> Никогда не коммитьте приватный ключ в git и не делитесь им. Если он
> утёк — удалите соответствующую строку из `~/.ssh/authorized_keys` на VPS
> и создайте новую пару.

### 2.2. Personal Access Token для VPS (доступ к реестру)

VPS должен скачивать приватные образы из ghcr.io, поэтому ему нужен токен
с правом чтения пакетов:

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Tokens (classic) → Generate new token**.
2. Отметьте право **`read:packages`**.
3. Сгенерируйте и скопируйте токен.
4. Используйте его для `docker login ghcr.io` на VPS (раздел 1.7).

> Этот токен нужен только VPS для скачивания образов. CI публикует образы
> своим встроенным токеном — туда PAT прописывать не нужно.

### 2.3. Секреты в GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Секрет | Значение |
|--------|----------|
| `SSH_HOST` | IP сервера |
| `SSH_USER` | `root` (или пользователь деплоя) |
| `SSH_PORT` | `22` |
| `SSH_PRIVATE_KEY` | содержимое файла `chatovo_deploy` (приватный ключ целиком) |
| `DEPLOY_PATH` | `/opt/chatovo` |
| `NEXT_PUBLIC_API_URL` | `https://api.chatovo.ru` (один секрет на веб и Tauri) |
| `NEXT_PUBLIC_LIVEKIT_URL` | `wss://livekit.chatovo.ru` (self-hosted) или `wss://<project>.livekit.cloud` |

### 2.4. Запустить деплой

Push в `master` — либо вкладка **Actions → Deploy to Timeweb → Run workflow**.

После успешного прогона образы окажутся в ghcr.io. Теперь вернитесь к
разделу 1.8 и запустите стек на VPS.

---

## Повседневная работа

| Действие | Команда |
|----------|---------|
| Деплой | `git push` в `master` |
| Логи клиента/Caddy | `docker compose logs -f web` (на VPS) |
| Логи сервера | `docker compose logs -f server` |
| Скачать свежие образы и перезапустить | `docker compose pull && docker compose up -d` |
| Статус контейнеров | `docker compose ps` |

### Откат на предыдущую версию

Каждый образ публикуется в ghcr.io с тегом коммита (SHA). Чтобы откатиться,
на VPS укажите нужный SHA вместо `latest` в `docker-compose.yml` (строки
`image:`), затем:

```bash
docker compose pull && docker compose up -d
```

SHA рабочего коммита можно посмотреть в истории git или во вкладке Actions.

### Обновление схемы БД

Миграции Prisma в CI не запускаются — схема управляется вручную. С машины
разработчика, имея `apps/server/.env` с боевыми `DATABASE_URL`/`DIRECT_URL`:

```bash
cd apps/server
bun db:push
```

> Осторожно: `db push` может удалить данные при расхождении схемы.

---

## Сборка Tauri-приложения под прод

Tauri использует ту же статику и тот же боевой API, что и сайт. И веб, и
десктоп ходят в `https://api.chatovo.ru` — никаких различий между значениями
`NEXT_PUBLIC_API_URL` в двух сборках больше нет.

```bash
# 1. Подготовить .env клиента для прод-сборки
cp apps/client/.env.example apps/client/.env
nano apps/client/.env
#    NEXT_PUBLIC_API_URL=https://api.chatovo.ru
#    остальные NEXT_PUBLIC_* — боевые значения

# 2. Собрать клиента, затем Tauri-бандл
bun --filter @chatovo/client build
bun tauri:build
```

Готовые инсталляторы появятся в `apps/tauri/target/release/bundle/`.
CORS на сервере разрешает Tauri-origin (`tauri://localhost`) автоматически
плюс `https://chatovo.ru` через `CORS_ORIGINS`.

---

## Чек-лист первого деплоя

Порядок важен: CI должен опубликовать образы в реестр **до** запуска на VPS.

- [ ] VPS создан, Docker установлен
- [ ] Открыты порты: 80/443/tcp, 7881/tcp, 50000-50100/udp (последние два —
      только для self-hosted LiveKit)
- [ ] DNS A-записи `@`, `www`, `api` и `livekit` указывают на IP
- [ ] Создана папка `/opt/chatovo` на VPS
- [ ] `/opt/chatovo/.env` заполнен (`NODE_ENV=production`,
      `CORS_ORIGINS=https://chatovo.ru`)
- [ ] `/opt/chatovo/livekit.yaml` создан с парой `keys:` (self-hosted)
- [ ] Ключи в `livekit.yaml` и в `.env` совпадают
- [ ] Домен в `infra/caddy/Caddyfile` проверён (оба блока: `chatovo.ru` и
      `livekit.chatovo.ru`)
- [ ] SSH-ключ деплоя добавлен на VPS
- [ ] Создан PAT с `read:packages`, на VPS выполнен `docker login ghcr.io`
- [ ] Все секреты прописаны в GitHub Actions
- [ ] Тестовый push в `master` прошёл — оба образа появились в ghcr.io
- [ ] На VPS выполнено `docker compose pull && docker compose up -d`
- [ ] Caddy выпустил сертификаты, `https://api.chatovo.ru/health` → `{"ok":true}`
- [ ] `https://chatovo.ru` открывается, фронт без CORS-ошибок ходит в `api.chatovo.ru`
- [ ] `https://livekit.chatovo.ru` отдаёт 200/426 (self-hosted)
- [ ] Голос в комнате реально подключается из браузера
