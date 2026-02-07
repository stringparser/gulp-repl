import api from '../src';
import type { GulpLike } from '../src/lib';

describe('remove', () => {
  it('should delete the instance from the instances store', () => {
    const Gulp = require('gulp').constructor as new () => GulpLike;
    const gulp = new Gulp();

    expect(api.get(gulp)).toBeNull();

    api.add(gulp);

    const inst = api.get(gulp) as { gulp: GulpLike };
    expect(inst.gulp).toBe(gulp);

    api.remove(gulp);

    expect(api.get(gulp)).toBeNull();
  });
});
