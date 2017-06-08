const assert = require('chai').assert;
const config = require('./config.json');
const configJS = require('./config');

describe('config.js', () => {
  it('should return config.json as Object', () => {
    assert.deepEqual(configJS.test, config.test);
    assert.deepEqual(configJS.production, config.production);
  });

  it('should return \'http://localhost:3343\'', () => {
    assert.equal(configJS.getTestServerURL(), 'http://localhost:3343');
  });

  it('should return \'http://localhost:3333\'', () => {
    assert.equal(configJS.getServerURL(), 'http://localhost:3333');
  });
});
