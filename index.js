'use strict';

exports = module.exports = gulpRepl;

function gulpRepl(_gulp_){
  // lazyyy
  var util = require('./lib/util');
  var gulp = util.getGulp(_gulp_);
  var tasks = util.getTasks(gulp);
  var runner = gulp.parallel || gulp.start;

  /**
   * create a readline interface
  **/
  var repl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: function(line){
      return util.completer(line, tasks);
    }
  });

  /**
   * queue tasks when line is not empty
  **/
  repl.on('line', function onLine(line){
    var queue = util.getQueue(line, tasks);

    if(queue.notFound.length){
      var plural = queue.notFound.length > 1;
      console.log(' `%s` task%s %s not defined yet',
        queue.notFound.join(', '),
        plural ? 's' : '',
        plural ? 'are' : 'is'
      );
    }

    if(!queue.found.length){
      return repl.prompt();
    }

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

  util.waitToPrompt(gulp, repl);

  return repl;
}
