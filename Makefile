# This will output the help for each task.
# Thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.DEFAULT_GOAL := help
help: ## Show helpful information concerning the available tasks
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
.PHONY: help

console: ## Run all tests, with shell as the interactive console
	@docker-compose run test /bin/sh
.PHONY: console

rebuild: ## Build the test service
	@docker-compose build test
.PHONY: rebuild

teardown: ## Stop and remove local containers
	@docker-compose down -v --rmi local
.PHONY: teardown

lint: ## Run the JavaScript code linting tool
	@docker-compose run lint
.PHONY: lint

test-ci: start-yopa migrate ## Generate coverage report and xml test results report to be published at the CircleCI
	@docker-compose run --entrypoint="npm run test-ci" test --abort-on-container-exit
.PHONY: test-ci

test: start-yopa migrate ## Run all tests
	@docker-compose up --abort-on-container-exit test
.PHONY: test

test-functional: ## Run only functional tests
	@docker-compose run test-functional
.PHONY: test-functional

test-integration: ## Run only integration tests
	@docker-compose run test-integration
.PHONY: test-integration

test-unit: ## Run only unit tests
	@docker-compose run test-unit
.PHONY: test-unit

start-db: ## Start database (postgres)
	@docker-compose up -d postgres
.PHONY: start-db

migrate: ## Run the migrations
	@docker-compose up migrate
.PHONY: migrate

setup-db: ## Start database and run migrations in one command
	start-db migrate
.PHONY: setup-db

start-yopa: ## Start the Yopa service, in detached mode
	@docker-compose up -d yopa
.PHONY: start-yopa

superbowleto-web: ## Run the application server
	@docker-compose up superbowleto-web
.PHONY: superbowleto-web

superbowleto-worker: ## Start the boleto queue processing worker
	@docker-compose up superbowleto-worker
.PHONY: superbowleto-worker

sonar: ## Run the Sonar Scanner tool for the current branch
	sed -i 's/\/superbowleto\/src\//src\//g' coverage/lcov.info
	@docker run -ti -v $(shell pwd):/usr/src pagarme/sonar-scanner -Dsonar.branch.name=${BRANCH}
.PHONY: sonar
