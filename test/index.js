'use strict';

var gulp = require('gulp');
var should = require('should');
var readline = require('readline');

var gulpRepl = require('../.');
var repl = gulpRepl(gulp);

it('repl should be a readline Interface', function(){
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
  should.exist(gulp.tasks || gulp._registry._tasks);
  repl.emit('line', 'whatever');
});

it('should handle more than one instance', function (done){
  var pile = [];
  var gulp2 = new gulp.constructor();

  gulpRepl(gulp2);

  gulp.task('three', function(cb){
    pile.push('three');
    if(pile.length > 1){ end(); }
    cb();
  });

  gulp2.task('four', function(cb){
    pile.push('four');
    if(pile.length > 1){ end(); }
    cb();
  });

  repl.emit('line', 'three four');

  function end(){
    pile.should.containDeep(['three', 'four']);
    done();
  }
});

it('should not add an instance more than once', function (){
  var length = gulpRepl.instances.length;
  var gulp3 = new gulp.constructor();
  '1234567890'.split('').forEach(function(){
    gulpRepl(gulp3);
    gulpRepl.instances.length.should.be.eql(length + 1);
  });
});

it('should run found tasks indenpently of instances', function (done){
  var gulp1 = new gulp.constructor();
  var gulp2 = new gulp.constructor();

  gulpRepl.instances = [];
  gulpRepl(gulp1);
  gulpRepl(gulp2);

  var pile = [];
  gulp1.task('one', function(cb){
    pile.push('one');
    if(pile.length > 1){ end(); }
    cb();
  });

  gulp2.task('two', function(cb){
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
