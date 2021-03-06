var assign = require('object.assign');
var bcrypt = require('bcrypt-as-promised');
var User   = require('models').User;
var db     = require('config/db');
var rotary = require('helpers/rotary');
var noop   = require('helpers/noop');
var sinon  = require('sinon-sandbox');

describe('User', function() {
  var validParams;

  beforeEach(function(done) {
    validParams = {
      firstName: 'homestar',
      lastName: 'runner',
      email: 'a@b.com',
      phoneNumber: '4157761212',
      password: 'adsfadsf',
    }

    User.truncate({ cascade: true }).then(function() {
      done();
    });
  });

  describe('#create', function() {
    var hashed = 'abc123';

    beforeEach(function() {
      hashStub = sinon.stub(User, 'hashPassword').resolves(hashed);
    });

    it('should create a user', function() {
      return User.create(validParams)
        .then(function(model) {
          assert.strictEqual('homestar', model.firstName);
          assert.strictEqual('runner', model.lastName);
          assert.strictEqual('a@b.com', model.email);
          assert.strictEqual('4157761212', model.phoneNumber);
          assert.strictEqual(hashed, model.passwordHash);
          assert.isUndefined(model.password);
          assert.isDefined(model.get('id'));
          assert.isDefined(model.get('createdAt'));
          assert.isDefined(model.get('updatedAt'));
        });
    });

    it('should downcase email', function() {
      var params = assign(validParams, {
        email: 'AbCd@b.com'
      });
      return User.create(params)
        .then(function(model) {
          assert.strictEqual('abcd@b.com', model.email);
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
    it('should require a non-blank first name', function() {
      delete validParams.firstName;

      return User
        .create(validParams)
        .then(assert.fail)
        .catch(function(validationError) {
          assert.strictEqual('firstName', validationError.errors[0].path);
          assert.strictEqual('First name cannot be blank', validationError.errors[0].message);
        });
    });

    it('should require a non-blank last name', function() {
      delete validParams.lastName;

      return User
        .create(validParams)
        .then(assert.fail)
        .catch(function(validationError) {
          assert.strictEqual('lastName', validationError.errors[0].path);
          assert.strictEqual('Last name cannot be blank', validationError.errors[0].message);
        });
    });

    it('should require valid emails', function() {
      var params = assign(validParams, {
        email: 'a@b'
      });

      return User
        .create(params)
        .then(assert.fail)
        .catch(function(validationError) {
          assert.strictEqual('email', validationError.errors[0].path);
          assert.strictEqual('Email address must be valid', validationError.errors[0].message);
        });
    });

    it('should require phone numbers', function() {
      delete validParams.phoneNumber;

      return User
        .create(validParams)
        .then(assert.fail)
        .catch(function(validationError) {
          assert.strictEqual('phoneNumber', validationError.errors[0].path);
          assert.strictEqual('Phone number must be 10 digits', validationError.errors[0].message);
        });
    });

    it('should require phone numbers of at least 10 digits', function() {
      var params = assign(validParams, {
        phoneNumber: '123456789'
      });

      return User
        .create(params)
        .then(assert.fail)
        .catch(function(validationError) {
          assert.strictEqual('phoneNumber', validationError.errors[0].path);
          assert.strictEqual('Phone number must be 10 digits', validationError.errors[0].message);
        });
    });

    it('should require passwords of 7 characters or greater', function() {
      var params = assign(validParams, {
        password: '123456'
      });

      return User
        .create(params)
        .then(assert.fail)
        .catch(function(validationError) {
          assert.strictEqual('password', validationError.errors[0].path);
          assert.strictEqual('Password must be atleast 7 characters', validationError.errors[0].message);
        });
    });
  });

  describe('validating email and phone numbers', function() {
    var userId;
    beforeEach(function(done) {
      User.create(validParams)
        .then(function(model) {
          userId = model.id;
        })
        .then(function() {
          done();
        })
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

  describe('#toJSON', function() {
    it('should strip out the passwordHash', function() {
      return User.create(validParams)
        .then(function(user) {
          var json = user.toJSON();
          var values = user.get();

          assert.isUndefined(json.passwordHash);
          Object.keys(json).forEach(function(key) {
            assert.strictEqual(values[key], json[key]);
          });
        });
    });
  });

  describe('.authenticate', function() {
    var userId;
    var email;
    var password = 'updownupdownabselectstart'

    beforeEach(function(done) {
      validParams.password = password;
      User.create(validParams)
        .then(function(model) {
          userId = model.id;
          email = model.email;
          done();
        });
    });

    it('should authenticate a user', function() {
      return User.authenticate(email, password).then(function(user) {
        assert.strictEqual(userId, user.id);
        assert.strictEqual(email, user.email);
      });
    });

    it('should fail authentication with an incorrect password', function() {
      return User.authenticate(email, password + '123').catch(function(error) {
        assert.strictEqual('invalid', error.message);
      });
    });

    it('should fail authentication with unknown email', function() {
      return User.authenticate(email + '1', password).catch(function(error) {
        assert.strictEqual('invalid', error.message);
      });
    });
  });

  describe('.hashPassword', function() {
    var password = 'password';
    var bcryptHashStub;
    var error = new Error();

    beforeEach(function() {
      bcryptHashStub = sinon.stub(bcrypt, 'hash');
    });

    it('should generate a salt and hash the password', function() {
      bcryptHashStub.resolves('def79');

      return User.hashPassword(password).then(function(hash) {
        assert.strictEqual('def79', hash);
      });
    });

    it('should return an error if passed null', function() {
      return User.hashPassword(null).catch(function(err) {
        assert.match(err.message, /^Invalid password/);
      });
    });

    it('should return an error if passed undefined', function() {
      return User.hashPassword(undefined).catch(function(err) {
        assert.match(err.message, /^Invalid password/);
      });
    });

    it('should return an error if passed empty sring', function() {
      return User.hashPassword('').catch(function(err) {
        assert.match(err.message, /^Invalid password/);
      });
    });

    it('should raise if hashing fails', function() {
      bcryptHashStub.rejects(error);

      return User.hashPassword(password).catch(function(err) {
        assert.strictEqual(error, err);
      });
    });
  });
});
