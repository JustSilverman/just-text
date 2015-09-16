var assign = require('object.assign');
var httpMocks = require('node-mocks-http');
var sinon = require('sinon-sandbox');
var controller = require('controllers/users');
var sessions = require('helpers/sessions');
var User  = require('models').User;

describe('users controller', function() {
  var req;
  var res;
  var renderStub;

  beforeEach(function() {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    renderStub = sinon.stub(res, 'render');
    res.locals = {};
  });

  afterEach(function(done) {
    User.truncate().then(function() {
      done();
    });
  });

  describe('#newUser', function() {
    it('should render the template', function() {
      controller.newUser(req, res);
      assert.calledWith(renderStub, 'signup');
    });
  });

  describe('#getUser', function() {
    it('should render the template when logged in', function() {
      var user = User.build({ id: 22 });
      req.session = {
        user: user
      }

      controller.getUser(req, res);
      assert.calledWith(renderStub, 'profile');
    });
  });

  describe('#createUser', function() {
    var loginStub;

    beforeEach(function() {
      loginStub = sinon.stub(sessions, 'loginUser');
    });

    it('should create the user and redirect to the users route', function() {
      var body = {
        firstName: 'homestar',
        lastName: 'runner',
        email: 'a@b.com',
        phoneNumber: '415 776-1212',
        password: 'sshhh'
      };
      var req = httpMocks.createRequest({ body: body });
      var redirectStub = sinon.stub(res, 'redirect');

      return controller.createUser(req, res).then(function() {
        return User.findOne({email: body.email}).then(function(user) {
          var loggedInUser = loginStub.getCall(0).args[0];
          assert.strictEqual(user.id, loggedInUser.id);
          assert.calledWith(redirectStub, '/users/' + user.id);
        });
      });
    });

    it('should respond with errors if creation fails', function() {
      var body = {
        lastName: 'runner',
        email: 'a@b.com',
        password: 'sshhh'
      };
      var req = httpMocks.createRequest({ body: body });
      var redirectStub = sinon.stub(res, 'redirect');

      return controller.createUser(req, res).then(function() {
        return User.findOne({email: body.email}).then(function(user) {
          assert.isNull(user);
          assert.notCalled(loginStub);
          assert.calledWith(renderStub, 'signup', {
            errors: [
              { field: 'firstName', message: 'firstName cannot be null' },
              { field: 'phoneNumber', message: 'Phone number must be 10 digits' }
            ]
          });
        });
      });
    });
  });
});
