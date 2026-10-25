# Паспорт проекта Treasury

## Название

**Treasury** — веб-система персонального финансового учёта.

## Происхождение

Собственный индивидуальный проект. Проект не является форком и разработан автором самостоятельно.

## Назначение и решаемая проблема

Treasury предназначен для централизованного ведения личных финансов. Приложение решает проблему разрозненного учёта доходов, расходов, бюджетов и подтверждающих документов: пользователь получает единое пространство для фиксации операций, анализа финансового результата и хранения чеков.

## Целевые пользователи и роли

| Пользователь | Потребность | Возможности в системе |
| --- | --- | --- |
| Обычный пользователь (`user`) | Вести и контролировать личные финансы | Управление категориями, доходами и расходами; работа с бюджетом; загрузка чеков; просмотр курсов валют |
| Администратор (`admin`) | Контролировать работу пользователей и агрегированные показатели | Просмотр пользователей, назначение и снятие роли администратора, просмотр статистики доходов и расходов |

Одна учётная запись может одновременно иметь обе роли.

## Три основные функции

1. **Учёт финансовых операций.** Создание пользовательских категорий, добавление и редактирование доходов и расходов, поиск значений по категории и периоду.
2. **Планирование бюджета.** Ведение планового бюджета и расчёт фактического остатка на основании внесённых доходов и расходов.
3. **Хранение подтверждающих документов.** Загрузка чеков в MinIO-совместимое объектное хранилище, получение временной ссылки для просмотра и удаление файлов.

Дополнительные функции: JWT-аутентификация, ролевая модель доступа, административная статистика и получение актуальных валютных курсов через внешний API.

## Технологический стек

| Область | Технологии |
| --- | --- |
| Клиентское приложение | React 19.2.4, TypeScript 5.9.3, Vite 7.1.14, React Router, Axios, CSS Modules |
| Серверное API | Python 3.12.15, FastAPI, Pydantic, Uvicorn |
| Доступ к данным | SQLAlchemy 2 (async), Alembic, asyncpg |
| База данных | PostgreSQL 15.19 |
| Файловое хранилище | MinIO-совместимое S3 API |
| Безопасность | JWT, хеширование паролей Werkzeug, роли `user` и `admin` |
| Внешние интеграции | Alpha Vantage через HTTPX |
| Тестирование | pytest, pytest-asyncio, Testcontainers, Vitest, Testing Library, Playwright |
| Доставка и эксплуатация | Docker, Docker Compose, Nginx, GitHub Actions |

## Лицензия

Проект распространяется на условиях проприетарной лицензии `All Rights Reserved`. Все права сохраняются за автором; использование и распространение требуют отдельного письменного разрешения. Полный текст находится в корневом файле `LICENSE`.

## Команда и распределение ролей

Проект выполнен индивидуально.

| Участник | Роли и зона ответственности |
| --- | --- |
| EgorAnti | Автор идеи и владелец продукта; анализ требований; проектирование архитектуры и базы данных; backend- и frontend-разработка; UI/UX; тестирование; контейнеризация, CI/CD и сопровождение документации |

## Текущий статус

Рабочий прототип реализован как full-stack приложение и подготовлен к локальному контейнерному запуску. Основные пользовательские и административные сценарии присутствуют; проект продолжает развиваться.

## Структура проекта

Treasury организован как монорепозиторий клиент-серверного приложения. Nginx обслуживает React SPA и проксирует `/api/*` в FastAPI; backend обращается к PostgreSQL, S3-совместимому хранилищу Silo и внешнему Alpha Vantage API. Очереди сообщений, фоновые воркеры и отдельный кеш в текущей версии не используются.

```text
Браузер
  ├── HTTP :8080 → Nginx → React SPA
  └── /api/* → Nginx → FastAPI :8000
                         ├── PostgreSQL :5432
                         ├── Silo/MinIO API :9000
                         └── Alpha Vantage HTTPS API
```

### Корневые каталоги и файлы

| Путь | Назначение |
| --- | --- |
| `src/backend/` | Backend, миграции, Python-зависимости и контейнерный образ API |
| `src/frontend/` | React-приложение, npm-манифесты и контейнерный образ Nginx |
| `tests/backend/` | Unit-, integration- и end-to-end-тесты backend и системы |
| `tests/frontend/` | Модульные и компонентные тесты frontend |
| `docs/00-project.md` | Единый паспорт и основная проектная документация |
| `.github/workflows/` | Непрерывная интеграция и публикация Docker-образов |
| `docker-compose.yml` | Оркестрация PostgreSQL, Silo, backend и frontend |
| `.env.example` | Шаблон переменных окружения без секретов |
| `.tool-versions` | Закреплённые версии Python и Node.js |
| `README.md` | Описание, запуск и статус требований |
| `CHANGELOG.md` | Журнал изменений; пока не заполнен |
| `LICENSE` | Проприетарная лицензия проекта |

### Backend

Основной код находится в `src/backend/app/`.

| Каталог или модуль | Назначение |
| --- | --- |
| `main.py` | Создание FastAPI-приложения, CORS, роутеры, health check, sitemap и robots.txt |
| `config.py` | Типизированное чтение настроек через Pydantic Settings |
| `api/routers/` | HTTP-контроллеры auth, categories, expenses, incomes, budgets, receipts, admin, roles и валютных курсов |
| `models/` | Pydantic DTO запросов и ответов по предметным областям |
| `data/entities/` | SQLAlchemy ORM-сущности и связи таблиц |
| `data/repositories/` | Запросы к базе данных и прикладные операции над сущностями |
| `data/init_bd.py` | Async SQLAlchemy engine, фабрика сессий и declarative base |
| `services/security.py` | JWT, извлечение пользователя и проверка ролей |
| `services/minio.py` | Загрузка, удаление и временные ссылки на файлы чеков |
| `services/alpha_vantage_service.py` | Получение курсов валют, retry и локальный rate limit |
| `adapters/alpha_vantage_adapter.py` | HTTP-клиент внешнего Alpha Vantage API |
| `dependency/` | FastAPI dependency для MinIO-клиента |
| `exceptions/` | Доменные HTTP-исключения |
| `alembic/` и `alembic.ini` | Версионирование схемы PostgreSQL и начальные данные |

Точка входа backend — объект `app` в `src/backend/app/main.py`. Локальный запуск выполняется командой `uvicorn main:app --reload` из `src/backend/app`. В контейнере `entrypoint.sh` ожидает PostgreSQL, применяет `alembic upgrade head` и запускает Uvicorn. Доступны health endpoints `/health` и `/api/health`.

### Frontend

Основной код находится в `src/frontend/src/`.

| Каталог или модуль | Назначение |
| --- | --- |
| `main.tsx` | Монтирование React-приложения в DOM и подключение Helmet |
| `App.tsx` | Маршрутизация и защита страниц по ролям |
| `pages/` | Страницы входа, финансовых операций, бюджетов, чеков, справочной информации и администрирования |
| `api/` | Клиенты backend API, общий Axios instance и refresh-token interceptor |
| `security/ProtectedRoute.tsx` | Проверка токена и требуемой роли |
| `components/` | Навигация, пагинация, сортировка и JSON-LD |
| `hooks/` | Пользовательский hook загрузки категорий |
| `types/` | TypeScript-типы API и представлений |
| `assets/` | Статические изображения |
| `style.css`, `*.module.css` | Глобальные и модульные стили |
| `vitest.config.ts`, `vitest.setup.ts` | Конфигурация frontend-тестов |
| `nginx/default.conf` | SPA fallback, проксирование `/api/` и HTTP security headers |

Точки входа frontend — `src/frontend/index.html` и `src/frontend/src/main.tsx`. Для разработки используется `npm run dev`, для production — `npm run build` и Nginx.

### Внешние зависимости и сервисы

| Сервис | Назначение | Подключение |
| --- | --- | --- |
| PostgreSQL 15.19 | Пользователи, роли, финансовые данные и метаданные чеков | Async SQLAlchemy через `asyncpg`, параметры `DB_*` |
| Silo/MinIO-compatible | Бинарные файлы чеков и временные download URL | S3 API через пакет `minio`, параметры `MINIO_*` |
| Alpha Vantage | Курсы USD, EUR и CNY к RUB | HTTPS через `httpx`, API key и timeout |
| Docker Hub | Хранение frontend/backend-образов | GitHub Actions variables и secret |

### Хранение данных

PostgreSQL содержит таблицы `users`, `roles`, `user_roles`, `categories`, `expenses`, `incomes`, `budgets` и `receipts`. Пользовательские данные связаны через `user_uuid`, схема изменяется миграциями Alembic.

Файл чека хранится в Silo под именем `<user_uuid>/<random_uuid>_<original_name>`. PostgreSQL содержит UUID записи, object name, исходное имя, MIME type, владельца и дату создания. Access- и refresh-токены сохраняются в `localStorage`; отдельного серверного хранилища сессий нет. Docker Compose использует именованные тома `postgres_data` и `minio_data`.

### Конфигурация

| Механизм | Назначение |
| --- | --- |
| Корневой `.env` | Подстановка значений в `docker-compose.yml`; не хранится в Git |
| `.env.example` | Документированный шаблон переменных |
| `src/backend/app/.env` | Локальный запуск backend; читается `BaseSettings` |
| `DB_*` | Адрес, порт, пользователь, пароль и имя PostgreSQL |
| `JWT_SECRET_KEY` | Подпись access- и refresh-токенов |
| `MINIO_*` | Endpoint, учётные данные, TLS-флаг и bucket |
| `ALPHA_VANTAGE_*`, `REQUEST_TIMEOUT` | Внешний API валютных курсов |
| `CORS_ORIGINS`, `PUBLIC_BASE_URL` | Разрешённые origins и ссылки sitemap/robots |
| `VITE_BASE_API_URL` | Base URL Axios, задаваемый при frontend-сборке |
| GitHub variables/secrets | `DOCKERHUB_USERNAME` и `DOCKERHUB_TOKEN` |

Точные версии runtime и образов закреплены в `.tool-versions`, Dockerfile, Compose и CI; зависимости — в `package-lock.json` и `requirements*.txt`.

## Карта функций

Все перечисленные функции реализованы. Для ручной проверки необходимо запустить `docker compose up --build` и открыть `http://localhost:8080/welcome`.

| Пользовательская функция | Реализация | Ручная проверка |
| --- | --- | --- |
| Регистрация | `pages/RegisterPage`, `api/authService.ts`; `api/routers/auth.py`, `user_repository.add_user` | На `/register` создать учётную запись и затем войти |
| Вход и JWT | `pages/LoginPage`, `authService.ts`; `auth.py`, `services/security.py` | На `/login` войти; пользователь попадает на `/main`, администратор — на `/admin/main` |
| Обновление access token | `api/axiosInstance.ts`; `POST /api/auth/refresh` | Выполнить запрос с истёкшим access token и валидным refresh token; запрос должен повториться |
| Выход | `components/exit.tsx`, `authService.logout` | Нажать выход; токены очищаются, открывается `/welcome` |
| Ролевой доступ | `ProtectedRoute.tsx`, `App.tsx`; `RoleChecker` | Без токена открыть `/main`; пользователем открыть `/admin/main` |
| Просмотр категорий | `pages/CategoriesPage`, `useCategories.ts`; `categories.py`, `category_repository.py` | На `/categories` проверить списки, сортировку и страницы |
| Создание, изменение и удаление категории | `categoryService.ts`; `POST/PATCH/DELETE /api/categories` | Добавить категорию, переименовать и удалить её |
| Просмотр расходов | `pages/ExpencesPage`, `itemService.ts`; `expenses.py`, `expenses_repository.py` | На `/expences` проверить список, сумму, сортировку и пагинацию |
| Управление расходами | `pages/ExpencesPage`; `POST/PATCH/DELETE /api/expenses` | Добавить расход, изменить сумму, затем удалить запись |
| Поиск расходов | `itemService.getSearch`; `GET /api/expenses/search` | Выбрать категорию, год и месяц и сверить сумму |
| Просмотр доходов | `pages/IncomesPage`, `itemService.ts`; `incomes.py`, `incomes_repository.py` | На `/incomes` проверить список, сумму, сортировку и пагинацию |
| Управление доходами | `pages/IncomesPage`; `POST/PATCH/DELETE /api/incomes` | Добавить доход, изменить сумму, затем удалить запись |
| Поиск доходов | `itemService.getSearch`; `GET /api/incomes/search` | Выбрать категорию, год и месяц и сверить сумму |
| Просмотр бюджетов | `pages/BudgetsPage`, `budgetService.ts`; `budgets.py`, `budgets_repository.py` | На `/budgets` проверить плановый и фактический бюджет текущего года |
| Изменение планового бюджета | `budgetService.editBudget`; `PATCH /api/budgets` | Сохранить плановую сумму для месяца и обновить страницу |
| Расчёт фактического бюджета | `budgets_repository.calculate_real` | Добавить доход и расход; факт должен быть равен доходам минус расходы |
| Поиск бюджета | `budgetService.getSearch`; `GET /api/budgets/search` | Выбрать тип и год и проверить месячные значения |
| Просмотр чеков | `pages/ReceiptsPage`, `receiptService.ts`; `receipt.py`, `receipts_repository.py` | На `/receipts` проверить список и пагинацию |
| Загрузка чека | `receiptService.addReceipt`; `MinioService.upload` | Выбрать файл, загрузить и проверить его имя в списке |
| Просмотр или скачивание чека | `receiptService.getDownloadUrl`; `MinioService.get_presigned_url` | Нажать на чек и открыть временную S3-ссылку |
| Удаление чека | `receiptService.deleteReceipt`; `DELETE /api/receipts` | Удалить чек и проверить его отсутствие |
| Курсы валют | `pages/InfoPage`, `infoService.ts`; `ExchangeService` | С заданным API key открыть `/info` и проверить USD, EUR и CNY к RUB |
| Список пользователей | `pages/AdminRightsPage`, `statService.ts`; `GET /api/admin/users` | Администратором открыть `/admin/rights` |
| Управление администраторами | `AdminRightsPage`; `POST /api/admin/add`, `/api/admin/delete` | Назначить пользователю роль администратора и снять её |
| Статистика расходов и доходов | `AdminExpencesPage`, `AdminIncomesPage`; `GET /api/admin/stat` | Выбрать сумму/среднее, год и месяц и выполнить расчёт |
| Health check | `main.py` | Открыть `http://localhost:8000/health`, ожидается `{"status":"ok"}` |
| Sitemap и robots.txt | `main.py` | Открыть `/sitemap.xml` и `/robots.txt` |

## Состояние практик

| Практика | Есть или нет | Комментарий |
| --- | --- | --- |
| Unit-тесты backend | Да | `tests/backend/unit`; Alpha Vantage и MinIO services |
| Integration-тесты backend | Да | `tests/backend/integration`; FastAPI и PostgreSQL через Testcontainers, требуется Docker |
| End-to-end-тесты | Частично | Playwright-сценарии есть в `tests/backend/e2e`, но текущий CI их не запускает |
| Frontend-тесты | Да | Vitest + Testing Library: 7 файлов, 16 тестов; `npm run test:run` |
| Контроль покрытия | Нет | Нет порога coverage и отчёта покрытия в CI |
| Python formatter | Да | Black 25.9.0, конфигурация `src/backend/.black` |
| Python linter | Да | Flake8 7.3.0, конфигурация `src/backend/.flake8` |
| Frontend linter | Да | ESLint 9.39.3, команда `npm run lint` |
| Frontend formatter | Частично | Prettier настроен, но форматирование не проверяется в CI |
| Pre-commit hooks | Частично | Конфигурация есть, обязательный запуск в CI отсутствует |
| Непрерывная интеграция | Да | Frontend lint/test/build, backend Black/Flake8/tests, Docker build |
| Непрерывная доставка | Частично | Docker-образы публикуются, но deploy job не ограничен доверенной веткой |
| Контейнеризация | Да | Dockerfile, Compose, health checks, точные tags и digests |
| Миграции БД | Да | Alembic запускается перед стартом API |
| Управление конфигурацией | Да | Pydantic Settings, `.env.example`, Compose variables и Vite build argument |
| Фиксация зависимостей | Да | `package-lock.json`, точные Python requirements, `.tool-versions`, digests образов |
| Основная документация | Да | README и настоящий паспорт проекта |
| Лицензия | Да | Проприетарная `All Rights Reserved` |
| Журнал изменений | Нет | `CHANGELOG.md` существует, но пока пуст |
| Security scan | Нет | Dependabot, CodeQL, `pip-audit` и обязательный `npm audit` не настроены |
| Наблюдаемость | Частично | Есть health checks; метрики, tracing и централизованный error tracking отсутствуют |

### Первые наблюдения и issues

| Issue | Метка | Наблюдение | Приоритет |
| --- | --- | --- | --- |
| [#2](https://github.com/Egor2341/FullStack/issues/2) | `bug` | Скачивание и удаление чека не проверяют `user_uuid` владельца | Высокий |
| [#3](https://github.com/Egor2341/FullStack/issues/3) | `bug` | Изменение и удаление категории недостаточно ограничены владельцем | Высокий |
| [#4](https://github.com/Egor2341/FullStack/issues/4) | `bug` | Commit PostgreSQL и операция S3 могут оставить метаданные или файл-сироту | Высокий |
| [#5](https://github.com/Egor2341/FullStack/issues/5) | `bug` | Расчёт среднего делит на ноль при отсутствии пользователей | Средний |
| [#6](https://github.com/Egor2341/FullStack/issues/6) | `question` | Публикация Docker-образов запускается без ограничения доверенной веткой | Средний |

## Выполнимость и план

### Исследование выполнимости

Проект технически выполним в рамках семестра: рабочий прототип уже существует, контейнерный запуск подтверждён, ключевые компоненты покрыты базовыми тестами. Основное ограничение — индивидуальный состав команды, поэтому объём семестра должен быть сосредоточен на исправлении рисков, качестве и завершении существующих сценариев, а не на расширении продукта.

Шкала вероятности: низкая — событие маловероятно при обычной работе; средняя — возможно при определённых условиях; высокая — уже наблюдается либо ожидается регулярно.

| Категория | Риск | Вероятность | Последствия | Способ снижения |
| --- | --- | --- | --- | --- |
| Технический | Недостаточный опыт с async SQLAlchemy, JWT и согласованием PostgreSQL/S3 | Средняя | Ошибки авторизации, гонки, частично выполненные операции | Сначала закрыть issues #2–#5, добавить integration-тесты двух пользователей и тесты отказов S3 |
| Технический | Хранение JWT в `localStorage` увеличивает последствия XSS | Средняя | Кража access/refresh tokens и захват сессии | Рассмотреть HttpOnly Secure cookies, усилить CSP, исключить небезопасный HTML и добавить security-тесты |
| Технический | Схема доходов/расходов и бюджетов ограничивает дальнейшую аналитику | Средняя | Сложность повторяющихся операций, мультивалютности и точной истории | Зафиксировать границы модели на семестр; изменения схемы проводить только миграциями и с тестами данных |
| Организационный | E2E и ручные проверки требуют подготовленных данных и сервисов | Средняя | Трудное воспроизведение результатов на другой машине | Добавить seed/test fixtures, одну документированную команду запуска и автоматизированный smoke test |
| Внешний | Alpha Vantage требует API key и имеет rate limits/платные тарифы | Высокая | Курсы валют недоступны или ответы 429 | Сделать интеграцию необязательной, кешировать результат, показывать понятную ошибку, использовать mock в тестах |
| Внешний | Внешний Google Fonts ресурс влияет на автономность и приватность | Средняя | Шрифт не загрузится офлайн; браузер обращается к третьей стороне | Хранить шрифт локально либо использовать системный fallback |

### План лабораторных работ на семестр

| Лабораторная работа | План для Treasury |
| --- | --- |
| ЛР №2 | Формализовать требования и пользовательские сценарии, уточнить критерии приёмки и приоритеты backlog. Зафиксировать модель данных и API-контракты для выбранного семестрового объёма |
| ЛР №3 | Исправить нарушения object-level authorization для чеков и категорий и покрыть их integration-тестами двух пользователей. Добавить тесты пустой административной статистики |
| ЛР №4 | Обеспечить согласованность операций PostgreSQL и S3 при загрузке и удалении чеков, добавить обработку отказов и автоматические тесты компенсационных сценариев |
| ЛР №5 | Усилить quality pipeline: разделить быстрые и тяжёлые тесты, подключить coverage/security audit и ограничить deploy основной веткой с immutable Docker tags |
| ЛР №6 | Провести итоговое E2E и ручное тестирование, заполнить CHANGELOG, актуализировать паспорт и README, подготовить воспроизводимую демонстрацию и релизную сборку |

### Объём семестра

В объём семестра входят:

- сохранение существующих пользовательских сценариев регистрации, ролей, категорий, доходов, расходов, бюджетов и чеков;
- исправление авторизации на уровне объектов для чеков и категорий;
- согласованная обработка ошибок PostgreSQL/S3;
- корректная статистика на пустых данных;
- дополнительные integration- и E2E-тесты критических сценариев;
- coverage и автоматические проверки зависимостей;
- безопасные условия CI/CD и трассируемые Docker tags;
- заполнение CHANGELOG и завершение документации для воспроизводимого запуска.

За пределами семестра остаются:

- мобильное приложение;
- интеграции с банками, импорт выписок и автоматическая категоризация;
- мультивалютный бухгалтерский учёт и исторические валютные пересчёты;
- восстановление пароля по email, подтверждение адреса и двухфакторная аутентификация;
- сложные аналитические dashboards, прогнозирование и ML;
- очереди сообщений, фоновые воркеры, Kubernetes и промышленное cloud-развёртывание;
- платный тариф Alpha Vantage и гарантированный SLA внешних сервисов;
- многопользовательские семейные бюджеты и совместный доступ к данным.
