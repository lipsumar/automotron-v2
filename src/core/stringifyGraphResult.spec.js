import stringifyGraphResult from './stringifyGraphResult';

describe('stringifyGraphResult()', () => {
  it('removes first 2 elements and concats the rest', () => {
    const result = [
      { result: { text: 'nope' } },
      { result: ' ' },
      { result: { text: 'hello' } },
      { result: { text: ' ' } },
      { result: { text: 'world' } },
    ];
    expect(stringifyGraphResult(result)).toBe('hello world');
  });

  it('flattens generators', () => {
    const result = [
      { result: { text: 'nope' } },
      { result: ' ' },
      { result: { text: 'hello' } },
      { result: ' ' },
      {
        result: [
          {
            result: { text: 'doh' },
          },
          { result: ' ' },
          {
            result: { text: 'kay' },
          },
        ],
      },
    ];
    expect(stringifyGraphResult(result)).toBe('hello doh kay');
  });

  it('supports empty text', () => {
    const result = [
      { result: { text: 'nope' } },
      { result: ' ' },
      { result: { text: '' } },
      { result: { text: ' ' } },
      { result: { text: 'world' } },
    ];
    expect(stringifyGraphResult(result)).toBe(' world');
  });
});
