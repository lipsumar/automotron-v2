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
  const all = [];
  values.forEach(value => {
    if (value.variants) {
      all.push(...value.variants);
    } else {
      all.push(value);
    }
  });

  if (!agreement) {
    return all;
  }

  return all.filter(value => {
    if (!value.agreement) return true;

    return agreementsMatch(value.agreement, agreement);
  });
}

export default filterAgreement;
