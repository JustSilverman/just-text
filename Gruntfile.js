module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          require: ['test/setup.js'],
          reporter: 'spec',
          colors: true
        },
        src: ['test/**/*.js']
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', []);
  grunt.registerTask('test', ['mochaTest']);
};
