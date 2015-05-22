'use strict';

require('should');

describe('gulp-repl', function(){
  var gulp = require('../');

  it('repl property that is a readline Interface', function(){
    var readline = require('readline');
    gulp.repl.constructor.should.be.eql(readline.Interface);
  });

  it('should dispatch registered tasks', function(done){
    var one, two;
    gulp.task('one', function(cb){ one = true; cb(); });
    gulp.task('two', function(cb){ two = true; done(); cb(); });
    gulp.repl.emit('line', 'one two');
  });
});
