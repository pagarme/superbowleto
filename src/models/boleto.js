import { STRING, INTEGER } from 'sequelize'

function create (database) {
  return database.define('boleto', {
    instructions: {
      type: STRING,
      allowNull: false
    },

    barcode: {
      type: INTEGER,
      allowNull: false
    }
  })
}

export default { create }

