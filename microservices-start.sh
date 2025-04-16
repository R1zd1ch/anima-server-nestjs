#!/bin/sh

echo "Starting service: $APP_MODE"

if [ "$APP_MODE" = "auth" ]; then
  bunx prisma migrate deploy --schema ./prisma/schema
  bun run start
elif [ "$APP_MODE" = "update-anime" ]; then
  bun run start update-anime-microservice
else
  echo "Unknown APP_MODE: $APP_MODE"
  exit 1
fi