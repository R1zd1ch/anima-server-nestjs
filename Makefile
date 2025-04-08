start:
	docker-compose up -d
	bun run start:dev


stop: 
	docker-compose down
