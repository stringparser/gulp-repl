'use strict';

var util = require('./lib/util');

exports = module.exports = gulpRepl;
exports.instances = [];

/**
 * create a readline interface
**/
var repl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: function(line){
    return util.completer(line, exports.instances);
  }
});

/**
 * queue tasks when line is not empty
**/
repl.on('line', function(input){
  var line = input.trim();
  if(!line){ return repl.prompt(); }

  var queue = {
    found: [],
    notFound: line.split(/[ ]+/)
  };

  exports.instances.forEach(function(inst){
    var tasks = util.getQueue(queue.notFound.join(' '), inst.tasks);
    if(tasks.found.length){
      queue.found.push({
        inst: inst,
        tasks: tasks.found
      });
    }
    queue.notFound = tasks.notFound;
  });

  if(queue.notFound.length){
    var plural = queue.notFound.length > 1;
    console.log(' `%s` task%s %s not defined yet',
      queue.notFound.join(', '),
      plural ? 's' : '',
      plural ? 'are' : 'is'
    );
    return repl.prompt();
  }

  queue.found.forEach(function(found){
    var result = found.inst.runner.apply(found.inst.gulp, found.tasks);
    if(typeof result === 'function'){
      result(); // gulp#4.0
    }
  });
});

/**
 * exit on SIGINT with a timestamp
**/
repl.on('SIGINT', function(){
  process.stdout.write('\n');
  console.log(new Date());
  process.exit(0);
});

/**
 * add the given gulp instance to the instances array
**/
function gulpRepl(_gulp_){
  var gulp = util.getGulp(_gulp_);

  var inInstances = Boolean(
    exports.instances.filter(function(instance){
      return instance.gulp === gulp;
    }).length
  );
  if(inInstances){ return repl; }

  exports.instances.push({
    gulp: gulp,
    tasks: util.getTasks(gulp),
    runner: gulp.parallel || gulp.start
  });

  return repl;
}
