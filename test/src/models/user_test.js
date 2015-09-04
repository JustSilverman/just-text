var assign = require('object.assign');
var User   = require('../../../models').User;
var db     = require('../../../config/db');
var rotary = require('../../../helpers/rotary');
var sinon  = require('sinon');

describe('User', function() {
  var validParams;

  beforeEach(function() {
    validParams = {
      firstName: 'homestar',
        lastName: 'runner',
        email: 'a@b.com',
        phoneNumber: '4157761212',
        passwordHash: 'adsfadsf'
    }

    User.truncate();
  });

  describe('#create', function() {
    it('should create a user', function() {
      return User.create(validParams)
        .then(function(model) {
          assert.strictEqual('homestar', model.firstName);
          assert.strictEqual('runner', model.lastName);
          assert.strictEqual('a@b.com', model.email);
          assert.strictEqual('4157761212', model.phoneNumber);
          assert.strictEqual('adsfadsf', model.passwordHash);
          assert.isDefined(model.get('id'));
          assert.isDefined(model.get('createdAt'));
          assert.isDefined(model.get('updatedAt'));
        });
    });
  });

  describe('beforeValidation', function() {
    it('should parse phone numbers', function() {
      var parsedPhoneNumber = '1221112212';
      var params = assign(validParams, {
        phoneNumber: '(122) 111-2212'
      });
      var rotaryStub = sinon.stub(rotary, 'parse').returns(parsedPhoneNumber);

      return User.create(params)
        .then(function(model) {
          assert.strictEqual(parsedPhoneNumber, model.phoneNumber);
          assert.strictEqual(1, rotaryStub.callCount);
          assert.strictEqual(params.phoneNumber, rotaryStub.getCall(0).args[0]);
        })
    });
  });

  describe('validations', function() {
    it('should require valid emails', function() {
      var params = assign(validParams, {
        email: 'a@b'
      });

      return User
        .build(params)
        .validate()
        .then(function(validationError) {
          assert.strictEqual('email', validationError.errors[0].path);
          assert.strictEqual('Email address must be valid', validationError.errors[0].message);
        })
    });

    it('should require phone numbers', function() {
      delete validParams.phoneNumber;

      return User
        .build(validParams)
        .validate()
        .then(function(validationError) {
          assert.strictEqual('phoneNumber', validationError.errors[0].path);
          assert.strictEqual('Phone number must be 10 digits', validationError.errors[0].message);
        })
    });

    it('should require phone numbers of at least 10 digits', function() {
      var params = assign(validParams, {
        phoneNumber: '123456789'
      });

      return User
        .build(params)
        .validate()
        .then(function(validationError) {
          assert.strictEqual('phoneNumber', validationError.errors[0].path);
          assert.strictEqual('Phone number must be 10 digits', validationError.errors[0].message);
        })
    });
  });

  describe('validating email and phone numbers', function() {
    var userId;
    beforeEach(function() {
      return User.create(validParams)
        .then(function(model) {
          userId = model.id;
        });
    });

    describe('#validateEmail', function() {
      it('should mark the email as validated', function() {
        return User.findById(userId)
          .then(function(user) {
            assert.isFalse(user.emailValidated);
            return user.validateEmail();
          })
          .then(function(user) {
            return User.findById(userId)
          })
          .then(function(user) {
            assert.isTrue(user.emailValidated);
          });
      });
    });

    describe('#validatePhoneNumber', function() {
      it('should mark the phoneNumber as validated', function() {
        return User.findById(userId)
          .then(function(user) {
            assert.isFalse(user.phoneNumberValidated);
            return user.validatePhoneNumber();
          })
          .then(function(user) {
            return User.findById(userId)
          })
          .then(function(user) {
            assert.isTrue(user.phoneNumberValidated);
          });
      });
    });
  });
});
