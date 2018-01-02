import {
  compose,
  cond,
  map,
  merge,
  of,
  pick,
  prop,
  T
} from 'ramda'

const hasErrors = compose(Array.isArray, prop('errors'))

const normalizeSingleError = compose(
  merge({
    type: 'unknown_error',
    message: '',
    field: null
  }),
  pick([
    'type',
    'message',
    'field'
  ])
)

const normalizeMultipleErrors = map(normalizeSingleError)

export const normalizeErrors = cond([
  [hasErrors, compose(normalizeMultipleErrors, prop('errors'))],
  [T, compose(normalizeMultipleErrors, of)]
])
