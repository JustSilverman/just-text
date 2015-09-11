var dbName = require('./config/settings').dbName;

module.exports = function(grunt) {
  grunt.initConfig({
    env: {
      NODE_ENV: process.env.NODE_ENV
    },

    run: {
      resetDb: {
        exec: 'dropdb ' + dbName + ' --if-exists && createdb ' + dbName
      },
      migrate: {
        exec: 'sequelize db:migrate'
      },
      server: {
        exec: 'node app.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          colors: true
        },
        src: ['test/setup.js', 'test/**/*.js']
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', []);
  grunt.registerTask('server', ['env', 'run:server']);
  grunt.registerTask('reset-db', ['run:resetDb', 'run:migrate']);
  grunt.registerTask('test', ['env', 'reset-db', 'mochaTest']);
};
