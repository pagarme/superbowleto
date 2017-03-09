console:
	@docker-compose run base /bin/sh
.PHONY: console

rebuild:
	@docker-compose build base
.PHONY: rebuild

teardown:
	@docker-compose down -v --rmi local
.PHONY: teardown

test:
	@docker-compose up test
.PHONY: test

test-e2e:
	@docker-compose up test-e2e
.PHONY: test-e2e

test-unit:
	@docker-compose up test-unit
.PHONY: test-unit
