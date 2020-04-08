function stringifyElement(element) {
  if (typeof element.result === 'string') {
    return element.result;
  }

  if (typeof element.result.text === 'string') {
    return element.result.text;
  }

  if (element.result instanceof Array) {
    // eslint-disable-next-line no-use-before-define
    return stringifyElements(element.result);
  }

  console.error(element);
  throw new Error('stringifyElement error');
}

function stringifyElements(elements) {
  return elements.map(el => stringifyElement(el)).join('');
}

function stringifyGraphResult(result) {
  console.log(result);
  // eslint-disable-next-line no-unused-vars
  const [startNode, firstEdge, ...elements] = result;

  return stringifyElements(elements);
}

export default stringifyGraphResult;
