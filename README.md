# grunt-push-svn

[![Build Status](https://travis-ci.org/ddliu/grunt-push-svn.png)](https://travis-ci.org/ddliu/grunt-push-svn)

> Push local directory to a specified SVN server


## Getting Started

This plugin requires `svn` command line and Grunt `~0.4.1`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-push-svn --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-push-svn');
```

## The "push_svn" task

### Overview
In your project's Gruntfile, add a section named `push_svn` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  push_svn: {
    options: {
      remove: false, 
      pushIgnore: ['**/*.tmp'],
      removeIgnore: ['**/*.gif']
    },
    main: {
      src: '/path to your local directory',
      dest: 'https://svn.example.com/path/to/your/repo',
      tmp: './.build'
    },
  },
})
```

### Options

#### options.username
Default value: undefined

If the target repo need authentication and you don't have the authentication saved, set username and password in Options.

#### options.password
Type: `String`

#### options.remove
Type: `Boolean`
Default value: `false`

With `options.remove` enabled, remote file will be removed if it does not exist in local directory.

#### options.removeIgnore
Type: `Array`
Default value: `[]`

Specify exclude patterns for `options.remove`

#### options.pushIgnore
Type: `Array`
Default value: `[]`

Specify exclude patterns for local files.

#### options.message
Type: `String`
Default value: `"committed with grunt-push-svn"`

#### options.trymkdir
Type: `Boolean`
Default value: `false`

Try to mkdir in remote repo if dest does not exist.

#### options.svnPath
Type: `String`
Default value: `"svn"`

Path to svn(optional)

### Usage Examples

#### Deploy code to SAE or BAE

Deployment of SAE or BAE are based on SVN, so grunt-push-svn is just the perfect tool to help you do that.

```js
grunt.initConfig({
  push_svn: {
    options: {},
    src: '/home/dong/projects/sae_bae_project',
    dest: 'https://svn.sinaapp.com/myapp/subfolder',
    tmp: './tmp'
  },
})
```

## Release History

### v0.1.0 (2013-06-07)

Initial release

### v0.1.1 (2013-06-08)

Fix dependencies

### v0.1.2 (2013-06-08)

Force ignore .svn from src

### v0.1.3 (2013-06-09)

Check src existence; Print friendly message

### v0.1.4 (2013-06-09)

Ignore .svn and .git files

### v0.1.5 (2013-06-09)

Fix ignore files on windows

### v0.1.6 (2013-07-18)

Update readme

### v0.1.7 (2013-08-29)

Add option `trymkdir`

### v0.1.8 (2013-08-30)

Fix checkout bug; travis-ci

### v0.1.9 (2013-12-12)

Add authontication support

### v0.2.0 (2014-05-20)

Add option `svnPath`

### v0.2.1 (2014-05-23)

Make `trymkdir` recursive
