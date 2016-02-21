'use strict';

exports = module.exports = {};

exports.getGulp = function (gulp){
  if(!gulp || typeof gulp.task !== 'function'){
    try {
      gulp = require('gulp');
    } catch (err){
      console.log('gulp is not installed locally');
      console.log('try `npm install gulp`');
      process.exit(1);
    }
  }

  return gulp;
};

exports.getTasks = function (gulp){
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

  return tasks;
};

exports.getQueue = function(line, tasks){
  line = line.trim();

  var queue = {found: [], notFound: []};

  while(line.length){
    var name = /(\S+)/.exec(line).pop();
    var task = tasks.get(name, line) || {
      notFound: line.slice(name.length)
    };

    if(task.match){
      queue.found.push(task.match);
    } else {
      queue.notFound.push(name);
    }

    line = task.notFound.trim();
  }

  return queue;
};

exports.completer = function(line, tasks){
  var match = line.match(/([ ]+|^)\S+$/);

  if(match){
    line = line.slice(match.index, line.length).trim();
  }

  var completion = this.getQueue(line, tasks).found;

  if(!completion.length){
    completion = Object.keys(tasks.obj);
  }

  var hits = completion.filter(function(elem){
    return !elem.indexOf(line);
  });

  // TODO: add async path completion (nodejs.org/api/readline.html)
  return [hits.length ? hits : completion, line];
};

exports.waitToPrompt = function(gulp, repl){
  var queue = [];
  var events = [
    'start', 'task_start',
    'err', 'stop', 'error', 'task_err', 'task_stop', 'task_not_found'
  ];

  events.forEach(function(eventName){
    gulp.on(eventName, /start/.test(eventName) ? start : finish);
  });

  function start(ev){
    var taskName = ev && (ev.task || ev.name);
    if(!taskName){ return; }
    if(/watch/i.test(taskName)){
      finish({task: taskName});
    } else {
      queue.push(taskName);
    }
  }

  function finish(ev){
    var taskName = ev && (ev.task || ev.name);
    var index = queue.indexOf(taskName);
    if(index > -1){ queue.splice(index, 1); }
    if(queue.length){ return; }
    setTimeout(function(){
      repl.prompt();
    }, 10);
  }
};
