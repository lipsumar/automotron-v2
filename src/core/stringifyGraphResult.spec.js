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
});
