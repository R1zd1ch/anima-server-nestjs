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

prisma-db-push:
	bunx prisma db push --schema prisma/schema

rebuild:
	docker-compose up -d --build


.PHONY: dev