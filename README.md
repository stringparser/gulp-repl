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

gulp.task('default', ['one', 'two']);
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

The module exports a readline instance.

[See node core module `readline` documentation](https://nodejs.org/api/readline.html) for more detail on its methods.

### install

```
$ npm install --save-dev gulp-repl
```

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
