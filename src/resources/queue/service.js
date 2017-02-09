import { models } from '../../database'

const { queue } = models

export const create = data => queue.create(data)
