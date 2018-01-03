const {
  compose,
  cond,
  map,
  merge,
  of,
  pick,
  prop,
  T,
} = require('ramda')

const hasErrors = compose(Array.isArray, prop('errors'))

const normalizeSingleError = compose(
  merge({
    type: 'unknown_error',
    message: '',
    field: null,
  }),
  pick([
    'type',
    'message',
    'field',
  ])
)

const normalizeMultipleErrors = map(normalizeSingleError)

const normalizeErrors = cond([
  [hasErrors, compose(normalizeMultipleErrors, prop('errors'))],
  [T, compose(normalizeMultipleErrors, of)],
])

module.exports = {
  normalizeErrors,
}

