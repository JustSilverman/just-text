var moment = require('moment');
var assign = require('object.assign');
var PhoneNumberConfirmation = require('models').PhoneNumberConfirmation;
var User = require('models').User;
var db     = require('config/db');
var noop   = require('helpers/noop');
var sinon  = require('sinon-sandbox');

describe('PhoneNumberConfirmation', function() {
  var confirmationParams;
  var userParams;
  var userId;

  beforeEach(function(done) {
    confirmationParams = {}

    userParams = {
      firstName: 'homestar',
      lastName: 'runner',
      email: 'a@b.com',
      phoneNumber: '4157761212',
      password: 'adsfadsf',
    }
    User.truncate({ cascade: true }).then(function() {
      done();
    })
  });

  describe('#create', function() {
    it('should create an instance from a user and have a reference to the user', function() {
      return User.create(userParams)
        .then(function(user) {
          userId = user.id;
          return user;
        })
        .then(function(user) {
          return user.createPhoneNumberConfirmation()
        })
        .then(function(confirm) {
          assert.ok(confirm.code);
          assert.strictEqual(userId, confirm.userId);
          assert.isFalse(confirm.isExpired());
          assert.isFalse(confirm.isUsed);
        })
        .catch(throwErr);
    });
  });

  describe('#markUsed', function() {
    var confirm;
    beforeEach(function(done) {
      User.create(userParams)
        .then(function(user) {
          return user.createPhoneNumberConfirmation()
        })
        .then(function(result) {
          confirm = result;
          done();
        })
    });

    it('should mark the confirmation as used', function() {
      return PhoneNumberConfirmation.findById(confirm.id)
        .then(function(confirm) {
          assert.isFalse(confirm.isUsed);
          return confirm.markUsed();
        })
        .then(function(confirm) {
          return PhoneNumberConfirmation.findById(confirm.id)
        })
        .then(function(confirm) {
          assert.isTrue(confirm.isUsed);
        })
        .catch(throwErr);
    });
  });

  describe('#isExpired', function() {
    var now;
    beforeEach(function() {
      now = moment();
    });

    it('should be false if before the expiration time', function() {
      var expirationTime = now.clone().add(1, 'ms');
      var confirm = PhoneNumberConfirmation.build({ expirationTime: expirationTime });
      assert.isFalse(confirm.isExpired(now));
    });

    it('should be true if at the expiration time', function() {
      var expirationTime = now.clone();
      var confirm = PhoneNumberConfirmation.build({ expirationTime: expirationTime });
      assert.isTrue(confirm.isExpired(now));
    });

    it('should be true if past the expiration time', function() {
      var expirationTime = now.clone().subtract(1, 'ms');
      var confirm = PhoneNumberConfirmation.build({ expirationTime: expirationTime });
      assert.isTrue(confirm.isExpired(now));
    });
  });
});
