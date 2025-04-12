dev-main: 
	docker start postgres redis
	bun run start:dev server

dev-update-anime:
	docker start postgres redis
	bun run start:dev update-anime


