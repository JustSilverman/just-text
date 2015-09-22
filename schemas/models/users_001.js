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
        label: 'first name',
        type: DataTypes.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'First name cannot be blank'
          }
        }
      },

      lastName: {
        field: 'last_name',
        label: 'last name',
        type: DataTypes.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Last name cannot be blank'
          }
        }
      },

      email: {
        type: DataTypes.STRING,
        defaultValue: '',
        unique: true,
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
        label: 'phone number',
        type: DataTypes.STRING,
        unique: true,
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
        defaultValue: '',
        type: DataTypes.STRING
      },

      password: {
        type: DataTypes.VIRTUAL,
        set: function (val) {
          this.setDataValue('password', val);
        },
        defaultValue: '',
        validate: {
          len: {
            args: 7,
            msg: "Password must be atleast 7 characters"
          }
        }
      }
    }
  }
};
