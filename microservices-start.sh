#!/bin/sh

echo "Starting service: $APP_MODE"

if [ "$APP_MODE" = "user-microservice" ]; then
  bunx prisma migrate deploy --schema ./prisma/schema
  bun run dist/apps/user-microservice/main
elif [ "$APP_MODE" = "update-anime-microservice" ]; then
  bun run dist/apps/update-anime-microservice/main
elif [ "$APP_MODE" = "anime-microservice" ]; then
  bun run dist/apps/anime-microservice/main
else
  echo "Unknown APP_MODE: $APP_MODE"
  exit 1
fi