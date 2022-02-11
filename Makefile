
start:
	@docker-compose up -d hasura-console adminer
	@docker-compose logs -f hasura-engine

stop:
	@docker-compose down

restart: stop start
reset: stop clean start

build:
	@docker-compose build --no-cache

clean: stop
	@rm -rf .docker-data

test:
	@echo "TODO"

# Hasura Utilities

hasura-console:
	@docker-compose up -d hasura-console
	@docker-compose logs -f hasura-console

hasura-apply:
	@docker-compose up hasura-apply

hasura-export:
	@docker-compose up hasura-export