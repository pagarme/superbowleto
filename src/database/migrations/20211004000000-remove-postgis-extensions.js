module.exports = {
  up (queryInterface) {
    return queryInterface.sequelize.query(`
      DROP EXTENSION IF EXISTS postgis_topology;
      DROP EXTENSION IF EXISTS postgis_tiger_geocoder;
      DROP EXTENSION IF EXISTS postgis;
    `)
  },
  down () {
    return Promise.resolve()
  },
}
