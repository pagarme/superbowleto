FROM node:7.4.0-alpine

COPY package.json /superbowleto/package.json
WORKDIR /superbowleto

RUN npm install --quiet
