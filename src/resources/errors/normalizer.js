import {
  compose,
  cond,
  map,
  of,
  T
} from 'ramda'

export const normalizeSingleError = (error) => {
  const { type = 'unknown_error', message = '', field = null } = error

  return { type, message, field }
}

export const normalizeError = cond([
  [Array.isArray, map(normalizeSingleError)],
  [T, compose(map(normalizeSingleError), of)]
])
