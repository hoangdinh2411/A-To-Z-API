FROM node:20.10.0

WORKDIR /a-to-z-api

COPY package.json .

RUN npm install

COPY . .

EXPOSE 2703

CMD [ "npm", "start" ]