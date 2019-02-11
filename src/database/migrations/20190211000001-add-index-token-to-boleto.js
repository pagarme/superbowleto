const tableName = 'Boletos'

function createIndexSQL (columnName) {
  return `
    CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_${columnName}
        ON "${tableName}"
        USING btree (${columnName});
  `
}

module.exports = {
  up (queryInterface) {
    return queryInterface.sequelize.query(createIndexSQL('token'))
  },

  down (queryInterface) {
    return queryInterface.removeIndex(tableName, 'ix_token')
  },
}
