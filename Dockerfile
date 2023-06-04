FROM node:latest

# RUN npm install -g pnpm

# RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm


# RUN curl -f https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.2.0.tgz

WORKDIR /app

# COPY .npmrc package.json pnpm-lock.yaml .pnpmfile.cjs ./app/

# COPY .npmrc /app

COPY  package.json /app

# COPY  pnpm-lock.yaml /app

RUN npm install

COPY  . /app

CMD ["npm", "start"]