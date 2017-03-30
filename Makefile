console:
	@docker-compose run test /bin/sh
.PHONY: console

rebuild:
	@docker-compose build test
.PHONY: rebuild

teardown:
	@docker-compose down -v --rmi local
.PHONY: teardown

test:
	@docker-compose run test
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
