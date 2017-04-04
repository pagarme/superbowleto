FROM node:7.8-alpine

COPY package.json /superbowleto/package.json
WORKDIR /superbowleto

RUN yarn
