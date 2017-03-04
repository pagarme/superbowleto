import Sequelize from 'sequelize'
import { cond } from 'ramda'
import { InvalidParameterError, ValidationError } from './index'

const isValidationError = err => err instanceof Sequelize.ValidationError

const handleValidationErrors = (err) => {
  const errors = err.errors.map(error => new InvalidParameterError({
    message: error.message,
    field: error.path
  }))

  return new ValidationError({ errors })
}

export const handleDatabaseErrors = cond([
  [isValidationError, handleValidationErrors]
])
