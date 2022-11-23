console:
	@docker-compose run test /bin/sh
.PHONY: console

rebuild:
	@docker-compose build test
.PHONY: rebuild

teardown:
	@docker-compose down -v --rmi local
.PHONY: teardown

test-ci: start-yopa migrate
	@docker-compose run --entrypoint="npm run test-ci" test --abort-on-container-exit
.PHONY: test-ci

test: start-yopa migrate
	@docker-compose up --abort-on-container-exit test
.PHONY: test

test-functional:
	@docker-compose run test-functional
.PHONY: test-functional

test-integration:
	@docker-compose run test-integration
.PHONY: test-integration

test-unit:
	@docker-compose run test-unit
.PHONY: test-unit

start-db:
	@docker-compose up -d postgres
.PHONY: start-db

migrate:
	@docker-compose up migrate
.PHONY: migrate

setup-db: start-db migrate
.PHONY: setup-db

start-yopa:
	@docker-compose up -d yopa
.PHONY: start-yopa

superbowleto-web:
	@docker-compose up superbowleto-web
.PHONY: superbowleto-web

superbowleto-worker:
	@docker-compose up superbowleto-worker
.PHONY: superbowleto-worker
