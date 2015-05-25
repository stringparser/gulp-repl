'use strict';

// just in case is not used after gulp/bin
//
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
var repl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: function completion(line){
    return completer(gulp, line);
  }
});

// dispatch tasks only if line wasn't empty
//
repl.on('line', function onLine(line){
  line = line.trim();
  if(!line){ return repl.prompt(); }
  var runner = gulp.parallel || gulp.start;
  var result = runner.apply(gulp, line.split(/[ ]+/));
  if(typeof result === 'function'){ // gulp#4.0
    result();
  }
});

exports = module.exports = repl;
