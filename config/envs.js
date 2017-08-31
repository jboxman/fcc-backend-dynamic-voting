// https://raw.githubusercontent.com/dozoisch/koa-react-full-example/master/config/config.js

const path = require('path');
const _ = require('lodash');

const env = process.env.NODE_ENV || 'development';

const base = {
  app: {
    root: path.normalize(path.join(__dirname, '../')),
    env: env
  }
};

const envs = {
  development: {
    app: {
      port: 4000,
      oauthUrl: '/api/users/auth/github/callback'
    },
    mongodb: {
      url: `mongodb://localhost/db_${env}`
    }
  },
  test: {
    app: {
      port: 4001,
      oauthUrl: '/api/users/auth/github/callback'
    },
    mongodb: {
      url: `mongodb://localhost/db_${env}`
    }
  },
  production: {
    app: {
      port: process.env.PORT || 4000,
      oauthUrl: '/api/users/auth/github',
      prefix: '/api'
    },
    mongodb: {
      url: process.env.MONGODB_URI || `mongodb://localhost/db_${env}` // From heroku config
    }
  }
};

module.exports = _.merge(base, envs[env]);
