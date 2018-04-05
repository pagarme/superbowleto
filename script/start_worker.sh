#!/bin/sh

PORT=3000
#run entrypoint for decrypt variables
echo "call entrypoint"
sh -c /entrypoint.sh
#run server
echo "call worker service"
node /app/src/bin/worker.js
