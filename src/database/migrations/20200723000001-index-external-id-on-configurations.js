module.exports = {
  up (queryInterface) {
    return queryInterface.addIndex(
      'Configurations',
      ['external_id'],
      {
        name: 'ix_external_id',
        fields: ['external_id'],
      }
    )
  },
  down (queryInterface) {
    return queryInterface.removeIndex('Configurations', 'ix_external_id')
  },
}
