
start:
	@mkdir -p .docker-data
	@docker-compose up -d hasura-apply login adminer
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

test: test-login



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
# Login
#

start-login:
	@mkdir -p .docker-data
	@docker-compose up -d login adminer
	@docker-compose logs -f login

stop-login:
	@docker-compose stop login
	@docker-compose rm -f login

test-login:
	@docker-compose up login-test

build-login:
	@docker-compose build --no-cache login

clean-login: stop
	@rm -rf .docker-data/login-db

restart-login: stop-login start-login
reset-login: stop-login build-login clean-login start-login

logs-login:
	@docker-compose logs -f login

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

#
# Client
#

start-client:
	@mkdir -p .docker-data
	@docker-compose up -d client adminer
	@docker-compose logs -f client

stop-client:
	@docker-compose stop client
	@docker-compose rm -f client

build-client:
	@docker-compose build --no-cache client

restart-client: stop-client start-client
reset-client: stop-client build-client clean-client start-client

logs-client:
	@docker-compose logs -f client