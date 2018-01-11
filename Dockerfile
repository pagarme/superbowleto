FROM node:8.9-alpine

COPY package.json /superbowleto/package.json
WORKDIR /superbowleto

RUN npm install

EXPOSE 3000
