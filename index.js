'use strict';

try {
  var gulp = require('gulp');
} catch (err){
  var gutil = require('gulp-util');
  gutil.log('gulp is not installed locally');
  gutil.log('try `npm install gulp`');
  process.exit(1);
}

var readline = require('readline');
var completer = require('./lib/completer');

// create a simple readline interface
//
gulp.repl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: function(line){
    return completer(gulp, line);
  }
});

// dispatch tasks only if line wasn't empty
//
gulp.repl.on('line', function(line){
  line = line.trim();
  if(!line){ return gulp.repl.prompt(); }
  var runner = gulp.parallel || gulp.start;
  var result = runner.apply(gulp, line.split(/[ ]+/));
  if(typeof result === 'function'){ // gulp#4.0
    result();
  }
});

exports = module.exports = gulp;
