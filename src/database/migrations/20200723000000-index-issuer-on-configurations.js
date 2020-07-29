module.exports = {
  up (queryInterface) {
    return queryInterface.addIndex(
      'Configurations',
      ['issuer'],
      {
        name: 'ix_issuer',
        fields: ['issuer'],
      }
    )
  },
  down (queryInterface) {
    return queryInterface.removeIndex('Configurations', 'ix_issuer')
  },
}
