import combineAgreements from './combineAgreements';

describe('combineAgreements', () => {
  it('returns one if the other is null', () => {
    expect(combineAgreements({ foo: true }, null)).toEqual({ foo: true });
    expect(combineAgreements(null, { foo: false })).toEqual({ foo: false });
  });

  it('returns null if both null', () => {
    expect(combineAgreements(null, null)).toEqual(null);
  });

  it('merges terms', () => {
    expect(combineAgreements({ foo: true, bar: 'a' }, { foo: true })).toEqual({
      foo: true,
      bar: 'a',
    });
  });
});
