/*
 * grunt-push-svn
 * https://github.com/ddliu/grunt-push-svn
 *
 * Copyright (c) 2013 Dong
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    push_svn: {
      options: {
        remove: true,
      },
      main: {
        options: {
          remove: true,
          pushIgnore: ['a.ignore', '.*'],
          removeIgnore: []
        },
        src: 'test/src/main',
        dest: 'file:///home/dong/projects/test/test-svn-trunk',
        tmp: 'tmp/.build/a'
      },
      another: {
        options: {
          remove: true,
          pushIgnore: ['b.ignore', '.*'],
          removeIgnore: []
        },
        src: 'test/src/main',
        dest: 'file:///home/dong/projects/test/test-svn-trunk',
        tmp: 'tmp/.build/b'
      },
      test: {
        options: {
          remove: true,
        },
        src: 'test/src/test',
        dest: 'file:///home/dong/projects/test/test-svn-trunk',
        tmp: 'tmp/.build/test'
      },
      testmkdir: {
        options: {
          trymkdir: true,
        },
        src: 'test/src/main',
        dest: 'file:///home/dong/projects/test/test-svn-trunk/1',
        tmp: 'tmp/.build/mkdir'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'push_svn:test', 'push_svn:main', 'push_svn:another']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
