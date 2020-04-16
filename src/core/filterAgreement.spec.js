import filterAgreement from './filterAgreement';

describe('filterAgreement', () => {
  it('returns all values if no agreement', () => {
    const values = [
      { text: 'yo' },
      { text: 'beyonce', agreement: { gender: 'f' } },
    ];
    expect(filterAgreement(values, null)).toEqual(values);
    expect(filterAgreement(values, [])).toEqual(values);
  });

  it('always return values without agreement', () => {
    const values = [
      { text: 'yo' },
      { text: 'beyonce', agreement: { gender: 'f' } },
    ];
    expect(filterAgreement(values, { gender: 'x' })).toEqual([{ text: 'yo' }]);
  });

  it('returns values with only 1 matching term', () => {
    const values = [
      { text: 'she', agreement: { gender: 'f' } },
      { text: 'he', agreement: { gender: 'm' } },
    ];
    expect(filterAgreement(values, { gender: 'f' })).toEqual([
      { text: 'she', agreement: { gender: 'f' } },
    ]);
    expect(filterAgreement(values, { gender: 'm' })).toEqual([
      { text: 'he', agreement: { gender: 'm' } },
    ]);
    expect(filterAgreement(values, { gender: '*' })).toEqual([
      { text: 'she', agreement: { gender: 'f' } },
      { text: 'he', agreement: { gender: 'm' } },
    ]);
  });

  it('returns values with at least 1 matching term', () => {
    const values = [
      { text: 'she', agreement: { gender: 'f', funny: 'very' } },
      { text: 'he', agreement: { gender: 'm' } },
    ];
    expect(filterAgreement(values, { gender: 'f' })).toEqual([
      { text: 'she', agreement: { gender: 'f', funny: 'very' } },
    ]);
    expect(filterAgreement(values, { gender: 'm' })).toEqual([
      { text: 'he', agreement: { gender: 'm' } },
    ]);
    expect(filterAgreement(values, { gender: '*' })).toEqual([
      { text: 'she', agreement: { gender: 'f', funny: 'very' } },
      { text: 'he', agreement: { gender: 'm' } },
    ]);
  });

  describe('multiple terms', () => {
    const values = [
      { text: 'funny guy', agreement: { gender: 'm', funny: true } },
      { text: 'funny guy 2', agreement: { gender: 'm', funny: true } },
      { text: 'sad guy', agreement: { gender: 'm', funny: false } },
      { text: 'sad gal', agreement: { gender: 'f', funny: false } },
      { text: 'funny gal', agreement: { gender: 'f', funny: true } },
    ];

    it('returns all gals when {gender: f}', () => {
      expect(filterAgreement(values, { gender: 'f' })).toEqual([
        { text: 'sad gal', agreement: { gender: 'f', funny: false } },
        { text: 'funny gal', agreement: { gender: 'f', funny: true } },
      ]);
    });
    it('returns all guys when {gender: m}', () => {
      expect(filterAgreement(values, { gender: 'm' })).toEqual([
        { text: 'funny guy', agreement: { gender: 'm', funny: true } },
        { text: 'funny guy 2', agreement: { gender: 'm', funny: true } },
        { text: 'sad guy', agreement: { gender: 'm', funny: false } },
      ]);
    });
    it('returns only funny guys when {gender: m, funny: true}', () => {
      expect(filterAgreement(values, { gender: 'm', funny: true })).toEqual([
        { text: 'funny guy', agreement: { gender: 'm', funny: true } },
        { text: 'funny guy 2', agreement: { gender: 'm', funny: true } },
      ]);
    });
    it('returns only non funny gals when {gender: f, funny: false}', () => {
      expect(filterAgreement(values, { gender: 'f', funny: false })).toEqual([
        { text: 'sad gal', agreement: { gender: 'f', funny: false } },
      ]);
    });
    it('returns only funny peeps when {funny: true}', () => {
      expect(filterAgreement(values, { funny: true })).toEqual([
        { text: 'funny guy', agreement: { gender: 'm', funny: true } },
        { text: 'funny guy 2', agreement: { gender: 'm', funny: true } },
        { text: 'funny gal', agreement: { gender: 'f', funny: true } },
      ]);
    });

    it('returns all guys when {gender: m, funny: *}', () => {
      expect(filterAgreement(values, { gender: 'm', funny: '*' })).toEqual([
        { text: 'funny guy', agreement: { gender: 'm', funny: true } },
        { text: 'funny guy 2', agreement: { gender: 'm', funny: true } },
        { text: 'sad guy', agreement: { gender: 'm', funny: false } },
      ]);
    });
    it('returns all gals when {gender: f, funny: *}', () => {
      expect(filterAgreement(values, { gender: 'f', funny: '*' })).toEqual([
        { text: 'sad gal', agreement: { gender: 'f', funny: false } },
        { text: 'funny gal', agreement: { gender: 'f', funny: true } },
      ]);
    });
    it('returns only funny peeps when {funny: true, gender:*}', () => {
      expect(filterAgreement(values, { funny: true, gender: '*' })).toEqual([
        { text: 'funny guy', agreement: { gender: 'm', funny: true } },
        { text: 'funny guy 2', agreement: { gender: 'm', funny: true } },
        { text: 'funny gal', agreement: { gender: 'f', funny: true } },
      ]);
    });
  });

  describe('variants', () => {
    test('1 value w/ variants', () => {
      const values = [
        {
          variants: [
            { text: 'she', agreement: { gender: 'f' } },
            { text: 'he', agreement: { gender: 'm' } },
          ],
        },
      ];
      expect(filterAgreement(values, { gender: 'f' })).toEqual([
        { text: 'she', agreement: { gender: 'f' } },
      ]);
    });

    test('2 values w/ variants', () => {
      const values = [
        {
          variants: [
            { text: 'she', agreement: { gender: 'f' } },
            { text: 'he', agreement: { gender: 'm' } },
          ],
        },
        {
          variants: [
            { text: 'girl', agreement: { gender: 'f' } },
            { text: 'boy', agreement: { gender: 'm' } },
          ],
        },
      ];
      expect(filterAgreement(values, { gender: 'f' })).toEqual([
        { text: 'she', agreement: { gender: 'f' } },
        { text: 'girl', agreement: { gender: 'f' } },
      ]);
    });

    test('mixed', () => {
      const values = [
        {
          variants: [
            { text: 'she', agreement: { gender: 'f' } },
            { text: 'he', agreement: { gender: 'm' } },
          ],
        },
        { text: 'girl', agreement: { gender: 'f' } },
        { text: 'boy', agreement: { gender: 'm' } },
      ];
      expect(filterAgreement(values, { gender: 'f' })).toEqual([
        { text: 'she', agreement: { gender: 'f' } },
        { text: 'girl', agreement: { gender: 'f' } },
      ]);
    });

    test('no agreement', () => {
      const values = [
        {
          variants: [
            { text: 'she', agreement: { gender: 'f' } },
            { text: 'he', agreement: { gender: 'm' } },
          ],
        },
      ];
      expect(filterAgreement(values, null)).toEqual([
        { text: 'she', agreement: { gender: 'f' } },
        { text: 'he', agreement: { gender: 'm' } },
      ]);
    });
  });
});
