FROM pagarme/node:6.2.2-alpine

COPY package.json /superbowleto/package.json
WORKDIR /superbowleto

RUN npm install

