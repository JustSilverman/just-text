'use strict';

module.exports = {
  name: 'PhoneNumberConfirmation',
  tableName: 'phone_number_confirmations',
  definition: function(DataTypes) {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },

      code: {
        field: 'code',
        label: 'confirmation Code',
        type: DataTypes.STRING,
        unique: true,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Confirmation code cannot be blank'
          }
        }
      },

      expirationTime: {
        field: 'expiration_time',
        label: 'expiration time',
        type: DataTypes.DATE,
        allowNull: false
      },

      isUsed: {
        field: 'is_used',
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }
  }
};
