'use strict';

exports = module.exports = gulpRepl;

function gulpRepl(_, o){
  // lazyyy
  var util = require('./lib/util');
  var readline = require('readline');

  var gulp = util.getGulp(_);
  var tasks = util.getRegistry(gulp);

  /**
   * create a readline interface
  **/
  var repl = readline.createInterface({
    input: o && o.input || process.stdin,
    output: o && o.output || process.stdout,
    completer: o && o.completer || function(line){
      return util.completer(line, tasks);
    }
  });

  /**
   * queue tasks when line is not empty
  **/
  repl.on('line', function onLine(line){
    line = line.trim();

    if(!line){ return repl.prompt(); }

    var queue = {found: [], notFound: []};

    line.split(/[ ]+/).forEach(function(name, index, pending){
      var tail = pending.slice(index).join(' ');
      var task = tasks.get(tail) || tasks.get(name);

      if(task){ queue.found.push(task.label || name); } else {
        queue.notFound.push(name);
      }
    });

    if(queue.notFound.length){
      var plural = queue.notFound.length > 1;
      console.log(' `%s` task%s %s not defined yet',
        queue.notFound,
        plural ? 's' : '',
        plural ? 'are' : 'is'
      );
    }

    if(!queue.found.length){
      return repl.prompt();
    }

    var runner = gulp.parallel || gulp.start;
    var result = runner.apply(gulp, queue.found);
    if(typeof result === 'function'){
      result(); // gulp#4.0
    }
  });

  /**
   * exit on SIGINT with a timestamp
  **/
  repl.on('SIGINT', function(){
    process.stdout.write('\n');
    console.log(new Date());
    process.exit(0);
  });

  return repl;
}
