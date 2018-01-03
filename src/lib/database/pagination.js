const { clamp, dec, max } = require('ramda')

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

const getPaginationQuery = (options = {}) => {
  const { page = 1, count = 10 } = options
  const limit = getPaginationLimit(count)
  const offset = getPaginationOffset({ page, count })

  return {
    limit,
    offset,
  }
}

module.exports = {
  getPaginationQuery,
}
