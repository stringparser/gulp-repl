# gulp-repl [![NPM version][b-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[![build][b-build]][x-travis]

Simple repl for gulp compatible with gulp#3.x and the future gulp#4.x.

### usage

```js
// gulpfile example
var gulp = require('gulp');
gulp.repl = require('gulp-repl')(gulp);

gulp.task('foo', function (cb) {
	// do foo stuff
	cb();
});

gulp.task('bar', function (cb) {
	// do bar stuff
	cb();
});

gulp.task('default');

// same as writing foo bar on the command line
gulp.repl.emit('line', 'foo bar');
```

Then, on your terminal, you'll have a repl

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

The module exports a `readline` interface.

For more information [see node's core module `readline` documentation](https://nodejs.org/api/readline.html).

### install

```
$ npm install --save-dev gulp-repl
```

## Changelog

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


[v1.1.2]: https://github.com/stringparser/gulp-repl/commit/572df8ce7cd9d4edd3a2190de021381671a295f0
[v1.1.1]: https://github.com/stringparser/gulp-repl/commit/6f4655ca1a667ca04d2a668a175055f9b4437d65
[v1.1.0]: https://github.com/stringparser/gulp-repl/commit/71a2301233a92d68dbfd7e7a1493a38be72d0a0e
