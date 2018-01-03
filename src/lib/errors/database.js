const Sequelize = require('sequelize')
const { compose, cond, T } = require('ramda')
const {
  DatabaseError,
  InvalidParameterError,
  ValidationError,
} = require('./index')

const isValidationError = err => err instanceof Sequelize.ValidationError
const isSequelizeError = err => err instanceof Sequelize.Error

const handleValidationErrors = (err) => {
  const errors = err.errors.map(error => new InvalidParameterError({
    message: error.message,
    field: error.path,
  }))

  return new ValidationError({ errors })
}

const handleGenericErrors = err => new DatabaseError({
  message: err.message,
})

const throwError = (err) => {
  throw err
}

const handleDatabaseErrors = cond([
  [isValidationError, compose(throwError, handleValidationErrors)],
  [isSequelizeError, compose(throwError, handleGenericErrors)],
  [T, throwError],
])

module.exports = {
  handleDatabaseErrors,
}
