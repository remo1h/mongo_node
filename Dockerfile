FROM node:8

# Create app directory
WORKDIR /usr/src/mongo_node

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]