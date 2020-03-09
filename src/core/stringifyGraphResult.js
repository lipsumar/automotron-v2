function stringifyGraphResult(result) {
  // eslint-disable-next-line no-unused-vars
  const [startNode, firstEdge, ...elements] = result.elements;
  return elements.map(el => el.result).join('');
}

export default stringifyGraphResult;
