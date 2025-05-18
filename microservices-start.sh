#!/bin/sh

echo "Starting service: $APP_MODE"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ "$APP_MODE" = "auth-microservice" ]; then
  bunx prisma migrate deploy --schema ./prisma/schema
  bun run dist/apps/auth-microservice/main
elif [ "$APP_MODE" = "update-anime-microservice" ]; then
  bun run dist/apps/update-anime-microservice/main
elif [ "$APP_MODE" = "anime-microservice" ]; then
  bun run dist/apps/anime-microservice/main
elif [ "$APP_MODE" = "user-microservice" ]; then
  bun run dist/apps/user-microservice/main
elif [ "$APP_MODE" = "docs-microservice" ]; then
  bun run dist/apps/docs-microservice/main
else
  echo "Unknown APP_MODE: $APP_MODE"
  exit 1
fi