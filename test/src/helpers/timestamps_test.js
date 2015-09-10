var timestamps = require('../../../helpers/timestamps');
var sequelize = require('sequelize');

describe('timestamps', function() {
  var id = {
    type: 'INTEGER',
    autoIncrement: true,
    primaryKey: true
  };
  var firstName = {
    field: 'first_name',
    type: 'STRING',
    allowNull: false,
  }

  describe('#addToSchema', function() {
    it('should add the default methods to the schema', function() {
      var schema = {
        id: id,
        firstName: firstName
      };
      var withTimestamps = timestamps.addToSchema(schema);

      assert.strictEqual(sequelize.DATE, withTimestamps.createdAt.type);
      assert.isFalse(withTimestamps.createdAt.allowNull);
      assert.strictEqual(sequelize.DATE, withTimestamps.updatedAt.type);
      assert.isFalse(withTimestamps.updatedAt.allowNull);

      assert.strictEqual(id, withTimestamps.id);
      assert.strictEqual(firstName, withTimestamps.firstName);
    });

    it('should support adding custom methods to the schema', function() {
      var schema = {
        id: id,
        firstName: firstName
      };
      var withTimestamps = timestamps.addToSchema(schema, ['at', 'creationTime']);

      assert.strictEqual(sequelize.DATE, withTimestamps.at.type);
      assert.isFalse(withTimestamps.at.allowNull);
      assert.strictEqual(sequelize.DATE, withTimestamps.creationTime.type);
      assert.isFalse(withTimestamps.creationTime.allowNull);

      assert.strictEqual(id, withTimestamps.id);
      assert.strictEqual(firstName, withTimestamps.firstName);
    });
  });
});
