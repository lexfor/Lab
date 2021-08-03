FROM node:14
RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node/
WORKDIR /home/node/Project
COPY package*.json ./
RUN npm install
COPY ./Project .
EXPOSE 3000
CMD [ "node", "index.js" ]