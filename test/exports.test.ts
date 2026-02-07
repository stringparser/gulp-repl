import readline from 'readline';
import api from '../src';
import type { GulpLike } from '../src/lib';

describe('exports', () => {
  const repl = api.start();

  it('repl should be a readline Interface', () => {
    expect(repl.constructor).toBe(readline.Interface);
  });

  it('emit dispatches registered tasks', (done) => {
    const pile: string[] = [];
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();

    api.add(gulp);

    gulp.task!('one', (cb) => {
      pile.push('one');
      if (pile.length > 1) end();
      cb?.();
    });

    gulp.task!('two', (cb) => {
      pile.push('two');
      if (pile.length > 1) end();
      cb?.();
    });

    repl.emit('line', 'one two');

    function end() {
      expect(pile).toEqual(expect.arrayContaining(['one', 'two']));
      done();
    }
  });

  it('undefined tasks should not run', (done) => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();

    api.add(gulp);

    gulp.task!('one', () => {
      done(new Error('should not run failed'));
    });

    expect(gulp.tasks || gulp._registry?._tasks).toBeDefined();

    const prompt = repl.prompt.bind(repl);
    repl.prompt = function (this: typeof repl) {
      repl.prompt = prompt;
      prompt.apply(repl);
      done();
    };

    repl.emit('line', 'not found task');
  });

  it('should handle more than one instance', (done) => {
    const pile: string[] = [];
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp1 = new Gulp();
    const gulp2 = new Gulp();

    api.add(gulp1).add(gulp2);

    expect(gulp1).not.toBe(gulp2);

    const inst1 = api.get(gulp1) as { gulp: GulpLike };
    const inst2 = api.get(gulp2) as { gulp: GulpLike };
    expect(inst1.gulp).toBe(gulp1);
    expect(inst2.gulp).toBe(gulp2);

    gulp1.task!('three', (cb) => {
      pile.push('three');
      if (pile.length > 1) end();
      cb?.();
    });

    gulp2.task!('four', (cb) => {
      pile.push('four');
      if (pile.length > 1) end();
      cb?.();
    });

    repl.emit('line', 'three four');

    function end() {
      expect(pile).toEqual(expect.arrayContaining(['three', 'four']));
      done();
    }
  });

  it('should run found tasks independently of instances', (done) => {
    const pile: string[] = [];
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp1 = new Gulp();
    const gulp2 = new Gulp();

    api.reset();

    api.add(gulp1);
    api.add(gulp2);

    gulp1.task!('one', (cb) => {
      pile.push('one');
      if (pile.length > 1) end();
      cb?.();
    });

    gulp2.task!('two', (cb) => {
      pile.push('two');
      if (pile.length > 1) end();
      cb?.();
    });

    repl.emit('line', 'one two');

    function end() {
      expect(pile).toEqual(expect.arrayContaining(['one', 'two']));
      done();
    }
  });

  it('should prompt after not found tasks', (done) => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();

    api.add(gulp);

    const prompt = repl.prompt.bind(repl);
    repl.prompt = function (this: typeof repl) {
      repl.prompt = prompt;
      prompt.apply(repl);
      done();
    };

    repl.emit('line', 'not found task');
  });
});
