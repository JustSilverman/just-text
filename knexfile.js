var DB_NAME = 'just_text';
var CONSTRING = 'postgres://@localhost/' + DB_NAME;

module.exports = {
  development: {
    client: 'postgresql',
    connection: CONSTRING,

    migrations: {
      tableName: DB_NAME + '_migrations',
      directory: './db/migrations'
    },

    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'postgresql',

    connection: {},
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: DB_NAME + '_migrations'
    }
  }
};
