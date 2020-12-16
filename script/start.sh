#!/bin/sh

PORT=3000
#run entrypoint for decrypt variables
echo "call entrypoint"
sh -c /entrypoint.sh

if [ $APP_TYPE = "migrate" ]
  #run migrations
  echo "call migrations"
  /app/node_modules/.bin/sequelize db:migrate --config /app/src/config/database.js --migrations-path /app/src/database/migrations/
fi

if [ $APP_TYPE = "worker" ]
then
  # run worker
  echo "call worker service"
  node /app/src/bin/worker.js
fi

if [ $APP_TYPE = "server" ]
  #run server
  echo "call server service"
  node /app/src/bin/server.js
fi
