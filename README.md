# objects_only

Урезанный фронтенд-срез **ПТО-Doc**: только объекты, загрузка документов и просмотр пакета проверки.

## Откуда взят

Клон [`walleInc/ptodoc-front`](https://github.com/walleInc/ptodoc-front) ветка `main` @ `9d0f297`.

Работа ведётся в ветке **`objects-only`**. Полный продукт (`ptodoc-front` / `frontend/dev`) этим срезом не трогаем.

## Чем отличается от полного фронта

| Полный `ptodoc-front` | Этот срез |
| --- | --- |
| Лендинг, логин, дашборд, профиль, сайдбар | Нет |
| Cookie-сессия через `/login` | Auto mock-сессия при `VITE_USE_MOCKS=true` |
| Навигация кабинета | Минимальный хедер: бренд + «Объекты» |

## Запуск

```bash
npm i
# .env / .env.local:
# VITE_USE_MOCKS=true
npm run dev
```

После старта открывать:

- `/` → редирект на `/objects`
- `/objects` — список
- `/objects/:id` — карточка → «Загрузить документы»
- `/objects/:id/upload` → пакет → `/objects/:id/packages/:packageId`

## Коммиты и пуш

Мелкие смысловые коммиты на ветке `objects-only` (см. [docs/OBJECTS_ONLY.md](docs/OBJECTS_ONLY.md)).  
Пуш в remote — только по явной команде.
