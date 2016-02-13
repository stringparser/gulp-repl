'use strict';

exports = module.exports = {};

exports.getGulp = function (gulp){

  if(gulp && gulp.constructor && gulp.constructor.name === 'Gulp'){
    return gulp;
  }

  try {
    return require('gulp');
  } catch (err){
    console.log('gulp is not installed locally');
    console.log('try `npm install gulp`');
    process.exit(1);
  }
};

exports.getRegistry = function (gulp){
  var tasks = gulp.tasks || (gulp._registry && gulp._registry._tasks);
  var registry = {_tasks: tasks};
  if(typeof tasks.get === 'function'){
    registry.get = function(name){
      return tasks.get(name);
    };
  } else {
    registry.get = function(name){
      return tasks[name];
    };
  }
  return registry;
};

exports.completer = function(line, tasks){
  var match = line.match(/([ ]+|^)\S+$/);

  if(match){
    line = line.slice(match.index, line.length).trim();
  }

  var completion = [];
  line.split(/[ ]+/).forEach(function(name, index, pending){
    var tail = pending.slice(index).join(' ');
    var task = tasks.get(tail) || tasks.get(name);
    if(task){
      completion.push(task.label || name);
    }
  });

  if(!completion.length){
    completion = Object.keys(tasks._tasks);
  }

  var hits = completion.filter(function(elem){
    return !elem.indexOf(line);
  });

  // TODO: add async path completion (nodejs.org/api/readline.html)
  return [hits.length ? hits : completion, line];
};
