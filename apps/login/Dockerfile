###
### BUILD THE WEBAPP CLIENT
###

FROM node:16-alpine AS builder

# NPM Install for building
WORKDIR /usr/src/app
ADD package.json /usr/src/app
ADD package-lock.json /usr/src/app
RUN npm install

# Copy source files:
WORKDIR /usr/src/app
ADD src /usr/src/app/src

CMD ["node", "src/index.js"]