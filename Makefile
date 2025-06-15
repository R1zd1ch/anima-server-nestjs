dev-auth: 
	docker start postgres redis
	bun run start:dev

dev-user:
	docker start postgres redis
	bun run start:dev user-microservice

dev-update-anime:
	docker start postgres redis
	bun run start:dev update-anime-microservice

dev-anime:
	docker start postgres redis
	bun run start:dev anime-microservice

dev-docs: 
	docker start postgres redis
	bun run start:dev docs-microservice

install:
	bun install

prisma-generate: 
	bunx prisma generate --schema prisma/schema 

prisma-migrate:
	bunx prisma migrate dev --schema prisma/schema

prisma-postgres-push:
	bunx prisma postgres push --schema prisma/schema

run-all:
	docker-compose up -d

rebuild:
	docker-compose up -d --build

.PHONY: dev