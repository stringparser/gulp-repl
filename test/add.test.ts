import api from '../src';
import type { GulpLike } from '../src/lib';

describe('add', () => {
  it('should return the module', () => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();

    expect(api.add(gulp)).toBe(api);
  });

  it('should add to the instances store', () => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();

    expect(api.get(gulp)).toBeNull();

    api.add(gulp);

    const all = api.get() as Array<{ gulp: GulpLike }>;
    expect(all.filter((instance) => instance.gulp === gulp)).toHaveLength(1);
  });

  it('should not add an instance more than once', () => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();

    api.reset();

    '1234567890'.split('').forEach(() => {
      api.add(gulp);
      const all = api.get() as unknown[];
      expect(all).toHaveLength(1);
    });
  });
});
