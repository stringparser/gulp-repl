## gulp-repl [![build][b-build]][x-travis][![NPM version][b-version]][gulp-repl]

### usage

```js
var gulp = require('gulp-repl');

gulp.task('foo', function (cb) {
	// do foo stuff
	cb();
});

gulp.task('bar', function (cb) {
	// do bar stuff
	cb();
});
```

then, on your terminal you'll have a repl. Press

1. <kbd>Enter</kbd> to see the prompt
1. write the tasks you want to run
1. or <kbd>Tab</kbd> to see completion

```
$ gulp
$ # some task logging here
$ (press Enter)
$ > foo bar
[10:39:11] Starting 'foo'...
[10:39:11] Finished 'foo' after 13 μs
[10:39:11] Starting 'bar'...
[10:39:11] Finished 'bar' after 5.52 μs
```

### API

#### gulp.repl

The module adds a `gulp.repl` property to the `gulp` instance. This
property is a readline instance. [See node core `realine` module  documentation][readline] for more detail on its methods.

### install

```
$ npm install --save-dev gulp-repl
```

### license

The MIT License (MIT)

Copyright (c) 2015 Javier Carrillo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<!-- links -->

[x-travis]: https://travis-ci.org/stringparser/gulp-repl/builds
[b-build]: https://travis-ci.org/stringparser/gulp-repl.svg?branch=master
[b-version]: http://img.shields.io/npm/v/gulp-repl.svg?style=flat-square

[gulp-repl]: https://npmjs.com/gulp-repl
[kramed-issues]: https://github.com/GitbookIO/kramed/issues
