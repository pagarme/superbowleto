# superbowleto :football:
[![Build Status](https://travis-ci.org/pagarme/superbowleto.svg?branch=master)](https://travis-ci.org/pagarme/superbowleto)

:football: A microservice to issue, register and manage boletos

## Table of Contents

- [Technology](#technology)
- [Developing](#developing)
	- [First Install](#first-install)
	- [Running tests](#running-tests)
	- [Installing new dependencies](#installing-new-dependencies)
- [Testing](#testing)
- [Lambdas and Data Flow](#lambdas-and-data-flow)
	- [1. Boleto: create](#4-boleto-create)
		- [a) Provider **could** process the boleto](#a-provider-could-process-the-boleto)
		- [b) Provider **could not** process the boleto](#b-provider-could-not-process-the-boleto)
	- [2. Boleto: index](#5-boleto-index)
	- [3. Boleto: show](#6-boleto-show)
	- [4. Boleto: process `boletos-to-register` queue](#7-boleto-process-boletos-to-register-queue)
	- [5. Boleto: register](#8-boleto-register)

## Technology

Here's a brief overview of our technology stack:

- **[Docker](https://docs.docker.com)** and **[Docker Compose](https://docs.docker.com/compose/)** to create our development and test environments.
- **[Serverless Framework](https://serverless.com)** to manage and deploy our **[AWS Lambda](https://aws.amazon.com/documentation/lambda/)** functions.
- **[AWS SQS](https://aws.amazon.com/documentation/sqs/)** as a queue manager to process things like boletos to register.
- **[Postgres](https://www.postgresql.org)** as to store our data **[Sequelize](http://docs.sequelizejs.com)** as a Node.js ORM.
- **[Babel](Babel)** to transpile our code written in modern Javascript and we use multiple **[Webpack](http://webpack.js.org)** configurations to bundle our code for production, test and development.
- **[Ava](https://github.com/avajs/ava)** as a test runner and **[Chai](http://chaijs.com)** to do some more advanced test assertions.
- **[Yarn](https://yarnpkg.com/en/)** to install npm dependencies.

## Developing

In order to develop for this project you must have [Docker](https://docs.docker.com/)
and [Docker Compose](https://docs.docker.com/compose/) installed.

### First Install

If you never developed in this repo before:

1. **Clone the repository:**
  ```sh
  $ git clone git@github.com:pagarme/superbowleto
  ```

2. **Build the base image:**
  ```sh
  $ docker-compose build test
  ```

### Running tests

Tests are separate in `functional`, `integration` and `unit`. You can either run them separately or run them all.

- **Run all tests:**
  ```sh
  $ docker-compose run test
  ```

- **Run only `functional` tests:**
  ```sh
  $ docker-compose run test yarn run test-functional
  ```

- **Run only `integration` tests:**
  ```sh
  $ docker-compose run test yarn run test-integration
  ```

- **Run only `unit` tests:**
  ```sh
  $ docker-compose run test yarn run test-unit
  ```

### Installing new dependencies

We install our dependencies (aka npm dependencies) inside the Docker image (see our [Dockerfile](https://github.com/pagarme/superbowleto/blob/master/Dockerfile) to understand it better).

This gives us the advantage of caching the dependencies installation process, so when we build the image again, it's already cached by Docker and the image can be easily distributed with all its dependencies installed.

However, **if you need to install any new dependency**, you **must rebuild the image**, otherwise, your dependency will not be available inside the container.

**You can install dependencies and rebuild the image by running:**

```sh
$ docker-compose run test yarn add jquery
$ docker-compose build test
```

## Testing

Tests are found inside the `test/` directory and are separate by type: `functional`, `integration` and `unit`. It's also common to have some `helpers` folders alongside the tests.

  - `Unit` tests are used to test the smallest units of functionality, typically a method or a function [<sup>ref</sup>](http://stackoverflow.com/questions/4904096/whats-the-difference-between-unit-functional-acceptance-and-integration-test).

    The folder structure of the unit tests tend to mirror the folder structure of the `src` folder. For instance, we generally see the following folder structure:

    ```
    ├── src
    │   ├── index.js
    │   └── lib
    │       └── http.js
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
    │   ├── index.js
    │   └── lib
    │       └── http.js
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
    export const creditCardMock = {
      number: 4242424242424242,
      holder_name: 'David Bowie',
      expiration_date: 1220,
      cvv: 123,
    }

    export const cleanUpBeforeTests = () => {
      db.reset();
    }
    ```

    `Helpers` folders can be created at any level within the `test` folder structure. If some helper is used only for unit tests, it should reside within `test/unit/helpers`. If the helpers is used across all tests, it should reside within `test/helpers`. If there's a helper that is used only for testing the http module on integration tests, then it should reside within `test/integration/http/helpers`.

## Lambdas and Data Flow

This project is designed in AWS Lambda functions and has some logical branches and business domain rules that can be hard to understand. This section documents what every Lambda function does how it fits in the entire project.

### 1. Boleto: create

Create a new boleto.

After creating the boleto (on our database), we will try to register the boleto withing the provider. Here, there's two possible outcomes: a) the provider could be reached, could process the boleto and gave us a status (either `registered` or `refused`); or b) the provider could not be reached or could not process the boleto (giving us an `unknown`/`undefined`/`try_later` status).

#### a) Provider **could** process the boleto

The following steps illustrate the case where the provider **could** be reached and it could process the boleto.

1. The `Client` makes an HTTP request to create a boleto.
1. We create the boleto in the `Database` with status `issued`.
1. We try to register the boleto within the Provider.
1. The provider returns an answer (either `registered` or `refused`).
1. We update the boleto status in the `Database`.
1. We return the response to the `Client` (HTTP response).

![](https://cloud.githubusercontent.com/assets/7416751/25156832/8f07ae62-2473-11e7-9dd1-663df65860d3.png)

*Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams](docs/diagrams)*

#### b) Provider **could not** process the boleto

The following steps illustrate the case where the provider **could** be reached and it could process the boleto.

1. The `Client` makes an HTTP request to create a boleto.
1. We create the boleto in the `Database` with status `issued`.
1. We try to register the boleto within the Provider.
1. The provider could not be reached or could not process the boleto.
1. We update the boleto status in the `Database` to `pending_registration`.
1. We send the boleto (`boleto_id` and `issuer`) to an SQS queue called `boletos-to-register`. This queue will be processed by another Lambda later.
1. We return the response to the `Client` (HTTP response) with the `status = pending_registration`.

![](https://cloud.githubusercontent.com/assets/7416751/25156834/8f0a0568-2473-11e7-87f1-6bcbdb4c6a3f.png)

*Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams](docs/diagrams)*

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

### 2. Boleto: index

Retrieve all boletos.

![](https://cloud.githubusercontent.com/assets/7416751/25156835/8f0a3376-2473-11e7-92e7-6634c60afddc.png)

*Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams](docs/diagrams)*

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

### 3. Boleto: show

Find one boleto by id.

![](https://cloud.githubusercontent.com/assets/7416751/25156829/8e9d40a4-2473-11e7-9497-3b7a8dcef9e9.png)

*Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams](docs/diagrams)*

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

### 4. Boleto: process `boletos-to-register` queue

Process the `boletos-to-regiter-queue`. This Lambda function is triggered by the **Schedule Event** (runs every `n` minutes).

When a boleto can't be registered within the provider at the moment of its creation, it will be posted to a SQS Queue called `boletos-to-register`. This function is responsible for processing this queue. Here are the steps:

1. This function is triggered by a **Schedule Event** that runs every `n` minutes.
1. Using `sqs-quooler` we then start to poll items from SQS (`sqs.receiveMessage`)
1. For each message received we invoke a Lambda function called `register` with the boleto information and the SQS Message as parameters.
1. `sqs-quooler` package will repeat this `pollItems->receive->invokeRegisterLambda` cycle until this Lambda dies (max 5 minutes).

![](https://cloud.githubusercontent.com/assets/7416751/25156830/8f057f34-2473-11e7-8baa-4617c5c5f1c7.png)

*Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams](docs/diagrams)*

### 5. Boleto: register

Register a boleto. This Lambda function is invoked by another Lambda function: process `boletos-to-register` queue.

This function registers boletos that went to the `boletos-to-register` queue. Here are the steps of execution:

1. The function is invoked by the queueProcessor and receives `boleto` ({ id, issuer}) and `message` (the raw SQS message from `boletos-to-register` queue).
1. We use the boleto `id` to find the boleto on `Database`.
1. We check if the boleto can be registered, i.e. if the status of the boleto is either `issued` or `pending_registration`.
1. If the boleto can be registered, we try to register it within the provider.
1. If the provider could not process the boleto, we stop executing here. The SQS Message will then go back to `boletos-to-register` queue and will be later processed.
1. We update the boleto status with either `registered` or `refused`.
1. **IMPORTANT:** After the boleto is updated, we notify the boleto owner by sendin an SQS message to the queue the owner specified on the boleto creation (aka: `boleto.queue_url`). The owner will then handle the processing of these SQS Messages. That's the only way we can notify the boleto owner that a boleto that went to `boletos-to-register` queue was updated. That's why it's mandatory to pass a queue at the moment of the boleto creation.

![](https://cloud.githubusercontent.com/assets/7416751/25156837/8f5971de-2473-11e7-918f-f059a5fba408.png)

*Diagram built with [mermaid.js](http://knsv.github.io/mermaid/). Check out the source code at [docs/diagrams](docs/diagrams)*
