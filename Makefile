
start:
	@docker-compose up -d hasura adminer
	@docker-compose logs -f hasura

stop:
	@docker-compose down

restart: stop start

build:
	@docker-compose build --no-cache

clean: stop
	@rm -rf .docker-data

test:
	@echo "TODO"