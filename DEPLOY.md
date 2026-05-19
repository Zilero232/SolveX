# Деплой Chatovo на Timeweb Cloud

Документ описывает, как развернуть Chatovo на одном VPS Timeweb Cloud
и настроить автоматический деплой через GitHub Actions.

## Архитектура

Всё работает на одном VPS под одним доменом `chatovo.ru`. И клиент, и сервер
упакованы в Docker-образы — образы собираются в CI и публикуются в приватном
реестре GitHub Container Registry (ghcr.io). VPS ничего не собирает: он только
скачивает готовые образы и запускает их.

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
   │  web     — Caddy + статика клиента, проксирует /api,   │
   │            держит HTTPS; порты 80/443 наружу          │
   │  server  — Hono на Bun, :4000 (только внутри сети)     │
   │                                                       │
   └───────────────────────────────────────────────────────┘
                              │
          Supabase (PostgreSQL + Auth)  ·  LiveKit Cloud  — внешние
```

- **Клиент** — Next.js со `output: 'export'`. Образ `chatovo-web` собирает
  статику и раздаёт её через встроенный Caddy; он же проксирует `/api` на
  сервер и терминирует HTTPS. Это единственный контейнер, смотрящий в интернет.
- **Сервер** — Hono на Bun. Образ `chatovo-server`, слушает порт 4000 только
  внутри docker-сети — снаружи доступен лишь через `web`.
- **Реестр** — оба образа хранятся в приватном ghcr.io. CI публикует их
  встроенным `GITHUB_TOKEN`; VPS скачивает по личному токену (PAT).
- **БД и LiveKit** — внешние (Supabase, LiveKit Cloud). Схема БД управляется
  вручную командой `bun db:push` с машины разработчика.
- **Tauri** — десктоп-приложение собирается локально, на хостинг не идёт.

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
| `deploy/Caddyfile` | Конфиг Caddy (копируется внутрь образа клиента) |
| `docker-compose.yml` | Запуск web + server на VPS (образы из ghcr.io) |
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

Дождитесь распространения (`ping chatovo.ru` отдаёт ваш IP).

> Это обязательно: Caddy не сможет выпустить TLS-сертификат, пока домен
> не указывает на сервер.

### 1.3. Установить Docker и открыть порты

Подключитесь по SSH (`ssh root@<IP>`):

```bash
# Docker + compose plugin
curl -fsSL https://get.docker.com | sh

# Открыть порты 80 и 443 (нужны Caddy для HTTPS и выпуска сертификата)
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable
```

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

Впишите реальные значения из Supabase и LiveKit, поставьте `NODE_ENV=production`.
Файл `.env` лежит только на VPS, в git его нет. `docker-compose.yml` ожидает
его рядом с собой — поэтому он именно `/opt/chatovo/.env`.

### 1.6. Проверить домен в Caddyfile

Домен зашит в образ клиента при сборке. Если домен не `chatovo.ru` — поправьте
`deploy/Caddyfile` (строка с доменом) ДО первого прогона CI.

### 1.7. Логин в GitHub Container Registry

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

### 1.8. Запустить

Образы должны уже существовать в реестре — они попадают туда после первого
прогона CI (Часть 2). Первый прогон CI также копирует `docker-compose.yml`
в `/opt/chatovo`. Порядок такой: сначала настройте CI и сделайте push
(Часть 2), затем вернитесь сюда и на VPS выполните:

```bash
cd /opt/chatovo
docker compose pull      # скачать образы web и server из ghcr.io
docker compose up -d     # запустить оба контейнера
```

Caddy внутри образа `web` при первом запуске сам получит TLS-сертификат.
Проверка:

```bash
curl https://chatovo.ru/health      # ожидается {"ok":true}
curl https://chatovo.ru             # отдаётся HTML сайта
```

> До первого прогона CI образов в реестре ещё нет и `docker compose pull`
> завершится ошибкой — это ожидаемо. Сначала Часть 2.

Если сертификат не выпустился — проверьте DNS и порты 80/443, затем
`docker compose logs web`.

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
| `NEXT_PUBLIC_API_URL` | `/api` (тот же домен, что и сайт) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |
| `NEXT_PUBLIC_LIVEKIT_URL` | `wss://<project>.livekit.cloud` |

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

Tauri использует ту же статику и тот же боевой API, что и сайт.
Отличие одно: десктоп-приложение не открыто как сайт `chatovo.ru`, поэтому
относительный путь `/api` ему не подходит — нужен абсолютный адрес.

```bash
# 1. Подготовить .env клиента для прод-сборки
cp apps/client/.env.example apps/client/.env
nano apps/client/.env
#    NEXT_PUBLIC_API_URL=https://chatovo.ru/api   (абсолютный адрес!)
#    остальные NEXT_PUBLIC_* — боевые значения

# 2. Собрать клиента, затем Tauri-бандл
bun --filter @chatovo/client build
bun tauri:build
```

Готовые инсталляторы появятся в `apps/tauri/target/release/bundle/`.
CORS на сервере уже разрешает Tauri-origin (`tauri://localhost`).

> Веб-образ собирается с `NEXT_PUBLIC_API_URL=/api` (относительный путь).
> Для Tauri — `https://chatovo.ru/api` (абсолютный). Это единственное
> различие в значениях между двумя сборками.

---

## Чек-лист первого деплоя

Порядок важен: CI должен опубликовать образы в реестр **до** запуска на VPS.

- [ ] VPS создан, Docker установлен, порты 80/443 открыты
- [ ] DNS A-записи `@` и `www` указывают на IP
- [ ] Создана папка `/opt/chatovo` на VPS
- [ ] `/opt/chatovo/.env` заполнен (`NODE_ENV=production`)
- [ ] Домен в `deploy/Caddyfile` проверён
- [ ] SSH-ключ деплоя добавлен на VPS
- [ ] Создан PAT с `read:packages`, на VPS выполнен `docker login ghcr.io`
- [ ] Все секреты прописаны в GitHub Actions
- [ ] Тестовый push в `master` прошёл — оба образа появились в ghcr.io
- [ ] На VPS выполнено `docker compose pull && docker compose up -d`
- [ ] Caddy выпустил сертификат, `https://chatovo.ru/health` → `{"ok":true}`
- [ ] `https://chatovo.ru` открывается, фронт ходит в API
