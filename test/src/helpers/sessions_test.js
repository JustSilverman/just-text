var sinon = require('sinon');
var sessions = require('../../../helpers/sessions');

describe('sessions helper', function() {
  describe('#requireLogin', function() {
    var req;
    var res;

    beforeEach(function() {
      req = {};
      res = {
        redirect: sinon.stub()
      }
    });

    it('should redirect to login if no user is present', function() {
      sessions.requireLogin(req, res, noop);
      assert.calledWith(res.redirect, '/login');
    });

    it('should call next if user is present', function() {
      var req = {
        user: {}
      };
      var next = sinon.stub();
      sessions.requireLogin(req, res, next);
      assert.calledOnce(next);
    });
  });
});
