var sinon = require('sinon');
var sessions = require('../../../helpers/sessions');
var User  = require('../../../models').User;

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

  describe('#loginUser', function() {
    it('should set the user (without passwordHash) on the req and res', function() {
      var user = User.build({ id: 12, passwordHash: 'abc123' });
      mockSession = {
        reset: sinon.stub()
      };
      request = {
        session: mockSession
      };
      response = {
        locals: {}
      };
      sessions.loginUser(user, request, response);
      assert.strictEqual(user, request.session.user);
      assert.strictEqual(user, response.locals.user);
      assert.isUndefined(user.passwordHash);
      assert.calledOnce(mockSession.reset);
    });
  });
});
