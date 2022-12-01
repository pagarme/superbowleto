<img src="https://avatars1.githubusercontent.com/u/3846050?v=4&s=200" width="127px" height="127px" align="left"/>

# superbowleto

[![Build Status](https://travis-ci.org/pagarme/superbowleto.svg?branch=master)](https://travis-ci.org/pagarme/superbowleto)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=alert_status&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=security_rating&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=reliability_rating&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=bugs&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=sqale_rating&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=vulnerabilities&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=code_smells&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=ncloc&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=coverage&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=duplicated_lines_density&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=pagarme-superbowleto&metric=sqale_index&token=d099a5e52b20b74b423a1504653b3795a42df4b9)](https://sonarcloud.io/summary/new_code?id=pagarme-superbowleto)

:football: A microservice to issue, register and manage boletos

## Table of Contents

- [Technology](#technology)
- [Developing](#developing)
  - [First Install](#first-install)
  - [Running the server](#running-the-server)
  - [Running tests](#running-tests)
  - [Installing new dependencies](#installing-new-dependencies)
- [Testing](#testing)
- [Data Flow](#data-flow)
  - [Server](#server)
    - [1. POST /boletos](#post-boletos)
      - [a) Provider **could** process the boleto](#a-provider-could-process-the-boleto)
      - [b) Provider **could not** process the boleto](#b-provider-could-not-process-the-boleto)
    - [2. GET /boletos](#get-boletos)
    - [3. GET /boletos/:id](#get-boletosid)
  - [Worker](#worker)
    - [1. Process `boletos-to-register` queue](#process-boletos-to-register-queue)

## Technology

Here's a brief overview of our technology stack:

- **[Docker](https://docs.docker.com)** and **[Docker Compose](https://docs.docker.com/compose/)** to create our development and test environments.
- **[AWS Fargate](https://aws.amazon.com/fargate/)** to manage and deploy our containers.
- **[AWS SQS](https://aws.amazon.com/documentation/sqs/)** as a queue manager to process things like boletos to register and **[SQS Quooler](https://github.com/pagarme/sqs-quooler)** as a package to make the interaction with queues more easy.
- **[Postgres](https://www.postgresql.org)** as to store our data and **[Sequelize](http://docs.sequelizejs.com)** as a Node.js ORM.
- **[Ava](https://github.com/avajs/ava)** as a test runner and **[Chai](http://chaijs.com)** to do some more advanced test assertions.
- **[Express](https://github.com/expressjs/express)** as a tool to build the web server that handles our boleto endpoints.

## Developing

In order to develop for this project you must have [Docker](https://docs.docker.com/)
and [Docker Compose](https://docs.docker.com/compose/) installed.

### First Install

If you never developed in this repo before:

1. **Clone the repository:**

```sh
$ git clone git@github.com:pagarme/superbowleto
```

2. **Build the base images:**

```sh
$ docker-compose build superbowleto-web
```

### Running the server

To run the server, you will have to start the database and run the migrations.

1. **Start database and run migrations in one command:**

```sh
$ make setup-db
```

2. **Or start database and run migrations separately:**

- **Start database (postgres):**

  ```sh
  $ make start-db
  ```

- **Run the migrations:**
  ```sh
  $ make migrate
  ```

3. **Then finally run the server:**

```sh
$ make superbowleto-web
```

### Running tests

Tests are separate in `functional`, `integration` and `unit`. You can either run them separately or run them all.

- **Run all tests:**

  ```sh
  $ docker-compose run test
  ```

- **Run only `functional` tests:**

  ```sh
  $ docker-compose run test npm run test-functional
  ```

- **Run only `integration` tests:**

  ```sh
  $ docker-compose run test npm run test-integration
  ```

- **Run only `unit` tests:**
  ```sh
  $ docker-compose run test npm run test-unit
  ```

For the CI purposes we have a specif command that will generate coverage report and xml test results report to be published at the CircleCI.

```sh
$ docker-compose run --entrypoint="npm run test-ci" test --abort-on-container-exit
```

### Installing new dependencies

We install our dependencies (aka npm dependencies) inside the Docker image (see our [Dockerfile](https://github.com/pagarme/superbowleto/blob/master/Dockerfile) to understand it better).

This gives us the advantage of caching the dependencies installation process, so when we build the image again, it's already cached by Docker and the image can be easily distributed with all its dependencies installed.

However, **if you need to install any new dependency**, you **must rebuild the image**, otherwise, your dependency will not be available inside the container.

**You can install dependencies and rebuild the image by running:**

```sh
$ docker-compose run test npm install --save ramda
$ docker-compose build test
```

## Testing

Tests are found inside the `test/` directory and are separate by type: `functional`, `integration` and `unit`. It's also common to have some `helpers` folders alongside the tests.

- `Unit` tests are used to test the smallest units of functionality, typically a method or a function [<sup>ref</sup>](http://stackoverflow.com/questions/4904096/whats-the-difference-between-unit-functional-acceptance-and-integration-test).

  The folder structure of the unit tests tend to mirror the folder structure of the `src` folder. For instance, we generally see the following folder structure:

  ```
  ├── src
  │   ├── index.js
  │   └── lib
  │       └── http.js
  └── test
      └── unit
          ├── index.js
          └── lib
              └── http.js
  ```

- `Integration` tests build on unit tests by combining the units of code and testing that the resulting combination functions correctly[<sup>ref</sup>](http://stackoverflow.com/questions/4904096/whats-the-difference-between-unit-functional-acceptance-and-integration-test).

  The folder structure of the integration tests tend to mirror the folder structure of the `src` folder. For instance, we generally see the following folder structure:

  ```
  ├── src
  │   ├── index.js
  │   └── lib
  │       └── http.js
  └── test
      └── integration
          ├── index.js
          └── lib
              └── http.js
  ```

- `Functional` tests check a particular feature for correctness by comparing the results for a given input against the specification. Functional tests don't concern themselves with intermediate results or side-effects, just the result[<sup>ref</sup>](http://stackoverflow.com/questions/4904096/whats-the-difference-between-unit-functional-acceptance-and-integration-test).

  The folder structure of functional tests does not need to mirror the source folder, and the files can be organized as they seem fit. One way to organize this files is by `feature` or `user-story`. For instance, take a look at the example below, where `boleto/create.js` and `boleto/register.js` are complete user stories:

  ```
  ├── test
      └── functional
          └── boleto
              └── create.js
              └── register.js
  ```

- `Helpers` do not test anything, but instead provide tools for the tests. Inside the `helpers` folders one can have `fixtures` (also know as "mocks"), or some util functions.

  For instance, if you need credit card information to perform various tests in many different places, or if you need an util function that is called before your tests are ran, you could place them inside a `helpers` folder in order to not repeat yourself:

  ```javascript
  const creditCardMock = {
    number: 4242424242424242,
    holder_name: "David Bowie",
    expiration_date: 1220,
    cvv: 123,
  };

  const cleanUpBeforeTests = () => {
    db.reset();
  };

  module.exports = {
    creditCardMock,
    cleanUpBeforeTests,
  };
  ```

  `Helpers` folders can be created at any level within the `test` folder structure. If some helper is used only for unit tests, it should reside within `test/unit/helpers`. If the helpers is used across all tests, it should reside within `test/helpers`. If there's a helper that is used only for testing the http module on integration tests, then it should reside within `test/integration/http/helpers`.

## Data Flow

This project has two programs, the `worker` and the `server`.

### Server

This section documents what every endpoint of the `server` does.

#### 1. POST /boletos

Create a new boleto.

After creating the boleto (on our database), we will try to register the boleto withing the provider. Here, there's two possible outcomes: a) the provider could be reached, could process the boleto and gave us a status (either `registered` or `refused`); or b) the provider could not be reached or could not process the boleto (giving us an `unknown`/`undefined`/`try_later` status).

##### a) Provider **could** process the boleto

The following steps illustrate the case where the provider **could** be reached and it could process the boleto.

1. The `Client` makes an HTTP request to create a boleto.
1. We create the boleto in the `Database` with status `issued`.
1. We try to register the boleto within the Provider.
1. The provider returns an answer (either `registered` or `refused`).
1. We update the boleto status in the `Database`.
1. We return the response to the `Client` (HTTP response).

![1a-post-boletos-diagram](https://user-images.githubusercontent.com/15306309/41662266-1b84c1c8-7477-11e8-8ba3-b72c2fbecfdd.png)

_Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams/server](docs/diagrams/server)_

##### b) Provider **could not** process the boleto

The following steps illustrate the case where the provider **could** be reached and it could process the boleto.

1. The `Client` makes an HTTP request to create a boleto.
1. We create the boleto in the `Database` with status `issued`.
1. We try to register the boleto within the Provider.
1. The provider could not be reached or could not process the boleto.
1. We update the boleto status in the `Database` to `pending_registration`.
1. We send the boleto (`boleto_id` and `issuer`) to an SQS queue called `boletos-to-register`. This queue will be processed by the `worker` later.
1. We return the response to the `Client` (HTTP response) with the `status = pending_registration`.

![1b-post-boletos-diagram](https://user-images.githubusercontent.com/15306309/41662267-1b8eb7b4-7477-11e8-8a73-7d8293990e4a.png)

_Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams/server](docs/diagrams/server)_

**Example:**

> `POST /boletos`

```json
Content-Type: application/json

{
  "queue_url": "http://yopa/queue/test",
  "expiration_date": "Tue Apr 18 2017 18:46:59 GMT-0300 (-03)",
  "amount": 2000,
  "instructions": "Please do not accept after expiration_date",
  "issuer": "bradesco",
  "payer_name": "David Bowie",
  "payer_document_type": "cpf",
  "payer_document_number": "98154524872"
}
```

> `201 Created`

```json
Content-Type: application/json

{
  "queue_url": "http://yopa/queue/test",
  "status": "issued | registered | refused",
  "expiration_date": "Tue Apr 18 2017 18:46:59 GMT-0300 (-03)",
  "amount": 2000,
  "instructions": "Please do not accept after expiration_date",
  "issuer": "bradesco",
  "issuer_id": null,
  "title_id": "null",
  "payer_name": "David Bowie",
  "payer_document_type": "cpf",
  "payer_document_number": "98154524872"
}
```

#### 2. GET /boletos

Retrieve all boletos.

![2-get-boletos-diagram](https://user-images.githubusercontent.com/15306309/41662275-20dd54be-7477-11e8-8060-ba643d705add.png)

_Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams/server](docs/diagrams/server)_

**Example:**

> `GET /boletos`

```json
Content-Type: application/json

{
  "count": "10",
  "page": "1"
}
```

> `200 Ok`

```json
Content-Type: application/json

[{
  "id": "bol_cj1o33xuu000001qkfmlc6m5c",
  "status": "issued",
  "queue_url": "http://yopa/queue/test",
  "expiration_date": "Tue Apr 18 2017 18:46:59 GMT-0300 (-03)",
  "amount": 2000,
  "instructions": "Please do not accept after expiration_date",
  "issuer": "bradesco",
  "issuer_id": null,
  "title_id": "null",
  "payer_name": "David Bowie",
  "payer_document_type": "cpf",
  "payer_document_number": "98154524872"
}]
```

#### 3. GET /boletos/:id

Find one boleto by id.

![3-get-boletos-id-diagram](https://user-images.githubusercontent.com/15306309/41662280-2426d80c-7477-11e8-8990-615aee30c040.png)

_Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams/server](docs/diagrams/server)_

**Example:**

> `GET /boletos/:id`

```json
Content-Type: application/json

{
  "id": "bol_cj1o33xuu000001qkfmlc6m5c"
}
```

> `200 Ok`

```json
Content-Type: application/json

{
  "id": "bol_cj1o33xuu000001qkfmlc6m5c",
  "status": "issued",
  "queue_url": "http://yopa/queue/test",
  "expiration_date": "Tue Apr 18 2017 18:46:59 GMT-0300 (-03)",
  "amount": 2000,
  "instructions": "Please do not accept after expiration_date",
  "issuer": "bradesco",
  "issuer_id": null,
  "title_id": "null",
  "payer_name": "David Bowie",
  "payer_document_type": "cpf",
  "payer_document_number": "98154524872"
}
```

### Worker

This section documents what the `worker` processes.

#### 1. Process `boletos-to-register` queue

This is a worker which consumes the queue which has boletos to register and effectively register them.

When a boleto can't be registered within the provider at the moment of its creation, it will be posted to a SQS Queue called `boletos-to-register`. This worker is responsible for processing this queue. Here are the steps:

1. This worker consumer function is triggered when an item is on the queue
1. Using `sqs-quooler` we then start to poll items from SQS (`sqs.receiveMessage`)
1. Each message received has a `boleto` ({ id, issuer}) and a `message` (the raw SQS message from `boletos-to-register` queue).
1. We use the boleto `id` to find the boleto on `Database`.
1. We check if the boleto can be registered, i.e. if the status of the boleto is either `issued` or `pending_registration`.
1. If the boleto can be registered, we try to register it within the provider.
1. If the provider could not process the boleto, we stop executing here. The SQS Message will then go back to `boletos-to-register` queue and will be later processed.
1. We update the boleto status with either `registered` or `refused`.
1. **IMPORTANT:** After the boleto is updated, we notify the boleto owner by sendin an SQS message to the queue the owner specified on the boleto creation (aka: `boleto.queue_url`). The owner will then handle the processing of these SQS Messages. That's the only way we can notify the boleto owner that a boleto that went to `boletos-to-register` queue was updated. That's why it's mandatory to pass a queue at the moment of the boleto creation.
   ![1-process-boletos-to-register-queue-diagram](https://user-images.githubusercontent.com/15306309/41662291-27f4a414-7477-11e8-9308-50968e9fb827.png)

_Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams/worker](docs/diagrams/worker)_
