class BaseError extends Error {
  name: string
  message: string
  type: string
  field?: string
  errors?: any[]

  constructor (message?: string) {
    super(message)
  }
}

export class NotFoundError extends BaseError {
  constructor (error: any = {}) {
    super(error.message)

    Object.setPrototypeOf(this, NotFoundError.prototype)
    this.name = 'NotFoundError'
    this.type = 'not_found'
  }
}

export class InvalidParameterError extends BaseError {
  constructor (error: any = {}) {
    super(error.message)

    Object.setPrototypeOf(this, InvalidParameterError.prototype)
    this.name = 'InvalidParameterError'
    this.type = 'invalid_parameter'
    this.field = error.field
  }
}

export class ValidationError extends BaseError {
  constructor (error: any = {}) {
    super(error.message)

    Object.setPrototypeOf(this, ValidationError.prototype)
    this.name = 'ValidationError'
    this.type = 'validation'
    this.errors = error.errors
  }
}

export class DatabaseError extends BaseError {
  constructor (error: any = {}) {
    super(error.message)

    Object.setPrototypeOf(this, DatabaseError.prototype)
    this.name = 'DatabaseError'
    this.type = 'database'
  }
}

export class InternalServerError extends BaseError {
  constructor (error: any = {}) {
    super(error.message)

    Object.setPrototypeOf(this, InternalServerError.prototype)
    this.name = 'InternalServerError'
    this.type = 'internal'
  }
}
