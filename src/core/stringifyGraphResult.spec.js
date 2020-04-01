import stringifyGraphResult from './stringifyGraphResult';

describe('stringifyGraphResult()', () => {
  it('removes first 2 elements and concats the rest', () => {
    const elements = [
      { result: 'nope' },
      { result: 'nope' },
      { result: 'hello' },
      { result: ' ' },
      { result: 'world' },
    ];
    expect(stringifyGraphResult({ elements })).toBe('hello world');
  });

  it('flattens generators', () => {
    const elements = [
      { result: 'nope' },
      { result: 'nope' },
      { result: 'hello' },
      { result: ' ' },
      {
        result: {
          result: 'doh',
        },
        fromGenerator: true,
      },
    ];
    expect(stringifyGraphResult({ elements })).toBe('hello doh');
  });
});
