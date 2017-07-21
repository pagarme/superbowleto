import { always, cond, equals, T } from 'ramda'
import * as bradesco from './bradesco'

export const findProvider = cond([
  [equals('bradesco'), always(bradesco)],
  [T, () => {
    throw new Error('Provider not found')
  }]
])
