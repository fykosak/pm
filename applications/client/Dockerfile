FROM node:26 AS build

ARG BACKEND=http://localhost:3000
ENV BACKEND=$BACKEND

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM nginx/nginx-unprivileged:1.31

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
