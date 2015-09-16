var sequelize = require('sequelize');
var helper = require('../../../helpers/schema');

describe('schema helper', function() {
  var id = {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  };

  var firstName = {
    field: 'first_name',
    type: sequelize.STRING,
    allowNull: false,
  };

  var password = {
    type: sequelize.VIRTUAL,
    allowNull: false,
  };

  describe('#removeVirtual', function() {
    it('should remove virtual attributes', function() {

    });

  });

  describe('#timestamps', function() {

    describe('#addToSchema', function() {
      it('should add the default methods to the schema', function() {
        var schema = {
          id: id,
          firstName: firstName
        };
        var withTimestamps = helper.addTimestampsToSchema(schema);

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
        var withTimestamps = helper.addTimestampsToSchema(schema, ['at', 'creationTime']);

        assert.strictEqual(sequelize.DATE, withTimestamps.at.type);
        assert.isFalse(withTimestamps.at.allowNull);
        assert.strictEqual(sequelize.DATE, withTimestamps.creationTime.type);
        assert.isFalse(withTimestamps.creationTime.allowNull);

        assert.strictEqual(id, withTimestamps.id);
        assert.strictEqual(firstName, withTimestamps.firstName);
      });
    });
  });
});
