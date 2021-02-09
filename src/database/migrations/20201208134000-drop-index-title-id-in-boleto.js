const index = 'ix_title_id'

module.exports = {
  up (queryInterface) {
    return queryInterface.sequelize.query(`
    DROP INDEX CONCURRENTLY IF EXISTS
    ${index};
  `)
  },

  down () { },
}
