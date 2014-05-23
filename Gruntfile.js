/*
 * grunt-push-svn
 * https://github.com/ddliu/grunt-push-svn
 *
 * Copyright (c) 2013-2014 Dong <ddliuhb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    repoDir: '/tmp/grunt-push-svn-test',
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Create test repo
    shell: {
      initRepo: {
        command: 'rm -rf <%= repoDir %> && svnadmin create <%= repoDir %>'
      }
    },

    // Configuration to be run (and then tested).
    push_svn: {
      options: {
        remove: true,
      },
      main1: {
        options: {
          remove: true,
          pushIgnore: ['a.ignore', '.*'],
          removeIgnore: []
        },
        src: 'test/src/main',
        dest: 'file://<%= repoDir %>',
        tmp: 'tmp/build/a'
      },
      another: {
        options: {
          remove: true,
          pushIgnore: ['b.ignore', '.*'],
          removeIgnore: []
        },
        src: 'test/src/main',
        dest: 'file://<%= repoDir %>',
        tmp: 'tmp/build/b'
      },
      test1: {
        options: {
          remove: true,
        },
        src: 'test/src/test',
        dest: 'file://<%= repoDir %>',
        tmp: 'tmp/build/test'
      },
      mkdir: {
        options: {
          trymkdir: true,
        },
        src: 'test/src/main',
        dest: 'file://<%= repoDir %>/1/2',
        tmp: 'tmp/build/mkdir'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-shell');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'shell', 'push_svn']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
