'use strict';

var should = require('should');

describe('gulp-repl', function(){
  var gulp = require('gulp');
  var repl = require('../')(gulp);

  it('repl property that is a readline Interface', function(){
    var readline = require('readline');
    repl.constructor.should.be.eql(readline.Interface);
  });

  it('should dispatch registered tasks', function(done){
    var pile = [];

    gulp.task('one', function(cb){
      pile.push('one');
      if(pile.length > 1){ end(); }
      cb();
    });
    gulp.task('two', function(cb){
      pile.push('two');
      if(pile.length > 1){ end(); }
      cb();
    });

    repl.emit('line', 'one two');

    function end(){
      pile.should.containDeep(['one', 'two']);
      done();
    }
  });

  it('undefined tasks should not run', function(){
    gulp.task('one', function(){});
    var tasks = gulp.tasks || gulp._registry._tasks;
    should.exist(tasks);
    repl.emit('line', 'whatever');
  });
});
