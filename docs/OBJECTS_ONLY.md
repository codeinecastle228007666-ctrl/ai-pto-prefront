# Карта среза objects_only

База: `walleInc/ptodoc-front` `main` @ `9d0f297`.  
Ветка среза: `objects-only`.

## Сохранено

**Pages:** `objects`, `object-detail`, `object-edit`, `object-new`, `upload`, `package`.

**Features (нужны для objects/upload/package):** `objects`, `upload`, `review`, `findings`, `checklist`, `fields`, `reports`, `auth` (store/API без UI логина).

**Прочее:** MSW handlers (objects/packages/auth), shared UI, минимальный `Header` + `Layout`.

## Удалено

- `pages/landing` (+ demo-контур лендинга)
- `pages/login`, `pages/profile`, `pages/dashboard`
- `widgets/sidebar`
- `app/ProtectedRoute`
- Logout / email в хедере; редирект 401 → `/login`

## Роуты

| До | После |
| --- | --- |
| `/` → Landing | `/` → `/objects` |
| `/login` | нет |
| `/dashboard` | нет |
| `/profile` | нет |
| `/objects`, `/objects/new`, `/objects/:id`, `/objects/:id/edit` | есть |
| `/objects/:id/upload`, `/objects/:id/packages/:packageId` | есть |
| `*` → Landing | `*` → `/objects` |

## Поток данных

```text
/objects → карточка объекта → «Загрузить документы»
  → /objects/:id/upload → создание пакета
  → /objects/:id/packages/:packageId (review / findings / checklist)
```

## Почему без логина

При `VITE_USE_MOCKS=true` после старта MSW вызывается `bootstrapMockAuth()` — в store кладётся owner (`owner@pto.example.com`), в `sessionStorage` пишется mock session id для заголовка `X-Mock-Session`.

**Ограничение:** без моков живой API потребует cookie-сессию с бэка; UI логина в срезе нет.

## Связь с продуктом

Полный продукт = лендинг + кабинет.  
`objects_only` — только кабинетный контур списка объектов и пайплайна загрузки/проверки, удобный для ревью и демо мок-пайплайна.

## Render

Прод-демо: [https://objectsonly.onrender.com](https://objectsonly.onrender.com)  
Сервис Static Site, ветка `objects-only`, конфиг — [`render.yaml`](../render.yaml).

| Параметр | Значение |
| --- | --- |
| Build | `npm install && npm run build` |
| Publish | `./dist` |
| SPA rewrite | `/*` → `/index.html` |
| Build env | `VITE_USE_MOCKS=true`, `VITE_APP_NAME=ПТО-Doc` |

Если в консоли `Refused to apply style … MIME type ('text/plain')` и 404 на `/assets/*` — браузер получил тело 404 вместо CSS/JS (у Render часто `text/plain`). Обычно это сразу после деплоя, пока CDN не раздал новые ассеты: hard refresh / подождать / Manual Deploy. Publish path при этом уже `dist`.

## Коммиты-шаги (ветка `objects-only`)

1. `chore | router: корень / ведёт на /objects, лендинг убран из роутов`
2. `chore | remove: удалены страницы лендинга (landing)`
3. `chore | router: маршрут /profile отключён`
4. `chore | remove: удалена страница профиля`
5. `chore | router: маршрут /dashboard отключён`
6. `chore | remove: удалена страница обзора (dashboard)`
7. `chore | router: маршрут /login отключён`
8. `chore | remove: удалена страница логина`
9. `feat | auth: вход без UI — auto mock session для objects_only`
10. `feat | layout: минимальный хедер вместо сайдбара`
11. `chore | remove: удалён виджет сайдбара`
12. `chore | auth: убран редирект на /login при 401`
13. `docs | objects_only: README и карта среза`
