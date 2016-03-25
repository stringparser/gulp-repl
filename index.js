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
repl.on('line', function onLine(input){
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
function gulpRepl(gulp){
  if(!gulp || typeof gulp.task !== 'function'){
    try {
      gulp = require('gulp');
    } catch (err){
      console.log('gulp is not installed locally');
      console.log('try `npm install gulp`');
      process.exit(1);
    }
  }

  var inInstances = Boolean(
    exports.instances.filter(function(instance){
      return instance.gulp === gulp;
    }).length
  );
  if(inInstances){ return repl; }

  var tasks = {
    obj: (
      (gulp._registry && gulp._registry._tasks) || // gulp#4
      (gulp.tasks && gulp.tasks.store) || // gulp-runtime
      gulp.tasks // gulp#3
    )
  };

  if(typeof (gulp.tasks && gulp.tasks.get) === 'function'){
    tasks.get = function(name, line){
      return gulp.tasks.get(line);
    };
  } else {
    tasks.get = function(name, line){
      return tasks.obj[name] && {
        match: name,
        notFound: line.slice(name.length)
      };
    };
  }

  exports.instances.push({
    gulp: gulp,
    tasks: tasks,
    runner: gulp.parallel || gulp.start
  });

  util.waitToPrompt(gulp, repl);

  return repl;
}
