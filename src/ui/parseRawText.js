export const hardCodedSyntax = {
  _terms: {
    gender: { variants: ['m', 'f'] },
    number: { variants: ['s', 'p'] },
    person: { variants: ['1', '2', '3'] },
  },
  default: ['gender', 'number'],
  inversed: ['number', 'gender'],
  conjugaison: ['person', 'number'],
};

function parseRawText(raw, syntax = hardCodedSyntax) {
  raw = raw.trim();
  const m = /(.*)\(([a-zA-Z0-9*,= :]+)\)$/.exec(raw);

  const text = m ? m[1].trim() : raw;
  let agreement = null;

  const agreementText = m ? m[2] : null;
  let isUsingPositionalArgument = false;
  if (agreementText) {
    // select syntax
    let syntaxName = 'default';
    let termsStr = agreementText;
    if (agreementText.includes(':')) {
      [syntaxName, termsStr] = agreementText.split(':');
    }
    const terms = termsStr.split(',').map(s => s.trim());
    isUsingPositionalArgument = !!terms.find(t => !t.includes('='));

    // positional arguments
    if (isUsingPositionalArgument) {
      agreement = syntax[syntaxName].reduce((acc, termName, i) => {
        acc[termName] = terms.shift();
        return acc;
      }, {});
    } else {
      agreement = {};
    }

    // keyword arguments
    if (terms.length > 0) {
      terms.forEach(t => {
        const [termName, termValue] = t.split('=');
        agreement[termName] = termValue;
      });
    }
  }

  // positional syntax
  const pm = /^\[(.*)\]$/.exec(text);
  if (pm) {
    if (isUsingPositionalArgument) {
      throw new Error('positional syntax mixed with positional argument');
    }
    if (!agreement) {
      agreement = {};
    }
    let texts = pm[1];
    const variants = [];
    let syntaxName = 'default';
    if (texts.includes(':')) {
      [syntaxName, texts] = texts.split(':');
    }
    texts = texts.split(',').map(t => t.trim());
    const syntaxTerms = syntax[syntaxName];

    let firstTerm = syntaxTerms[0];
    let secondTerm = syntaxTerms[1];
    if (agreement[firstTerm]) {
      firstTerm = syntaxTerms[1];
      secondTerm = syntaxTerms[0];
    }
    const termVariants = syntax._terms[firstTerm].variants;
    const secondTermVariants = syntax._terms[secondTerm].variants;
    texts.forEach((text_, i) => {
      variants.push({
        text: text_,
        agreement: {
          ...agreement,
          [firstTerm]: termVariants[i % termVariants.length],
          [secondTerm]:
            agreement[secondTerm] ||
            secondTermVariants[Math.floor(i / termVariants.length)],
        },
      });
    });

    return { variants, text: `${texts[0]} [${texts.length}]` };
  }

  return { text, agreement };
}

export default parseRawText;
