'use strict';

var chai = require('chai');
chai.config.includeStack = true;

var sinon = require('sinon');
require('sinon-as-promised');
sinon.assert.expose(chai.assert, {
  prefix: ''
});

chai.assert.equal = function() {
  throw new Error("Chai's assert.equal uses ==.  Use assert.strictEqual instead.");
}

global.assert = chai.assert;
global.noop = require('helpers/noop');
global.throwErr = function(err) {
  throw err;
}

var db = require('config/db');

var sinonSandbox = require('sinon-sandbox');

afterEach(function() {
  if (sinonSandbox.clock) {
    sinonSandbox.clock.restore();
  }

  sinonSandbox.restore();
});