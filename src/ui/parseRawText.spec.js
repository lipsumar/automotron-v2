import parseRawText from './parseRawText';

describe('parseRawText', () => {
  it('returns text without agreement', () => {
    expect(parseRawText('hey')).toEqual({ text: 'hey' });
  });

  it('returns text with ordered agreement terms', () => {
    expect(parseRawText('le(m,s)')).toEqual({
      text: 'le',
      agreement: { gender: 'm', number: 's' },
    });
    expect(parseRawText('foo(*,s)')).toEqual({
      text: 'foo',
      agreement: { gender: '*', number: 's' },
    });
  });

  it('supports unordered agreement terms', () => {
    expect(parseRawText('foo(*,s,color=blue)')).toEqual({
      text: 'foo',
      agreement: { gender: '*', number: 's', color: 'blue' },
    });
  });
});
