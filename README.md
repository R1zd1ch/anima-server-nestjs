# Сервер для аниме-сайта (AnimaProject)

## Описание

Серверная часть веб-сайта для аниме, построенная на микросервисной архитектуре с использованием NestJS. Проект разделен на несколько независимых микросервисов, каждый из которых отвечает за определенную функциональность.

## Микросервисы

### Auth Microservice

- Управление аутентификацией и авторизацией
- OAuth интеграция
- Управление сессиями
- Регистрация и вход пользователей

### User Microservice

- Управление профилями пользователей
- Настройки пользователей
- Загрузка изображений
- Интеграция с Supabase для хранения файлов

### Anime Microservice

- Основная логика работы с аниме
- RabbitMQ интеграция для асинхронной обработки
- API для работы с данными аниме

### Update Anime Microservice

- Автоматическое обновление данных об аниме
- Интеграция с Shikimori API
- Парсинг и обработка данных

### Docs Microservice

- Автоматическая генерация документации API
- Объединение Swagger документации всех микросервисов
- Интерактивный интерфейс для тестирования API

## Технологический стек

- NestJS
- TypeScript
- Prisma (ORM)
- Redis (сессии и кэширование)
- RabbitMQ (очереди сообщений)
- Swagger (документация API)
- Supabase (хранение файлов)
- Docker (контейнеризация)
- PostgreSQL (база данных)

## Установка и запуск

1. Установка зависимостей:

   ```bash
   bun install
   ```

2. Запуск в режиме разработки:

   ```bash
   make dev
   ```

3. Запуск в продакшн режиме:
   ```bash
   make prod
   ```

## Конфигурация

Проект использует переменные окружения для конфигурации. Основные параметры:

- Порты микросервисов
- URI для Redis и RabbitMQ
- Настройки сессий и cookies
- Secrets для OAuth и других интеграций

### Переменные окружения

#### Режим работы приложения

```
NODE_ENV='' # development | production
```

#### Основные настройки приложения

```
API_VERSION=''
APPLICATION_PORT=
APPLICATION_HOST=''
APPLICATION_URL=''
```

#### Настройки микросервисов

```
AUTH_MICROSERVICE_HOST=''
AUTH_MICROSERVICE_PORT=
AUTH_MICROSERVICE_URL=''

USER_MICROSERVICE_HOST=''
USER_MICROSERVICE_PORT=

ANIME_MICROSERVICE_HOST=''
ANIME_MICROSERVICE_PORT=

UPDATE_ANIME_MICROSERVICE_HOST=''
UPDATE_ANIME_MICROSERVICE_PORT=

DOCS_MICROSERVICE_HOST=''
DOCS_MICROSERVICE_PORT=
```

#### Настройки CORS и внешних API

```
ALLOWED_ORIGIN=''
SHIKIMORI_BASE_API_URL=''
```

#### Настройки сессий и cookies

```
COOKIES_SECRET=''
SESSION_SECRET=''
SESSION_NAME=''
SESSION_DOMAIN=''
SESSION_MAX_AGE=''
SESSION_HTTP_ONLY=
SESSION_SECURE=
SESSION_FOLDER=''
```

#### Настройки RabbitMQ

```
RABBIT_MQ_USER=''
RABBIT_MQ_PASSWORD=''
RABBIT_MQ_HOST=''
RABBIT_MQ_PORT=
RABBIT_MQ_URI=''
RABBIT_MQ_MANAGEMENT_PORT=
```

#### Настройки PostgreSQL

```
POSTGRES_USER=''
POSTGRES_PASSWORD=''
POSTGRES_HOST=''
POSTGRES_PORT=
POSTGRES_DB=''
POSTGRES_URI=''
```

#### Настройки Redis

```
REDIS_USER=''
REDIS_PASSWORD=''
REDIS_HOST=''
REDIS_PORT=
REDIS_URI=''
```

#### Настройки почтового сервиса

```
MAIL_HOST=''
MAIL_PORT=
MAIL_LOGIN=''
MAIL_PASS=''
MAIL_FROM=''
```

#### Настройки OAuth и внешних сервисов

```
GOOGLE_RECAPTCHA_SECRET_KEY=''
GOOGLE_CLIENT_ID=''
GOOGLE_CLIENT_SECRET=''

YANDEX_CLIENT_ID=''
YANDEX_CLIENT_SECRET=''
```

#### Настройки Supabase

```
SUPABASE_CDN_SERVICE_URL=''
SUPABASE_CDN_SERVICE_KEY=''
```

## API Документация

Каждый микросервис предоставляет свою Swagger документацию по пути `/docs`. Объединенная документация доступна через Docs Microservice.

## Безопасность

- Валидация входных данных
- Защита от CSRF
- Безопасные сессии
- reCAPTCHA интеграция
- OAuth аутентификация

## Лицензия

MIT License
