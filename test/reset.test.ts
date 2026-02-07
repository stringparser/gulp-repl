import api from '../src';

describe('reset', () => {
  it('should reset all instances set', () => {
    api.reset();
    const all = api.get() as unknown[];
    expect(all).toHaveLength(0);
  });
});
