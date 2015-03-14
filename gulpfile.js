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

// Test
// ----

var jsFilesToBeStyleChecked = [
  './src/*.js',
  './test/*.js',
  'gulpfile.js'
]
var jsFilesToBeTested = ['test/index.js']

gulp.task('mocha', ['jshint'], function() {
  return gulp.src(jsFilesToBeTested)
    .pipe(mocha())
})

gulp.task('jshint', ['jscs'], function() {
  return gulp.src(jsFilesToBeStyleChecked)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
})

gulp.task('jscs', function() {
  return gulp.src(jsFilesToBeTested)
    .pipe(jscs())
})

gulp.task('test', ['mocha'])

// Build
// -----

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

gulp.task('build', function() {
  gulp.src('src/index.js')
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist'))
})

// Deploy
// ------

gulp.task('deploy:example', ['build'], function() {
  gulp.src('./dist/index.js')
    .pipe(rename({
      basename: 'logdown'
    }))
    .pipe(gulp.dest('./example/lib'))

  return gulp.src('./example/**')
    .pipe(ghPages())
})
