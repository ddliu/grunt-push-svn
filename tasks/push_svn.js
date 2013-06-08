/*
 * grunt-push-svn
 * https://github.com/ddliu/grunt-push-svn
 *
 * Copyright (c) 2013 Dong
 * Licensed under the MIT license.
 */

'use strict';

var os = require('os');
var path = require('path');
var crypto = require('crypto');
var SVN = require('svn-spawn');
var async = require('async');
var fs = require('fs');
var util = require('util');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('push_svn', 'Your task description goes here.', function() {
    var options = this.options({
          remove: false,
          message: 'committed with grunt-push-svn',
          pushIgnore: [],
          removeIgnore: [],
        }),
        done = this.async(),
        src = this.data.src,
        dest = this.data.dest,
        tmpPath,
        svn;

    // .svn should be ignored
    if (options.remove) {
      if (!util.isArray(options.removeIgnore)) {
        options.removeIgnore = [options.removeIgnore];
      }
      options.removeIgnore.push('**/.svn/**');
    }

    if (!util.isArray(options.pushIgnore)) {
      options.pushIgnore = [options.pushIgnore];
    }
    options.pushIgnore.push('**/.svn/**');

    if ('tmp' in this.data) {
      tmpPath = this.data.tmp;
    }
    else {
      tmpPath = path.join(os.tmpdir(), 'push_svn_' + crypto.createHash('md5').update(JSON.stringify(this.data)).digest('hex'));
    }

    svn = new SVN({
      cwd: tmpPath
    });

    grunt.log.subhead('push_svn task: %s --> %s --> %s', src, tmpPath, dest);

    async.series([
      // make sure tmpPath exists
      function(callback) {
        grunt.log.writeln('Prepare tmp path...');
        if (!grunt.file.isDir(tmpPath)) {
          if (grunt.file.exists(tmpPath)) {
            callback(new Error(util.format('"%s" is not a directory', tmpPath)));
          }
          else {
            grunt.file.mkdir(tmpPath);
            callback(null);
          }
        }
        else {
          callback(null);
        }
      },
      // prepare a svn working directory
      function(callback) {
        grunt.log.writeln(util.format('Prepare tmp svn working copy [%s]: [%s]...', tmpPath, dest));
        svn.getInfo(function(err, data) {
          if (err) {
            // not empty
            if (fs.readdirSync(tmpPath).length) {
              callback(err);
            }
            else {
              svn.checkout(dest, callback);
            }
          }
          else if (data.url !== dest) {
            callback(new Error(util.format('There is already a repo in folder "%s" with url "%s"', tmpPath, dest)));
          }
          else {
            svn.update(callback);
          }
        });
      },
      // sync with tmp working directory
      function(callback) {
        grunt.log.writeln('Push to tmp path...');
        // remove
        if (options.remove) {
          grunt.file.recurse(tmpPath, function(abs, rootdir, subdir, filename) {
            if (typeof subdir !== 'string') {
              subdir = '';
            }
            var subPath = path.join(subdir, filename);

            if (
              !grunt.file.exists(path.join(src, subPath)) && 
              !grunt.file.isMatch(options.removeIgnore, subPath)
            ) {
              // remove it
              grunt.log.writeln(util.format('Remove "%s"...', subPath));
              grunt.file.delete(abs);
            }
          });
        }

        // copy
        grunt.file.recurse(src, function(abs, rootdir, subdir, filename) {
          if (typeof subdir !== 'string') {
            subdir = '';
          }
          var subPath = path.join(subdir, filename),
              srcFile = abs,
              destFile = path.join(tmpPath, subPath),
              srcStats = fs.statSync(srcFile),
              destStats;

          if (!options.pushIgnore || !grunt.file.isMatch(options.pushIgnore, subPath)) {
            // dir
            if (grunt.file.isDir(srcFile)) {
              if (!grunt.file.isDir(destFile)) {
                if (grunt.file.exists(destFile)) {
                  grunt.file.delete(destFile);
                }
                grunt.log.writeln(util.format('Create folder "%s"...', subPath));
                grunt.file.mkdir(destFile);
              }
            }
            else {
              if (grunt.file.isDir(destFile)) {
                grunt.file.delete(destFile);
              }
              else if (grunt.file.exists(destFile)) {
                destStats = fs.statSync(destFile);

                if (srcStats.size !== destStats.size || (destStats.mtime - srcStats.mtime !== 0)) {
                  grunt.log.writeln(util.format('Push changed file "%s"...', subPath));
                  grunt.file.copy(srcFile, destFile);
                  fs.utimesSync(destFile, srcStats.atime, srcStats.mtime);
                }
              }
              else {
                grunt.log.writeln(util.format('Push new file "%s"...', subPath));
                grunt.file.copy(srcFile, destFile);
                fs.utimesSync(destFile, srcStats.atime, srcStats.mtime);
              }
            }
          }
        });
        callback(null);
      },
      // add changes
      function(callback) {
        grunt.log.writeln('Add local changes...');
        svn.addLocal(callback);
      },
      // commit svn
      function(callback) {
        grunt.log.writeln('Commit...');
        svn.commit(options.message, callback);
      }
    ], function(err) {
      done(err);
    });

  });

};
