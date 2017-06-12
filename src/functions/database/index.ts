import * as Umzug from 'umzug'

import { getDatabase } from '../../database'

export const migrate = (event, context, callback) => {
  getDatabase().then((database) => {
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: database
      },
      migrations: {
        params: [
          database.getQueryInterface(),
          database.constructor
        ],
        path: './build/database/migrations',
        pattern: /\.js$/
      }
    })

    umzug.up()
      .then(() => callback(null))
      .catch(err => callback(err))
  })
}
