class BaseError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends BaseError {
  constructor (error = {}) {
    const { message } = error
    super(message)
    Object.assign(this, error)
  }
}
