const nomenclatures = {
  terms: {
    gender: { boolean: false },
    number: { boolean: false },
    color: { boolean: false },
  },
  default: [
    { name: 'gender', boolean: false },
    { name: 'number', boolean: false },
  ],
};

function parseRawText(raw) {
  const m = /(.*)\(([a-zA-Z*,= :]+)\)$/.exec(raw);
  if (!m) {
    return { text: raw };
  }

  const agreementText = m[2];
  let nomenclatureName = 'default';
  let termsStr = agreementText;
  if (agreementText.includes(':')) {
    [nomenclatureName, termsStr] = agreementText.split(':');
  }
  const terms = termsStr.split(',').map(s => s.trim());

  // ordered terms
  const agreement = nomenclatures[nomenclatureName].reduce((acc, term, i) => {
    acc[term.name] = terms.shift();
    return acc;
  }, {});

  // unordered terms
  if (terms.length > 0) {
    terms.forEach(t => {
      const [termName, termValue] = t.split('=');
      agreement[termName] = termValue;
    });
  }

  return { text: m[1].trim(), agreement };
}

export default parseRawText;
