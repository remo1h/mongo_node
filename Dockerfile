FROM node:15.12.0

LABEL maintainer="Omer Aletic <aletic.omer@nsoft.com>"

RUN apt-get update && apt-get upgrade -y

WORKDIR /usr/src/mono_node

COPY . .

COPY package*.json ./

RUN npm install

CMD [ "node", "/usr/src/mono_node/index.js" ]


