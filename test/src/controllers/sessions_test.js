var sinon = require('sinon');
var httpMocks = require('node-mocks-http');
var controller = require('../../../controllers/sessions');
var User  = require('../../../models').User;
var sessions = require('../../../helpers/sessions');

describe('sessions controller', function() {
  var req;
  var res;

  beforeEach(function() {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    res.locals = {};
  });

  afterEach(function(done) {
    User.truncate().then(function() {
      done();
    });
  });

  describe('#loginPage', function() {
    it('should render the template', function() {
      var renderStub = sinon.stub(res, 'render');
      controller.loginPage(req, res);
      assert.calledWith(renderStub, 'login');
    });
  });

  describe('#loginUser', function() {
    var userId;
    var validParams = {
      firstName: 'homestar',
      lastName: 'runner',
      email: 'a@b.com',
      phoneNumber: '4157761212',
      password: 'adsfadsf'
    }

    beforeEach(function(done) {
      User.create(validParams).then(function(user) {
        userId = user.id;
        done();
      });
    });

    it('should log in the user if authentication passes', function() {
      var req = httpMocks.createRequest({
        body: {
          email: validParams.email,
          password: validParams.password
        }
      });
      var redirectStub = sinon.stub(res, 'redirect');
      var sessionsStub = sinon.stub(sessions, 'loginUser');

      return controller.loginUser(req, res).then(function() {
        var userForSession = sessionsStub.getCall(0).args[0];
        assert.strictEqual(userForSession.id, userId);
        assert.calledWith(redirectStub, '/');
        sessions.loginUser.restore();
      });
    });

    it('should render the template with errors if authentication fails', function() {
      var req = httpMocks.createRequest({
        body: {
          email: validParams.email,
          password: validParams.password + '5'
        }
      });
      var renderStub = sinon.stub(res, 'render');

      return controller.loginUser(req, res).then(function() {
        assert.calledWith(renderStub, 'login', { message: 'Invalid email or password' });
      });
    });

    it('should render the template with errors if user is not found', function() {
      var req = httpMocks.createRequest({
        body: {
          email: validParams.email + '11',
          password: validParams.password
        }
      });
      var renderStub = sinon.stub(res, 'render');

      return controller.loginUser(req, res).then(function() {
        assert.calledWith(renderStub, 'login', { message: 'Invalid email or password' });
      });
    });
  });

  describe('#logout', function() {
    it('destroy the session and redirect to the root', function() {
      var redirectStub = sinon.stub(res, 'redirect');
      req.session = {
        destroy: sinon.stub()
      }

      controller.logout(req, res);
      assert.calledWith(redirectStub, '/');
      assert.calledOnce(req.session.destroy);
    });
  });
});
