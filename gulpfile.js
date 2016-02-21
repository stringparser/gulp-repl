'use strict';

var gulp = require('gulp');
gulp.repl = require('.')(gulp);

gulp.task('foo', function (cb) {
  // do foo stuff
  setTimeout(cb, Math.random() * 1000);
});

gulp.task('bar', function (cb) {
  // do bar stuff
  setTimeout(cb, Math.random() * 500);
});

gulp.task('watch', function(cb){

});

gulp.task('default', ['foo', 'watch', 'bar']);
