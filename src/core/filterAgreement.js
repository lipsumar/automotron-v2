function agreementsMatch(a, b) {
  let smallest = a;
  let other = b;
  if (Object.keys(b).length < Object.keys(a).length) {
    smallest = b;
    other = a;
  }

  return Object.keys(smallest).every(termName => {
    const termValue = smallest[termName];
    if (termValue === '*') return true;
    const otherTermValue =
      typeof other[termName] === 'undefined' ? '*' : other[termName];
    if (otherTermValue === '*') return true;
    return termValue === otherTermValue;
  });
}

function filterAgreement(values, agreement) {
  if (!agreement || agreement.length === 0) {
    return values;
  }

  return values.filter(value => {
    if (!value.agreement) return true;
    return agreementsMatch(value.agreement, agreement);
  });
}

export default filterAgreement;
