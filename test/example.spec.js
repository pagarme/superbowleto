const { describe, it } = require('mocha')
const { expect } = require('./utils/assertion')

describe('Test Example', () => {
  it('should pass all the tests', () => {
    expect(2 + 2).to.equal(4)
  })
})

