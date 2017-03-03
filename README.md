# superbowleto
[![Build Status](https://travis-ci.com/pagarme/superbowleto.svg?token=ww4DfNZg23ZMWGQpq4g8&branch=master)](https://travis-ci.com/pagarme/superbowleto)

:football: A microservice to issue, register and manage boletos

## Developing

In order to develop for this project you must have [Docker](https://docs.docker.com/)
and [Docker Compose](https://docs.docker.com/compose/) installed. That's it :) 
no need for Node.js, Postgres, etc.

### First Install

If you never developed in this repo before:

1. **Clone the repository:**
  ```sh
  $ git clone git@github.com:pagarme/superbowleto
  ```

2. **Build the base image:**
  ```sh
  $ docker-compose build base
  ```

### Running tests

Tests are separate in `e2e` and `unit`. You can either run them separately or run them all. 

- **Run all tests:**
  ```sh
  $ docker-compose up test
  ```

- **Run only `e2e` tests:**
  ```sh
  $ docker-compose up test-e2e
  ```

- **Run only `unit` tests:**
  ```sh
  $ docker-compose up test-unit
  ```

### Installing new dependencies

We install our dependencies like npm packages on the Docker image (see our [Dockerfile](https://github.com/pagarme/superbowleto/blob/master/Dockerfile) to understand it better). 

This gives us the advantage of caching the dependencies installation process, so when we build the image again, it's already cached by Docker and the image can be easily distributed with all its dependencies installed.

However, **if you need to install any new dependency**, you **must rebuild the image**, otherwise, your dependency will not be available inside the container.

**You can rebuild the image with the new dependencies by running:**

```sh
$ docker-compose build base
```
