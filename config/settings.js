var path = require('path');
var dbConfig = require('./config');
var env = process.env.NODE_ENV || 'development';

var Settings = {
  rootPath: path.normalize(__dirname + '/..'),
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: env,
  dbName: dbConfig[env].database,
  session: {
    cookieName: 'session',
    secret: 'eg[isfd-8yF9adfasdfajlkjl;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
  }
};

module.exports = Settings;
