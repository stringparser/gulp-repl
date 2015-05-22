'use strict';

// ## completer(line, callback)
//
// arguments
//  - gulp, gulp instance
//  - line, `string`, passed from readline's `line` event
//  - callback, `function` passed from readline's
//
// returns undefined
//
// --
// api.private
// --

function completer(gulp, line){

  var completion;

  if(gulp.tasks){ // gulp#3.x
    completion = Object.keys(gulp.tasks);
  } else if(gulp._registry && gulp._registry._tasks){ // gulp#4.0
    completion = Object.keys(gulp._registry._tasks);
  } else { completion = []; }

  var match = line.match(/([ ]+|^)\S+$/);
  if(match){
    line = line.substring(match.index, line.length).trim();
  }

  var hits = completion.filter(function(elem){
    return !elem.indexOf(line);
  });

  // TODO: add async path completion
  // read: nodejs.org/api/readline.html
  return [hits.length ? hits : completion, line];
}

exports = module.exports = completer;
