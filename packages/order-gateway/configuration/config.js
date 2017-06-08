const config = require('./config.json');

const { test, production } = config;

module.exports = {
  test,
  production,
  getTestServerURL: () => `${config.test.url}:${config.test.port}`,
  getServerURL: () => `${config.production.url}:${config.production.port}`,
};
