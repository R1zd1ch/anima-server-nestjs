FROM oven/bun:1-slim AS builder
ARG SERVICE=auth-microservice

WORKDIR /app

COPY package.json bun.lock* ./
RUN apt-get update -y && apt-get install -y openssl
RUN bun install
RUN bun add @prisma/client

COPY prisma/schema ./prisma/schema/
COPY microservices-start.sh ./start.sh
RUN bunx prisma generate --schema ./prisma/schema

COPY . .

RUN bun run build ${SERVICE}

# CMD ["./start.sh"]

# FROM oven/bun:1-slim AS runnerl
# ARG SERVICE=auth-microservice
# WORKDIR /app
# RUN apt-get update -y && apt-get install -y openssl

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist/apps/${SERVICE} ./dist/apps/${SERVICE}
# COPY --from=builder /app/apps/${SERVICE} ./apps/${SERVICE}
# COPY --from=builder /app/start.sh ./start.sh
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/bun.lock* ./bun.lock
# COPY --from=builder /app/nest-cli.json ./nest-cli.json
# COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
# COPY --from=builder /app/tsconfig.json ./tsconfig.json
# COPY --from=builder /app/.env ./.env
# COPY --from=builder /app/shared ./shared

# ENV NODE_ENV=production
# ENV SERVICE=${SERVICE}

CMD ["./start.sh"]

