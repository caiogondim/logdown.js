/* jshint node:true */

'use strict'

var gulp = require('gulp')
var mocha = require('gulp-mocha')
var jshint = require('gulp-jshint')
var jscs = require('gulp-jscs')
var uglify = require('gulp-uglify')
var header = require('gulp-header')
var ghPages = require('gulp-gh-pages')
var rename = require('gulp-rename')
var karma = require('karma').server
var bump = require('gulp-bump')
var runSequence = require('run-sequence')

// Test
// ----

var jsFilesToBeStyleChecked = [
  './src/*.js',
  './test/**/*.js',
  'gulpfile.js'
]

gulp.task('jscs', function() {
  return gulp.src(jsFilesToBeStyleChecked)
    .pipe(jscs())
})

gulp.task('jshint', ['jscs'], function() {
  return gulp.src(jsFilesToBeStyleChecked)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
})

gulp.task('mocha', ['jshint'], function() {
  return gulp.src(['test/server/*.js', 'test/server.js'])
    .pipe(mocha())
})

gulp.task('karma', ['mocha'], function(done) {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done)
})

gulp.task('karma-travisci', ['mocha'], function(done) {
  karma.start({
    configFile: __dirname + '/test/karma-travisci.conf.js',
    singleRun: true
  }, done)
})

gulp.task('test', ['karma'])
gulp.task('test:travisci', ['karma-travisci'])

// Build
// -----

gulp.task('build', function() {
  var pkg = require('./package.json')
  var banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' *',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

  gulp.src('src/index.js')
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist'))
    .pipe(rename({
      basename: 'logdown'
    }))
    .pipe(gulp.dest('./example/lib'))
})

// Deploy
// ------

gulp.task('deploy:example', ['build'], function() {
  return gulp.src('./example/**')
    .pipe(ghPages())
})

// Release
// -------

gulp.task('bump:major', function() {
  return gulp.src(['package.json', 'bower.json'])
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'))
})

gulp.task('bump:minor', function() {
  return gulp.src(['package.json', 'bower.json'])
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'))
})

gulp.task('bump:patch', function() {
  return gulp.src(['package.json', 'bower.json'])
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'))
})

gulp.task('release:major', function(callback) {
  runSequence('bump:major', 'build', callback)
})

gulp.task('release:minor', function(callback) {
  runSequence('bump:minor', 'build', callback)
})

gulp.task('release:patch', function(callback) {
  runSequence('bump:patch', 'build', callback)
})
