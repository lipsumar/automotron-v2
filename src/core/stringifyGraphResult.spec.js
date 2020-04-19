import stringifyGraphResult from './stringifyGraphResult';

describe('stringifyGraphResult()', () => {
  it('removes first 2 elements and concats the rest', () => {
    const result = {
      results: [
        { result: { text: 'nope' } },
        { result: ' ' },
        { result: { text: 'hello' } },
        { result: ' ' },
        { result: { text: 'world' } },
      ],
    };
    expect(stringifyGraphResult(result)).toBe('hello world');
  });

  it('flattens generators', () => {
    const result = {
      results: [
        { result: { text: 'nope' } },
        { result: ' ' },
        { result: { text: 'hello' } },
        { result: ' ' },
        {
          result: {
            results: [
              {
                result: { text: 'doh' },
              },
              { result: ' ' },
              {
                result: { text: 'kay' },
              },
            ],
          },
        },
      ],
    };
    expect(stringifyGraphResult(result)).toBe('hello doh kay');
  });

  it('supports empty text', () => {
    const result = {
      results: [
        { result: { text: 'nope' } },
        { result: ' ' },
        { result: { text: '' } },
        { result: { text: ' ' } },
        { result: { text: 'world' } },
      ],
    };
    expect(stringifyGraphResult(result)).toBe(' world');
  });

  it('transforms \\n in new line', () => {
    const result = {
      results: [
        { result: { text: 'nope' } },
        { result: ' ' },
        { result: { text: 'hey' } },
        { result: ' ' },
        { result: { text: '\\n' } },
        { result: ' ' },
        { result: { text: 'new\\nline' } },
        { result: ' ' },
        { result: { text: 'hello' } },
      ],
    };
    const text = stringifyGraphResult(result);
    expect(text).toBe('hey \n new\nline hello');
  });
});
