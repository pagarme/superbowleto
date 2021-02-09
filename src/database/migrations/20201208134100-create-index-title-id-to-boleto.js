const index = 'ix_title_id'
const table = 'Boletos'
const column = 'title_id'

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
