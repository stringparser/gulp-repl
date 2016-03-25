'use strict';

exports = module.exports = {};

exports.getQueue = function(line, tasks){
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

exports.completer = function(line, instances){
  var match = line.match(/([\s]+|^)\S+$/);

  if(match){
    line = line.slice(match.index, line.length).trim();
  }

  var completion = [];

  instances.forEach(function (instance){
    var matches = exports.getQueue(line, instance.tasks);
    completion.push.apply(completion, matches.found.length
        ? matches.found
        : Object.keys(instance.tasks.obj)
    );
  });

  var hits = completion.filter(function(elem){
    return !elem.indexOf(line);
  });

  // TODO: add async path completion (nodejs.org/api/readline.html)
  return [hits.length ? hits : completion, line];
};

exports.waitToPrompt = function(gulp, repl){
  var events = [
    'start', 'task_start',
    'err', 'stop', 'error', 'task_err', 'task_stop', 'task_not_found'
  ];

  if(typeof gulp.on === 'function'){
    events.forEach(function(eventName){
      var replEventName = 'task:' + (/start/.test(eventName) ?
        'start' : 'ended'
      );
      gulp.on(eventName, function(ev){
        repl.emit(replEventName, ev);
      });
    });
  }

  var queue = [];

  repl.on('task:start', function start(ev){
    var taskName = ev && (ev.task || ev.name);
    if(!taskName){ return; }
    if(/watch/i.test(taskName)){
      repl.emit('task:ended', ev);
    } else {
      queue.push(taskName);
    }
  });

  repl.on('task:ended', function ended(ev){
    var taskName = ev && (ev.task || ev.name);
    var index = queue.indexOf(taskName);
    if(index > -1){ queue.splice(index, 1); }
    if(queue.length){ return; }
    setTimeout(function(){
      if(!queue.length){
        repl.prompt();
      }
    }, 10);
  });
};
