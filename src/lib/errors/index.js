class NotFoundError extends Error {
  constructor (error = {}) {
    super(error.message)

    this.name = 'NotFoundError'
    this.type = 'not_found'
  }
}

class InvalidParameterError extends Error {
  constructor (error = {}) {
    super(error.message)

    this.name = 'InvalidParameterError'
    this.type = 'invalid_parameter'
    this.field = error.field
  }
}

class ValidationError extends Error {
  constructor (error = {}) {
    super(error.message)

    this.name = 'ValidationError'
    this.type = 'validation'
    this.errors = error.errors
  }
}

class DatabaseError extends Error {
  constructor (error = {}) {
    super(error.message)

    this.name = 'DatabaseError'
    this.type = 'database'
  }
}

class InternalServerError extends Error {
  constructor (error = {}) {
    super(error.message)

    this.name = 'InternalServerError'
    this.type = 'internal'
  }
}

module.exports = {
  NotFoundError,
  InvalidParameterError,
  ValidationError,
  DatabaseError,
  InternalServerError
}
