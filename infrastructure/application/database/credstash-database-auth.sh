#!/bin/sh

set -e

stage="$1"
instance_id="$2"
password="$(openssl rand -hex 32)"

echo "[INFO]: Updating RDS database password"
aws --region=us-east-1 rds modify-db-instance --db-instance-identifier $instance_id --master-user-password $password
echo "[SUCCESS]: Updating RDS database password"

echo "[INFO]: Sending password to Credstash"
credstash --profile $AWS_PROFILE put --autoversion "$stage/database/password" $password
echo "[SUCCESS]: Sending password to Credstash"
