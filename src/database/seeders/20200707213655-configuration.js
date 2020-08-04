const now = new Date()

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkDelete('Configurations', null)
    return queryInterface.bulkInsert('Configurations', [{
      id: 'cf_niskhinfjsihfjisALINETHORjmsijdisag',
      external_id: 'pagarme',
      issuer_account: '9721',
      issuer_agency: '3381',
      issuer_wallet: '26',
      issuer: 'bradesco',
      created_at: now,
      updated_at: now,
    }])
  },
  down: queryInterface => queryInterface.bulkDelete('Configurations', null),
}
