'use strict';

/** # completer(line)

arguments
 - gulp, gulp instance
 - line, `string`, passed from readline's `line` event
 - callback, `function` passed from readline's

returns undefined
**/

exports = module.exports = completer;

function completer(gulp, line){
  var completion = Object.keys(
    gulp.tasks || // gulp 3.x
    gulp._registry._tasks // gulp 4.x
  );

  var match = line.match(/([ ]+|^)\S+$/);
  if(match){ line = line.slice(match.index, line.length).trim(); }

  var hits = completion.filter(function(elem){
    return !elem.indexOf(line);
  });

  // TODO: add async path completion (nodejs.org/api/readline.html)
  return [hits.length ? hits : completion, line];
}
