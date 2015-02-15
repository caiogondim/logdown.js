/* jshint node:true */

'use strict'

var gulp = require('gulp')
var mocha = require('gulp-mocha')
var jshint = require('gulp-jshint')
var jscs = require('gulp-jscs')

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
