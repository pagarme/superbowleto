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
