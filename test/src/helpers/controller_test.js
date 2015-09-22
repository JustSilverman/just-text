var helper = require('helpers/controller');

describe('controller helper', function() {
  describe('#toErrorMap', function() {
    it('should return an empty array if the arg is undefined', function() {
      assert.deepEqual([], helper.toErrorMap());
    });

    it('should return an empty array if there are no errors', function() {
      assert.deepEqual([], helper.toErrorMap([]));
    });

    it('should return the field name and message', function() {
      var errors = [
        { message: 'firstName cannot be null',
          type: 'notNull Violation',
          path: 'firstName',
          value: null
        },
       { message: 'Phone number must be 10 digits',
         type: 'Validation error',
         path: 'phoneNumber',
         value: 'Phone number must be 10 digits',
         __raw: 'Phone number must be 10 digits'
       }
     ]
     assert.deepEqual([
        { field: 'firstName', message: 'firstName cannot be null' },
        { field: 'phoneNumber', message: 'Phone number must be 10 digits' }
      ], helper.toErrorMap(errors));
    });
  });
});