'use strict'

var gulp = require('gulp')
var mocha = require('gulp-mocha')
var uglify = require('gulp-uglify')
var header = require('gulp-header')
var ghPages = require('gulp-gh-pages')
var rename = require('gulp-rename')
var karma = require('karma').server

// Test
// ----

var jsFilesToBeStyleChecked = [
  './src/*.js',
  './test/**/*.js',
  'gulpfile.js'
]

gulp.task('mocha', function() {
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
