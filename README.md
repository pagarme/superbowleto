# superbowleto
[![Build Status](https://travis-ci.com/pagarme/superbowleto.svg?token=ww4DfNZg23ZMWGQpq4g8&branch=master)](https://travis-ci.com/pagarme/superbowleto)

:football: A microservice to issue, register and manage boletos

## TOC

- [Technology](#technology)
- [Developing](#developing)
	- [First Install](#first-install)
	- [Running tests](#running-tests)
	- [Installing new dependencies](#installing-new-dependencies)
- [Testing](#testing)
- [Understanding the Data Flow](#understanding-the-data-flow)
	- [1. Creating the boleto](#1-creating-the-boleto)
	- [2. Consuming `boletos-to-register-queue`](#2-consuming-boletos-to-register-queue)
	- [3. Attempting to register boletos](#3-attempting-to-register-boletos)
	- [4. Checking the status of `pending_registration` boletos.](#4-checking-the-status-of-pendingregistration-boletos)
	- [5. Notifying the registration of a boleto.](#5-notifying-the-registration-of-a-boleto)

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

  - `Functional` tests check a particular feature for correctness by comparing the results for a given input against the specification. Functional tests don't concern themselves with intermediate results or side-effects, just the result[<sup>ref</sup>](http://stackoverflow.com/questions/4904096/whats-the-difference-between-unit-functional-acceptance-and-integration-test).

    The folder structure of functional tests does not need to mirror the source folder, and the files can be organized as they seem fit. One way to organize this files is by `feature` or `user-story`. For instance, take a look at the example below, where `boleto/create.js` and `boleto/register.js` are complete user stories:

    ```
    ├── test
        └── integration
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

## Understanding the Data Flow

The process of creating and registrating boletos has a lot of logical branches and business domain rules. However the main data flow of this process can be summarized into these simple conceptual steps described below:

### 1. Creating the boleto

At the beginning, we need to create the boleto. There's a lambda function for
this that is triggered by an `HTTP` event. The boleto is created in the database
and sent to an SQS queue called `boletos-to-register`.

**Important:** In order to create a boleto, the client must specify a queue url that it's going
to be later used for notifying an eventual successful attempt of registration.

The boleto is created with an `issued` status.

```
+-------+           +---------+             +-----------+      +-----+
| HTTP  |           | Lambda  |             | Database  |      | SQS |
+-------+           +---------+             +-----------+      +-----+
    |                    |                        |               |
    | POST /boletos      |                        |               |
    |------------------->|                        |               |
    |                    |                        |               |
    |                    | Boleto.create()        |               |
    |                    |----------------------->|               |
    |                    |                        |               |
    |                    |       "Boleto created" |               |
    |                    |<-----------------------|               |
    |                    |                        |               |
    |                    | Post to Queue (boletos-to-register)    |
    |                    |--------------------------------------->|
    |                    |                        |               |
    |        201 created |                        |               |
    |<-------------------|                        |               |
    |                    |                        |               |
```

### 2. Consuming `boletos-to-register-queue`

There's a lambda function triggered by a `Schedule` event (cronjob) that consume
the messages from the `boletos-to-register-queue`

This function consumes the queue (with it's inside polling logic) and invokes
another lambda function that attempts to register each boleto.

```
+-----------+     +-----------------+                           +-----+ +-----------------+
| Schedule  |     | ConsumerLambda  |                           | SQS | | RegisterLambda  |
+-----------+     +-----------------+                           +-----+ +-----------------+
      |                    |                                       |             |
      | n seconds          |                                       |             |
      |------------------->|                                       |             |
      |                    |                                       |             |
      |                    | ReceiveMessage `boletos-to-create`    |             |
      |                    |-------------------------------------->|             |
      |                    |                                       |             |
      |                    |                    Messages (boletos) |             |
      |                    |<--------------------------------------|             |
      |                    |                                       |             |
      |                    | foreach message invoke()              |             |
      |                    |---------------------------------------------------->|
      |                    |                                       |             |
```

### 3. Attempting to register boletos

For each boleto on `boletos-to-create` queue, the SQS consumer will invoke a
`RegisterLambda` to attempt to register the boleto on the specified provider.

The only information the message has is the `boleto_id`, so the following steps
must are taken to fetch the boleto information and attempting to register it:

1. **Query the database with the `boleto_id`.**
2. **Check if the status is eligible for a registration attempt:** the only
status ATM is `issued`)
3. **Attempt to register the boleto within the provider.** Here we have 3 possible
  outcomes:
    a. **The registration is successful**: in this case we set the boleto to a
    `registered` status and post a message to the boleto's queue url.
    b. **The registration is unsuccessful**: in this case (where the provider
    denied the registration of the boleto), we set the boleto status to `refused`.
    c. **The registration is indeterminate**: in this case (where the provider
    couldn't give a sync response) we set the boleto status to `pending_registration`

### 4. Checking the status of `pending_registration` boletos.

If the provider can't respond the registration attempt synchronously, we set the
boleto status to `pending_registration` and we need to later check the registration
status within the provider.

We have a lambda function triggered by a `Schedule` event (every n minutes) that
does the following:

1. **Find all pending_registration_boletos**: query the database for boletos
  with status `pending_registration`
2. **Check the status within the provider**: for every `pending_registration`
  boleto, check the provider API to check the status of the registration.

### 5. Notifying the registration of a boleto.

When creating a boleto, the client must specify a queue on which it wants to be
notified. For instance, we could create a boleto with a queue_url: `http://sqs.my-queue/boletos`.

When a boleto is registered successfully (either sync or asynchronously), a message
will be posted to this specified queue.

So in order for the client to keep track of registered boletos, it must keep polling
the specified queue (in this case: `http://sqs.my-queue/boletos`) for messages.
