'use strict'

var browserSync = require('browser-sync').create()
var ghPages = require('gulp-gh-pages')
var gulp = require('gulp')
var header = require('gulp-header')
var karma = require('karma').server
var mocha = require('gulp-mocha')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')

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

gulp.task('karma', function(done) {
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

gulp.task('test', ['mocha', 'karma'])
gulp.task('test:travisci', ['karma-travisci'])

// Deploy
// ------

gulp.task('deploy:example', ['build'], function() {
  return gulp.src('./example/**')
    .pipe(ghPages())
})
