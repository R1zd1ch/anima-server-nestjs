#!/bin/sh

echo "Starting service: $APP_MODE"

if [ "$APP_MODE" = "user-microservice" ]; then
  bunx prisma migrate deploy --schema ./prisma/schema
  bun run start
elif [ "$APP_MODE" = "update-anime-microservice" ]; then
  bun run start update-anime-microservice
elif [ "$APP_MODE" = "anime-microservice" ]; then
  bun run start anime-microservice
else
  echo "Unknown APP_MODE: $APP_MODE"
  exit 1
fi