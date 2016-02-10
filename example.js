'use strict';

require('gulp/bin/gulp');

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

gulp.task('default');

gulp.repl.emit('line', 'foo bar');
