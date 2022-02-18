
start:
	@mkdir -p .docker-data
	@docker-compose up -d hasura-apply auth adminer
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

test: test-auth



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
	@docker-compose up -d auth adminer
	@docker-compose logs -f auth

stop-auth:
	@docker-compose stop auth
	@docker-compose rm -f auth

test-auth:
	@docker-compose up auth-test

build-auth:
	@docker-compose build --no-cache auth

clean-auth: stop
	@rm -rf .docker-data/auth-db

restart-auth: stop-auth start-auth
reset-auth: stop-auth build-auth clean-auth start-auth

#
# Backend
#

start-backend:
	@mkdir -p .docker-data
	@docker-compose up -d backend adminer
	@docker-compose logs -f backend

stop-backend:
	@docker-compose stop backend
	@docker-compose rm -f backend

test-backend:
	@docker-compose up backend-test

build-backend:
	@docker-compose build --no-cache backend

clean-backend: stop
	@rm -rf .docker-data/backend-db

restart-backend: stop-backend start-backend
reset-backend: stop-backend build-backend clean-backend start-backend

logs-backend:
	@docker-compose logs -f backend