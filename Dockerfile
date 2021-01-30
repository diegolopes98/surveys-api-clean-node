FROM node:14.15.4
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN npm install --only=prod