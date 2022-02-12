
start:
	@mkdir -p .docker-data
	@docker-compose up -d hasura-console auth adminer
	@docker-compose logs -f hasura-engine

stop:
	@docker-compose down

restart: stop start
reset: stop build clean start

build:
	@docker-compose build --no-cache

clean: stop
	@rm -rf .docker-data
	@mkdir -p .docker-data

test:
	@echo "TODO"



#
# Hasura Utilities
#

hasura-console:
	@docker-compose up -d hasura-console
	@docker-compose logs -f hasura-console

hasura-apply:
	@docker-compose up hasura-apply

hasura-export:
	@docker-compose up hasura-export


#
# Auth
#

start-auth:
	@mkdir -p .docker-data
	@docker-compose up -d auth
	@docker-compose logs -f auth

stop-auth:
	@docker-compose stop auth
	@docker-compose rm -f auth

test-auth:
	@docker-compose up auth-test

build-auth:
	@docker-compose build --no-cache auth

clean: stop
	@rm -rf .docker-data/auth-db

restart-auth: stop-auth start-auth
reset-auth: stop-auth build-auth clean-auth start-auth