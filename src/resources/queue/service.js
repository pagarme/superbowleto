import { models } from '../../lib/database'

const { queue } = models

export const create = data => queue.create(data)
