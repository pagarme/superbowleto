const index = 'ix_token'

module.exports = {
  up (queryInterface) {
    return queryInterface.sequelize.query(`
    DROP INDEX CONCURRENTLY IF EXISTS
    ${index};
  `)
  },

  down () { },
}
