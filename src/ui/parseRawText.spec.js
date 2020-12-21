import parseRawText, { hardCodedSyntax as syntax } from './parseRawText';

describe('parseRawText', () => {
  it('returns text without agreement', () => {
    expect(parseRawText('hey', syntax)).toEqual({
      text: 'hey',
      agreement: null,
    });
  });

  it('returns text with positional agreement terms', () => {
    expect(parseRawText('le(m,s)', syntax)).toEqual({
      text: 'le',
      agreement: { gender: 'm', number: 's' },
    });
    expect(parseRawText('foo(*,s)', syntax)).toEqual({
      text: 'foo',
      agreement: { gender: '*', number: 's' },
    });
  });

  it('supports positional and keyword agreement terms', () => {
    expect(parseRawText('foo(*,s,color=blue)', syntax)).toEqual({
      text: 'foo',
      agreement: { gender: '*', number: 's', color: 'blue' },
    });
  });

  it('supports partial positional and keyword agreement terms', () => {
    expect(parseRawText('foo(m,color=blue)', syntax)).toEqual({
      text: 'foo',
      agreement: { gender: 'm', color: 'blue' },
    });
  });

  it('supports only keyword agreement terms', () => {
    expect(parseRawText('foo(color=blue)', syntax)).toEqual({
      text: 'foo',
      agreement: { color: 'blue' },
    });
  });

  it('supports keyword agreement with accent', () => {
    expect(parseRawText('foo(rime=é)', syntax)).toEqual({
      text: 'foo',
      agreement: { rime: 'é' },
    });
  });

  it('supports only keyword agreement with numbers', () => {
    expect(parseRawText('foo(cool=1)', syntax)).toEqual({
      text: 'foo',
      agreement: { cool: '1' },
    });
  });

  it('supports specifying a syntax', () => {
    expect(parseRawText('foo(inversed:p,f)', syntax)).toEqual({
      text: 'foo',
      agreement: { gender: 'f', number: 'p' },
    });
  });

  describe('positional syntax', () => {
    it('supports positional syntax with one term', () => {
      expect(parseRawText('[un, une]', syntax)).toEqual({
        text: 'un [2]',
        variants: [
          { text: 'un', agreement: { gender: 'm', number: 's' } },
          { text: 'une', agreement: { gender: 'f', number: 's' } },
        ],
      });
    });

    it('allows white spaces at beginning and end', () => {
      expect(parseRawText(' [un, une] ', syntax)).toEqual({
        text: 'un [2]',
        variants: [
          { text: 'un', agreement: { gender: 'm', number: 's' } },
          { text: 'une', agreement: { gender: 'f', number: 's' } },
        ],
      });
    });

    it('supports specifying a syntax ', () => {
      expect(
        parseRawText('[conjugaison:suis,es,est,sommes,êtes,sont]', syntax),
      ).toEqual({
        text: 'suis [6]',
        variants: [
          { text: 'suis', agreement: { number: 's', person: '1' } },
          { text: 'es', agreement: { number: 's', person: '2' } },
          { text: 'est', agreement: { number: 's', person: '3' } },
          { text: 'sommes', agreement: { number: 'p', person: '1' } },
          { text: 'êtes', agreement: { number: 'p', person: '2' } },
          { text: 'sont', agreement: { number: 'p', person: '3' } },
        ],
      });
    });

    it('supports positional syntax with multiple term', () => {
      expect(parseRawText('[beau, belle, beaux, belles]', syntax)).toEqual({
        text: 'beau [4]',
        variants: [
          { text: 'beau', agreement: { gender: 'm', number: 's' } },
          { text: 'belle', agreement: { gender: 'f', number: 's' } },
          { text: 'beaux', agreement: { gender: 'm', number: 'p' } },
          { text: 'belles', agreement: { gender: 'f', number: 'p' } },
        ],
      });
    });

    it('throws when using positional arguments with positional syntax', () => {
      expect(() => {
        parseRawText('[beau, belle](m)', syntax);
      }).toThrow('positional syntax mixed with positional argument');
    });

    describe('positional syntax with forced term', () => {
      test('[beaux, belles](number=p)', () => {
        expect(parseRawText('[beaux, belles](number=p)', syntax)).toEqual({
          text: 'beaux [2]',
          variants: [
            { text: 'beaux', agreement: { gender: 'm', number: 'p' } },
            { text: 'belles', agreement: { gender: 'f', number: 'p' } },
          ],
        });
      });

      test('[beau, beaux](gender=m)', () => {
        expect(parseRawText('[beau, beaux](gender=m)', syntax)).toEqual({
          text: 'beau [2]',
          variants: [
            { text: 'beau', agreement: { gender: 'm', number: 's' } },
            { text: 'beaux', agreement: { gender: 'm', number: 'p' } },
          ],
        });
      });

      test('[conjugaison:sommes,êtes,sont](number=p)', () => {
        expect(
          parseRawText('[conjugaison:sommes,êtes,sont](number=p)', syntax),
        ).toEqual({
          text: 'sommes [3]',
          variants: [
            { text: 'sommes', agreement: { number: 'p', person: '1' } },
            { text: 'êtes', agreement: { number: 'p', person: '2' } },
            { text: 'sont', agreement: { number: 'p', person: '3' } },
          ],
        });
      });
    });

    it('applies any other keyword argument term to all variants', () => {
      expect(parseRawText('[beaux, belles](number=p,foo=bar)', syntax)).toEqual(
        {
          text: 'beaux [2]',
          variants: [
            {
              text: 'beaux',
              agreement: { gender: 'm', number: 'p', foo: 'bar' },
            },
            {
              text: 'belles',
              agreement: { gender: 'f', number: 'p', foo: 'bar' },
            },
          ],
        },
      );
    });
  });
});
