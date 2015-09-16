'use strict';

var httpMocks = require('node-mocks-http');
var sinon = require('sinon-sandbox');
var controller = require('controllers/application');

describe('application controller', function() {
  describe('#root', function() {
    it('should render the home template', function() {
      var req = httpMocks.createRequest();
      var res = httpMocks.createResponse();
      var renderStub = sinon.stub(res, 'render');

      controller.root(req, res);
      assert.calledWith(renderStub, 'home');
    });
  });
});