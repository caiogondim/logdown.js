var gulp = require('gulp')
var mocha = require('gulp-mocha')

gulp.task('mocha', function() {
  return gulp.src('test/index.js')
    .pipe(mocha())
})

gulp.task('test', ['mocha'])
