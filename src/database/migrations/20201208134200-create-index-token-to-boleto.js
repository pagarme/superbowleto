const index = 'ix_token'
const table = 'Boletos'
const column = 'token'

module.exports = {
  up (queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      ${index} ON "${table}"
      USING btree (${column});
    `)
  },

  down (queryInterface) {
    return queryInterface.sequelize.query(`
      DROP INDEX CONCURRENTLY IF EXISTS
      ${index};
    `)
  },
}
