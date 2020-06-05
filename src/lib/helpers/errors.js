const {
  path,
} = require('ramda')

function isA4XXError (error) {
  return (path(['response', 'status'], error) >= 400 &&
  path(['response', 'status'], error) < 500)
}

module.exports = {
  isA4XXError,
}
