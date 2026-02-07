import api from '../src';
import type { GulpLike } from '../src/lib';

describe('get', () => {
  it('should return null if the instance is not set', () => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();
    expect(api.get(gulp)).toBeNull();
  });

  it('should return an object with the instance set', () => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();

    const inst = api.add(gulp).get(gulp) as { gulp: GulpLike };
    expect(inst.gulp).toBe(gulp);
  });

  it('should return all instances when called with no arguments', () => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp1 = new Gulp();
    const gulp2 = new Gulp();

    api.add(gulp1).add(gulp2);

    const all = api.get() as Array<{ gulp: GulpLike }>;
    const gulps = all.map((stored) => stored.gulp);
    expect(gulps).toEqual(expect.arrayContaining([gulp1, gulp2]));
  });
});
