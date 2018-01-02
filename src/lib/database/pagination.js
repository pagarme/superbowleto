import { clamp, dec, max } from 'ramda'

const getPaginationLimit = (count) => {
  const minValue = 1
  const maxValue = max(1, count)

  return clamp(minValue, maxValue, count)
}

const getPaginationOffset = ({ count, page }) => {
  const minValue = 1
  const maxValue = max(1, page)

  return dec(clamp(minValue, maxValue, page)) * count
}

export const getPaginationQuery = (options: any = {}) => {
  const { page = 1, count = 10 } = options
  const limit = getPaginationLimit(count)
  const offset = getPaginationOffset({ page, count })

  return {
    limit,
    offset
  }
}
