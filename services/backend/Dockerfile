FROM node:26 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM docker:27-cli AS docker-cli

FROM node:26-alpine

# enable executing docker commands from container
COPY --from=docker-cli /usr/local/bin/docker /usr/local/bin/docker

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

RUN mkdir -p /opt/pm

ENV DIRECTORY_ROOT=/opt/pm
ENV PORT=3000

CMD ["npm", "start"]
