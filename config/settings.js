var path = require('path');
var dbConfig = require('./config');
var env = process.env.NODE_ENV || 'development';

var Settings = {
  rootPath: path.normalize(__dirname + '/..'),
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: env,
  dbName: dbConfig[env].database
};

module.exports = Settings;
