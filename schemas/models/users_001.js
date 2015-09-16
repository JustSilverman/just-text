'use strict';

module.exports = {
  name: 'User',
  tableName: 'users',
  definition: function(DataTypes) {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      firstName: {
        field: 'first_name',
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        field: 'last_name',
        type: DataTypes.STRING,
        allowNull: false
      },

      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Email address must be valid"
          }
        }
      },

      emailValidated: {
        field: 'email_validated',
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },

      phoneNumber: {
        field: 'phone_number',
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        defaultValue: '',
        validate: {
          len: {
            args: [10, 10],
            msg: 'Phone number must be 10 digits'
          }
        }
      },

      phoneNumberValidated: {
        field: 'phone_number_validated',
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },

      passwordHash: {
        field: 'password_hash',
        type: DataTypes.STRING,
        allowNull: false
      },

      password: {
        type: DataTypes.VIRTUAL,
        set: function (val) {
          this.setDataValue('password', val);
        }
      }
    }
  }
};
