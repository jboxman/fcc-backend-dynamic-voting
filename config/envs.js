// https://raw.githubusercontent.com/dozoisch/koa-react-full-example/master/config/config.js

const path = require('path');
const _ = require('lodash');

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const base = {
  app: {
    root: path.normalize(path.join(__dirname, '../')),
    env: env
  }
};

const envs = {
  development: {
    app: {
      port: 3000
    },
    mongodb: {
      url: `mongodb://localhost/db_${env}`
    }
  },
  test: {
    app: {
      port: 3001
    },
    mongodb: {
      url: `mongodb://localhost/db_${env}`
    }
  },
  production: {
    app: {
      port: process.env.PORT || 3000
    },
    mongodb: {
      url: `mongodb://localhost/db_${env}`
    }
  }
};

module.exports = _.merge(base, envs[env]);
