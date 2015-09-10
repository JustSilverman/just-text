var dbName = require('./config/settings').dbName;

module.exports = function(grunt) {
  grunt.initConfig({
    env: {
      dev: {
        NODE_ENV: process.env.NODE_ENV
      },
      test: {
        NODE_ENV: process.env.NODE_ENV
      },
      prod: {
        NODE_ENV: process.env.NODE_ENV
      }
    },

    run: {
      resetDb: {
        exec: 'dropdb ' + dbName + ' --if-exists && createdb ' + dbName
      },
      migrate: {
        exec: 'sequelize db:migrate'
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
  grunt.registerTask('reset-db', ['run:resetDb', 'run:migrate']);
  grunt.registerTask('test', ['env:test', 'reset-db', 'mochaTest']);
};
