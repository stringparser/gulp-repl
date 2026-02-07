# gulp-repl [![NPM version][b-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[![CI][b-build]][x-actions]

Simple REPL for gulp.

### usage

```ts
// gulpfile.ts
import gulp from 'gulp';
import repl from 'gulp-repl';

gulp.task('repl-start', (cb) => {
  gulp.repl = repl.start(gulp);
  cb();
});

gulp.task('repl-stop', (cb) => {
  if (gulp.repl) {
    gulp.repl.close(); // same as nodejs.org/api/readline.html#readline_rl_close
  }
  cb();
});

gulp.task('foo', (cb) => {
  // do foo stuff
  cb();
});

gulp.task('bar', (cb) => {
  // do bar stuff
  cb();
});

gulp.task('default', gulp.series('foo', 'bar'));
```

> **Note:** For `gulpfile.ts`, ensure `ts-node` or `tsx` is available. Use `gulpfile.js` with `require()` if you prefer plain JavaScript.

Then, on your terminal write:

```
gulp repl-start
```

and you'll have a REPL with:

1. Press <kbd>Enter</kbd> to see the prompt
2. Write the tasks you want to run
3. Press <kbd>Tab</kbd> for completion

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

The module exports an object with the following methods:

```ts
import repl from 'gulp-repl';
```

#### repl.add

```ts
add(gulp: Gulp): typeof repl
```

Adds the `gulp` instance tasks for the REPL and _returns_ the module again.

#### repl.remove

```ts
remove(gulp: Gulp): typeof repl
```

Removes the `gulp` instance tasks from the REPL and _returns_ the module again.

#### repl.reset

```ts
reset(): typeof repl
```

Removes all of the previously added instances and _returns_ the module again.

#### repl.get

```ts
get(gulp?: Gulp): ReplInstance[] | ReplInstance | null
```

Takes a `gulp` instance as argument.

_returns_
- `null` if the `gulp` instance wasn't stored yet
- all of the stored instances if no arguments are given
- metadata stored for the given `gulp` instance if was already stored

#### repl.start

```ts
start(gulp?: Gulp): readline.Interface
```

Takes a `gulp` instance as argument.

Adds the `gulp` instance tasks for the REPL.

Starts a REPL listening on `stdin` and writing on `stdout`. Each of the commands typed to the REPL are looked up in each of the instances given on `add`.

_returns_ a `readline.Interface` instance.

[See node's core module `readline` documentation about the `readline.Interface`](https://nodejs.org/api/readline.html).

### install

```
$ npm install --save-dev gulp-repl
```

### requirements

- Node.js >= 14.0.0

### Changelog

[v3.0.0][v3.0.0]:
- Modernize codebase: TypeScript, Jest, ESLint
- Add GitHub Actions CI (Node 20, 22, 24)
- Pin package versions
- Breaking: Output is now in `dist/`, requires build step before publish

[v2.0.1][v2.0.1]:
- test: small fix to use `repl.start` instead of the `module.exports`
- docs: remove docs of exporting a function
- docs: small fix on the docs
- version bump

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

Copyright (c) 2015-present Javier Carrillo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<!-- links -->
[x-npm]: https://npmjs.com/gulp-repl
[x-actions]: https://github.com/stringparser/gulp-repl/actions

[b-build]: https://github.com/stringparser/gulp-repl/actions/workflows/ci.yml/badge.svg
[b-version]: http://img.shields.io/npm/v/gulp-repl.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/gulp-repl.svg?style=flat-square

[v3.0.0]: https://github.com/stringparser/gulp-repl/releases/tag/v3.0.0
[v2.0.1]: https://github.com/stringparser/gulp-repl/commit/4420f55db8f9a4887e5a8bd82976a8930e12fb50
[v2.0.0]: https://github.com/stringparser/gulp-repl/commit/be44875927a42d8f08dcafa7984db0bfc423e0a3
[v1.1.2]: https://github.com/stringparser/gulp-repl/commit/572df8ce7cd9d4edd3a2190de021381671a295f0
[v1.1.1]: https://github.com/stringparser/gulp-repl/commit/6f4655ca1a667ca04d2a668a175055f9b4437d65
[v1.1.0]: https://github.com/stringparser/gulp-repl/commit/71a2301233a92d68dbfd7e7a1493a38be72d0a0e
