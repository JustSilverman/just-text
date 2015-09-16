var sinon = require('sinon');
var User  = require('models').User;

describe('sessionUpdater', function() {
  var sessionUpdater = require('../../../middleware/session_updater');
  var request;
  var response;
  var next;
  var mockSession;
  var findByIdStub;

  beforeEach(function() {
    request = {};
    response = {
      locals: {}
    };
    mockSession = {
      destroy: sinon.stub()
    };
    next = sinon.stub();
    findByIdStub = sinon.stub(User, 'findById');
  });

  afterEach(function() {
    User.findById.restore();
  });

  it('should set the user (without passwordHash) on the session, request and response', function(done) {
    var user = User.build({ id: 12, passwordHash: 'abc123' });
    mockSession.user = user;
    request = {
      session: mockSession
    };
    findByIdStub.withArgs(12).resolves(user);
    sessionUpdater(request, response, function() {
      assert.strictEqual(user, request.session.user);
      assert.strictEqual(user, response.locals.user);
      assert.isUndefined(user.passwordHash);
      done();
    });
  });

  it('should not update the session if there is no session', function() {
    sessionUpdater(request, response, next);
    assert.isUndefined(request.session);
    assert.deepEqual({}, response.locals);
    assert.calledOnce(next);
  });

  it('should not update the session if there is no user in the session', function() {
    request = {
      session: mockSession
    };
    sessionUpdater(request, response, next);
    assert.isUndefined(request.session.user);
    assert.deepEqual({}, response.locals);
    assert.calledOnce(next);
    assert.calledOnce(mockSession.destroy);
  });

  it('should not update the session if the user is not found', function(done) {
    var user = User.build({ id: 12 });
    mockSession.user = user;
    request = {
      session: mockSession
    };
    findByIdStub.withArgs(12).resolves(null);
    sessionUpdater(request, response, function() {
      assert.deepEqual({}, response.locals);
      assert.calledOnce(mockSession.destroy);
      done()
    });
  });
});
