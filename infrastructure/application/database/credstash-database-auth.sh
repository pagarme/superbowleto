#!/bin/sh

set -e

region="$1"
stage="$2"
instance_id="$3"
password="$(openssl rand -hex 32)"

echo "[INFO]: Updating RDS database password"
aws --region=$region rds modify-db-instance --db-instance-identifier $instance_id --master-user-password $password
echo "[SUCCESS]: Updating RDS database password"

echo "[INFO]: Sending password to Credstash"
credstash --profile $AWS_PROFILE put --autoversion "$stage/database/password" $password
echo "[SUCCESS]: Sending password to Credstash"
