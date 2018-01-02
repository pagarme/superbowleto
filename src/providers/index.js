import { always, cond, equals, T } from 'ramda'
import * as bradesco from './bradesco'
import * as development from './development'
import { NotFoundError } from '../lib/errors/index'

export const findProvider = cond([
  [equals('bradesco'), always(bradesco)],
  [equals('development'), always(development)],
  [T, () => {
    throw new NotFoundError({
      message: 'Provider not found'
    })
  }]
])

