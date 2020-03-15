FROM node:12.14
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 5000
RUN yarn build
CMD ["node", "src/server.js"]
