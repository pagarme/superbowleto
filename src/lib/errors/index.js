class BaseError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends BaseError {
  constructor (error = {}) {
    super(error.message)
    this.type = 'not_found'
  }
}

export class InvalidParameterError extends BaseError {
  constructor (error = {}) {
    super(error.message)
    this.type = 'invalid_parameter'
    this.field = error.field
  }
}

export class ValidationError extends BaseError {
  constructor (error = {}) {
    super(error.message)
    this.type = 'validation'
    this.errors = error.errors
  }
}

export class DatabaseError extends BaseError {
  constructor (error = {}) {
    super(error.message)
    this.type = 'database'
  }
}

export class InternalServerError extends BaseError {
  constructor (error = {}) {
    super(error.message)
    this.type = 'internal'
  }
}
