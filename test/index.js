'use strict';

require('should');

describe('gulp-repl', function(){
  var gulp = require('gulp');
  var repl = require('../');

  it('repl property that is a readline Interface', function(){
    var readline = require('readline');
    repl.constructor.should.be.eql(readline.Interface);
  });

  it('should dispatch registered tasks', function(done){
    var one, two;
    gulp.task('one', function(cb){ one = true; cb(); });
    gulp.task('two', function(cb){ two = true; done(); cb(); });
    repl.emit('line', 'one two');
  });
});
