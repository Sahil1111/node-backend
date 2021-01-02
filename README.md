# Koa2 with MongoDB and Docker 

A boilerplate to get started building a REST API with Koa, MongoDB and Docker

## This boilerplate includes

- [Koa 2](http://koajs.com/)
- [Mongoose](http://mongoosejs.com/)
- [Mocha](https://mochajs.org)
- [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)
- Password encryption with [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [ESLint](https://eslint.org/) with [standard config](https://github.com/standard/eslint-config-standard)
- [Nodemon](https://github.com/remy/nodemon) to restart the server whenever you make changes
- Input validation with [Yup](https://github.com/jquense/yup)
- Email and password authentication and [JWT](https://github.com/auth0/node-jsonwebtoken)
- Email Service [Sendgrid/Mailchimp/Nodemailer]

## To run this make sure you have

- GIT
- Nodejs 12- Or 8+
- Yarn or NPM
- Docker and docker-compose
- OS (Mac || Windows || Linux(Ubuntu,Fedora etc))

> Docker is not mandatory, but if you don't have it you need to install and configure MongoDB.

## Clone the repo and install the deps

```sh
# clone into project-name
$ git clone https://github.com/intelligaia/node.js-backend.git project-name && cd project-name 
# Create a .env file
$ cp .env.example .env

# Get dependencies with Yarn
$ yarn install

# or NPM
$ npm install
```

## Commands Yarn

Command             | Action                   |
--------------------|--------------------------|
`yarn dev`          | Run in development mode  |
`yarn start`        | Run in production mode   |
`yarn test`         | Run the tests once       |
`yarn test:watch`   | Run and watch the tests  |
`yarn run lint`     | Lint the code            |


## Commands NPM

Command             | Action                   |
--------------------|--------------------------|
`npm dev`          | Run in development mode  |
`npm start`        | Run in production mode   |
`npm test`         | Run the tests once       |
`npm test:watch`   | Run and watch the tests  |
`npm run lint`     | Lint the code            |

## Docker support

You don't have install and configure MongoDB and run each service (API and MongoDB) in a separate window. Docker handles all that for you. You just need to run:

```sh
$ docker-compose build --force-rm   # Build the services and remove intermediate containers
$ docker-compose up                 # Builds, (re)creates, starts, and attaches to containers for a service.
```

> NOTE: If you change a service's `Dockerfile` or the contents of its build directory, you can run `docker-compose build` to rebuild it.
