# Treasury

Treasury — full-stack веб-приложение для персонального учёта финансов. Оно объединяет доходы, расходы, категории, бюджеты и электронные чеки в одном интерфейсе, а также предоставляет административные функции и справочную информацию о курсах валют.

## Возможности

- учёт доходов и расходов по пользовательским категориям;
- ведение планового и фактического бюджета с поиском по периодам;
- загрузка, просмотр и удаление чеков в объектном хранилище;
- JWT-аутентификация с access- и refresh-токенами;
- разграничение доступа для пользователей и администраторов;
- административная статистика и управление ролями;
- получение курсов USD, EUR и CNY к RUB через Alpha Vantage.

## Статус требований

| Требование | Статус |
| --- | --- |
| Регистрация и вход | Реализовано |
| Роли `user` и `admin` | Реализовано |
| CRUD категорий | Реализовано |
| Учёт доходов и расходов | Реализовано |
| Плановый и фактический бюджет | Реализовано |
| Хранение чеков в MinIO-совместимом хранилище | Реализовано |
| Курсы валют | Реализовано; требуется ключ Alpha Vantage |
| Автоматические тесты и CI | Реализовано |
| Контейнерный запуск | Реализовано |

Проект находится в активной разработке. Паспорт и границы проекта описаны в [docs/00-project.md](docs/00-project.md).

## Технологии

**Frontend:** React 19, TypeScript, Vite, React Router, Axios, Vitest, Testing Library.

**Backend:** Python 3.12, FastAPI, Pydantic, SQLAlchemy 2, Alembic, PyJWT, pytest.

**Инфраструктура:** PostgreSQL 15, MinIO-совместимое S3-хранилище, Nginx, Docker Compose, GitHub Actions.

## Структура репозитория

```text
.
├── docs/
│   └── 00-project.md
├── src/
│   ├── backend/
│   │   └── app/
│   └── frontend/
│       └── src/
├── tests/
│   ├── backend/
│   └── frontend/
├── CHANGELOG.md
├── README.md
└── docker-compose.yml
```

## Быстрый запуск через Docker

### Требования

- Docker Engine 24+;
- Docker Compose v2;
- свободные порты `5432`, `8000`, `8080`, `9000` и `9001`.

### Запуск

1. Создайте локальный файл окружения:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Задайте в `.env` безопасные значения `DB_PASSWORD`, `JWT_SECRET_KEY` и `MINIO_PASSWORD`. Для получения курсов валют добавьте `ALPHA_VANTAGE_API_KEY`.

3. Соберите и запустите сервисы:

   ```powershell
   docker compose up --build
   ```

4. Откройте приложение: <http://localhost:8080/welcome>.

После запуска также доступны:

- Swagger UI: <http://localhost:8000/docs>;
- проверка API: <http://localhost:8000/health>;
- консоль объектного хранилища: <http://localhost:9001>.

При старте backend автоматически ожидает PostgreSQL и применяет миграции Alembic. Остановить стек можно командой `docker compose down`. Команда `docker compose down -v` дополнительно удаляет локальные данные PostgreSQL и объектного хранилища.

> Миграция создаёт демонстрационную учётную запись `admin@treasury.com` с паролем `pass1234`. Она предназначена только для локальной разработки и должна быть заменена перед публичным развёртыванием.

## Локальная разработка

### Frontend

```powershell
Set-Location src/frontend
npm ci
$env:VITE_BASE_API_URL = "http://localhost:8000/api"
npm run dev
```

### Backend

Создайте `src/backend/app/.env` на основе корневого `.env.example`, указав доступные локально PostgreSQL и MinIO. Затем:

```powershell
Set-Location src/backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.prod.txt
Set-Location app
alembic -c alembic.ini upgrade head
uvicorn main:app --reload
```

## Проверки

Frontend:

```powershell
Set-Location src/frontend
npm run lint
npm run test:run
npm run build
```

Backend:

```powershell
python -m pip install -r src/backend/requirements.ci.txt
python -m black --config src/backend/.black --check src/backend/app tests/backend
python -m flake8 --config src/backend/.flake8 src/backend/app
python -m pytest -c src/backend/pytest.ini tests/backend/unit tests/backend/integration
```

Интеграционные тесты используют Testcontainers, поэтому для них должен быть запущен Docker.

## Конфигурация

Основные переменные перечислены в [.env.example](.env.example): параметры PostgreSQL, JWT, объектного хранилища, Alpha Vantage, CORS и публичного URL. Секреты не должны попадать в Git.

## Лицензия

Открытая лицензия пока не предоставлена. Все права на исходный код сохраняются за автором; использование и распространение требуют отдельного разрешения.
