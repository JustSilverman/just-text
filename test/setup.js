'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
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
global.noop = require('../helpers/noop');

var db = require('config/db');

before(function() {
  sinon.restore();
});
