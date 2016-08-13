# gulp-repl [![NPM version][b-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[![build][b-build]][x-travis]

Simple repl for gulp compatible with gulp#3.x and the future gulp#4.x.

### usage

```js
// gulpfile example
var gulp = require('gulp');
var repl = require('gulp-repl');

gulp.task('repl-start', function (cb) {
  gulp.repl = repl(gulp);
});

gulp.task('repl-stop', function (cb) {
  if (gulp.repl) {
    gulp.repl.close(); // same as nodejs.org/api/readline.html#readline_rl_close
  }
	cb();
});


gulp.task('foo', function (cb) {
  // do foo stuff
  cb();
});

gulp.task('bar', function (cb) {
  // do bar stuff
  cb();
});

gulp.task('default');
```

Then, on your terminal write:

```
gulp repl-start
```

and you'll have a repl with:

1. Press <kbd>Enter</kbd> to see the prompt
1. write the tasks you want to run
1. Press <kbd>Tab</kbd> for completion

```
$ gulp
... some task logging here
(press Enter)
> (press Tab to see completion)
foo      bar      default
> foo bar
[10:39:11] Starting 'foo'...
[10:39:11] Finished 'foo' after 13 μs
[10:39:11] Starting 'bar'...
[10:39:11] Finished 'bar' after 5.52 μs
```

### API

The module exports a function

```js
var repl = require('gulp-repl');
```

Calling the function with `gulp` creates a `readline` instance using `gulp` tasks as commands for a REPL.

```js
var gulp = require('gulp');
var gulpREPL = require('repl');

// to start the repl
gulp.repl = gulpREPL.start(gulp);
```

#### gulpREPL.add

```js
function add(Gulp gulp)
```

Adds the given `gulp` instance for the REPL to be able to lookup and _returns_ the module again.

#### gulpREPL.remove

```js
function remove(Gulp gulp)
```

Removes the given `gulp` instance for the REPL to be able to lookup and _returns_ the module again.

#### gulpREPL.reset

```js
function reset()
```

Removes all of the previously added instances and _returns_ the module again.

#### gulpREPL.get

```js
function get(Gulp gulp)
```

Takes a `gulp` instance as argument

_returns_
- `null` if the `gulp` instance wasn't stored yet
- all of the stored instances if no arguments are given
- metadata stored for the given `gulp` instance if was already stored

#### gulpREPL.start

```js
function start(Gulp gulp)
```

Starts a REPL listening on `stdin` and writing on `stdout` and _returns_ a `readline.Interface` instance. Each of the commands typed to the REPL are looked up in each of the instances given on `add`.

[See node's core module `readline` documentation about the `readline.Interface`](https://nodejs.org/api/readline.html).


### install

```
$ npm install --save-dev gulp-repl
```

## Changelog

[v2.0.0][v2.0.0]:
- docs: add new api docs
- test: split test into files for each api method
- dev: separate module into add, get, remove, reset and start

[v1.1.2][v1.1.2]:

- docs: add changelog
- next_release: patch release
- fix: `gulp.parallel` as task runner when `gulp.start` is undefined

[v1.1.1][v1.1.1]:

- fix: make the repl prompt after not found tasks
- fix: line end matches

[v1.1.0][v1.1.0]:
- manage multiple gulp instances

### license

The MIT License (MIT)

Copyright (c) 2015-2016 Javier Carrillo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<!-- links -->
[x-npm]: https://npmjs.com/gulp-repl
[x-travis]: https://travis-ci.org/stringparser/gulp-repl/builds

[b-build]: https://travis-ci.org/stringparser/gulp-repl.svg?branch=master
[b-version]: http://img.shields.io/npm/v/gulp-repl.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/gulp-repl.svg?style=flat-square


[v2.0.0]: https://github.com/stringparser/gulp-repl/commit/572df8ce7cd9d4edd3a2190de021381671a295f0
[v1.1.2]: https://github.com/stringparser/gulp-repl/commit/572df8ce7cd9d4edd3a2190de021381671a295f0
[v1.1.1]: https://github.com/stringparser/gulp-repl/commit/6f4655ca1a667ca04d2a668a175055f9b4437d65
[v1.1.0]: https://github.com/stringparser/gulp-repl/commit/71a2301233a92d68dbfd7e7a1493a38be72d0a0e
