function stringifyElement(element) {
  if (typeof element.result === 'string') {
    return element.result;
  }

  if (element.fromGenerator) {
    return element.result.result;
  }

  throw new Error('stringifyElement error');
}

function stringifyGraphResult(result) {
  // eslint-disable-next-line no-unused-vars
  const [startNode, firstEdge, ...elements] = result.elements;

  return elements.map(el => stringifyElement(el)).join('');
}

export default stringifyGraphResult;
