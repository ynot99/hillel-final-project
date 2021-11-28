FROM node:12-alpine

WORKDIR /opt/blog

RUN apk update && apk add python3-dev make g++

COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

COPY ./ ./

CMD ["yarn", "start"]
