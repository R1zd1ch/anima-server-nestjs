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

rebuild:
	docker-compose up -d --build