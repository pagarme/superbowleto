#!/bin/bash

#create local bin directory
mkdir -p ~/.local/bin
#install aws-cli
pip install --user awscli==1.14.39  # install aws cli w/o sudo
export PATH=$PATH:$HOME/.local/bin # put aws in the path
# install jq
curl -sSL -o ~/.local/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && chmod +x ~/.local/bin/jq
# install ecs-deploy (in work version)
#waiting for pr https://github.com/silinternational/ecs-deploy/pull/129
curl -sSL -o ~/.local/bin/ecs-deploy https://raw.githubusercontent.com/kakakakakku/ecs-deploy/675e0e064bc20ad81634efdfe41d802fbe3c30e3/ecs-deploy && sudo chmod +x ~/.local/bin/ecs-deploy
if [[ $TRAVIS_TAG =~ ^v([0-9]+).([0-9]+).([0-9]+)-rc([0-9]+)$ ]]; then
  AWS_ACCESS_KEY_ID=$STG_AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY=$STG_AWS_SECRET_ACCESS_KEY
  AWS_ACCOUNT=$STG_AWS_ACCOUNT
  CLUSTER=$STG_CLUSTER
elif [[ $TRAVIS_TAG =~ ^v([0-9]+).([0-9]+).([0-9]+)$ ]]; then
  AWS_ACCESS_KEY_ID=$PRD_AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY=$PRD_AWS_SECRET_ACCESS_KEY
  AWS_ACCOUNT=$PRD_AWS_ACCOUNT
  CLUSTER=$PRD_CLUSTER
else
  echo "INVALID TAG!"
  exit 125
fi

#ecr-login
eval $(aws ecr get-login --region us-east-1 --no-include-email)

#SERVER
IMAGE_SERVER="$AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME_SERVER"
docker tag build-s:latest $IMAGE_SERVER:$TRAVIS_TAG
docker push $IMAGE_SERVER:$TRAVIS_TAG
#aways push latest on any deploy
docker tag $IMAGE_SERVER:$TRAVIS_TAG $IMAGE_SERVER:latest
docker push $IMAGE_SERVER:latest

#WORKER
IMAGE_WORKER="$AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME_WORKER"
docker tag build-w:latest $IMAGE_WORKER:$TRAVIS_TAG
docker push $IMAGE_WORKER:$TRAVIS_TAG
#aways push latest on any deploy
docker tag $IMAGE_WORKER:$TRAVIS_TAG $IMAGE_WORKER:latest
docker push $IMAGE_WORKER:latest

#sandbox
# deploy in server
ecs-deploy -c $CLUSTER -r $REGION -n $TASK_SANDBOX_SERVER -i $IMAGE_SERVER:$TRAVIS_TAG --timeout $TIMEOUT
# deploy in worker
ecs-deploy -c $CLUSTER -r $REGION -n $TASK_SANDBOX_WORKER -i $IMAGE_WORKER:$TRAVIS_TAG --timeout $TIMEOUT

#live
# deploy in server
ecs-deploy -c $CLUSTER -r $REGION -n $TASK_LIVE_SERVER -i $IMAGE_SERVER:$TRAVIS_TAG --timeout $TIMEOUT
# deploy in worker
ecs-deploy -c $CLUSTER -r $REGION -n $TASK_LIVE_WORKER -i $IMAGE_WORKER:$TRAVIS_TAG --timeout $TIMEOUT
