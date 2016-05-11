'use strict';

exports = module.exports = {};

exports.uniq = require('lodash.uniq');

exports.getGulp = function(gulp){
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

exports.getTasks = function(gulp){
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
    tasks.get = function(name){
      return tasks.obj[name] && {match: name};
    };
  }

  return tasks;
};

exports.getQueue = function(line, tasks){
  var queue = {found: [], notFound: []};

  while(line.length){
    var name = /(\S+)/.exec(line).pop();
    var task = tasks.get(name, line);

    if(task && task.match){
      queue.found.push(task.match);
      line = line.slice(task.match.length).trim();
    } else {
      queue.notFound.push(name);
      line = line.slice(name.length).trim();
    }
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
    if(!matches.found.length){
      Object.keys(instance.tasks.obj).forEach(function(name){
        matches.found.push.apply(matches.found,
          (name.match(/\(([^(]+)\)/) || [name]).pop().split('|')
        );
      });
    }
    completion.push.apply(completion, matches.found);
  });

  var hits = exports.uniq(completion).filter(function(elem){
    return !elem.indexOf(line);
  });

  // TODO: add async path completion (nodejs.org/api/readline.html)
  return [hits.length ? hits : completion, line];
};
