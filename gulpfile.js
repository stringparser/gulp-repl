'use strict';

var gulp = require('gulp');
gulp.repl = require('.')(gulp);

gulp.task('foo', function (cb) {
  // do foo stuff
  cb();
});

gulp.task('bar', function (cb) {
  // do bar stuff
  cb();
});

gulp.task('default', ['foo', 'bar']);
