'use strict';

exports = module.exports = {};

exports.getGulp = function (gulp){

  if(gulp && typeof gulp.task === 'function'){
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

exports.getTasks = function (gulp){
  var tasks = {
    obj: (
      (gulp._registry && gulp._registry._tasks) || // gulp#4
      (gulp.tasks && gulp.tasks.store) || // gulp-runtime
      gulp.tasks
    ),
    registry: gulp._registry || gulp.tasks
  };

  if(typeof tasks.registry.get === 'function'){
    tasks.get = function(name){
      return tasks.registry.get(name);
    };
  } else {
    tasks.get = function(name){
      return tasks.obj[name];
    };
  }

  return tasks;
};

exports.getQueue = function(line, tasks){
  var queue = {found: [], notFound: []};

  while(line){
    var name = line[0];
    var tail = line.slice().join(' ');
    var task = tasks.get(tail) || tasks.obj[name];

    if(task){
      queue.found.push(task.match || name);
      line = (task.notFound || tail.slice(name.length)).trim();
    } else {
      queue.notFound.push(name);
      line = tail.slice(name.length).trim();
    }

    line = line && line.split(/[ ]+/);
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
