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
      gulp.tasks // gulp#3
    )
  };

  if(typeof (gulp.tasks && gulp.tasks.get) === 'function'){
    tasks.get = function(name, line){
      return gulp.tasks.get(line.slice().join(' '));
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

  line = line.trim().split(/[, ]+/);

  while(line.length){
    var name = line[0];
    var task = tasks.get(name, line);

    if(task){
      queue.found.push(task.match || name);
      line = task.notFound || line.slice(1);
    } else {
      queue.notFound.push(name);
      line = line.slice(1);
    }
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
