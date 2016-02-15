'use strict';

var path = require('path');
var util = require('gulp-util');
var Parth = require('parth');

var cli = exports = module.exports = new Parth();

var logger = util.log;
var silent = function(){};

cli.set(':flag(--silent)', function(){
  util.log = util.log === silent ? logger : silent;
  this.env.log = util.log === logger;
  util.log('logging restored');
});

cli.set(':flag(--cwd) :dirname', function(){
  var cwd = process.cwd();
  var dirname = path.resolve(cwd, this.params.dirname);
  if(dirname !== cwd){
    process.chdir(dirname);
    util.log('Working directory changed to', util.colors.magenta(dirname));
  }
});

cli.set(':flag(--no-color|--color)', function(){
  util.colors.enabled = this.params.flag === '--color';
  util.log('color %s', util.colors.enabled
    ? util.colors.bold('enabled')
    : 'disabled'
  );
});

cli.set(':flag(--tasks-simple|--tasks|-T)', function(){
  if(!this.env.log || this.params.flag === '--tasks-simple'){
    return console.log( Object.keys(this.tasks.obj).join('\n') );
  } else if(typeof this.gulp.tree === 'function'){
    return console.log( require('archy')(this.gulp.tree()) );
  }

  var self = this;
  var tree = {nodes: []};

  Object.keys(self.tasks.obj).reduce(function(prev, task){
    prev.nodes.push({
      label: task,
      nodes: self.tasks[task].dep
    });
    return prev;
  }, tree);

  console.log('Tasks for ' + this.env.configFile);
  console.log( require('archy')(tree) );
});

cli.set(':flag(--require|--gulpfile) :file', function (){
  var cwd = process.cwd();
  var file = path.resolve(cwd, this.params.file);
  var cached = Boolean(require.cache[file]);
  if(cached){ delete require.cache[file]; }

  try {
    require.resolve(file);
  } catch(err){
    console.log('Could not load %s', util.colors.magenta(file));
    if(!this.env.repl){ return; } else { throw err; }
  }

  util.log(cached ? 'Reloaded' : 'Loaded', util.colors.magenta(file));
});
