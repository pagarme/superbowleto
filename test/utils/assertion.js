const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')

chai.use(chaiAsPromised)
chai.use(chaiSubset)

module.exports = { expect: chai.expect }

