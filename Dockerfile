FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g npm@9.8.1
# Install dependencies
RUN npm i
# Bundle app source
COPY . .

#Expose the port
EXPOSE 5001

CMD [ "npm","run","dev" ]
