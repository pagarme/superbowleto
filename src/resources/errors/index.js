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
    Object.assign(this, error)
  }
}

export class InvalidParameterError extends BaseError {
  constructor (error = {}) {
    super(error.message)
    this.type = 'invalid_parameter'
    this.field = error.field
    this.errors = error.errors
  }
}

export class ValidationError extends BaseError {
  constructor (error = {}) {
    super(error.message)
    this.type = 'validation'
    this.errors = error.errors
  }
}
