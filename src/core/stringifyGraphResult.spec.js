import stringifyGraphResult from './stringifyGraphResult';

describe('stringifyGraphResult()', () => {
  it('removes first 2 elements and concats the rest', () => {
    const result = [
      { result: 'nope' },
      { result: 'nope' },
      { result: 'hello' },
      { result: ' ' },
      { result: 'world' },
    ];
    expect(stringifyGraphResult(result)).toBe('hello world');
  });

  it('flattens generators', () => {
    const result = [
      { result: 'nope' },
      { result: 'nope' },
      { result: 'hello' },
      { result: ' ' },
      {
        result: [
          {
            result: 'doh',
          },
          { result: ' ' },
          {
            result: 'kay',
          },
        ],
        fromGenerator: true,
      },
    ];
    expect(stringifyGraphResult(result)).toBe('hello doh kay');
  });
});
