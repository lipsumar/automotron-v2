export default function findBoundaries(graph) {
  const mostLeft = graph.nodes.map(node => node.ui.x).sort((a, b) => a - b)[0];
  const mostRight = graph.nodes
    .map(node => node.ui.x + node.ui.width)
    .sort((a, b) => a - b)
    .reverse()[0];
  const mostTop = graph.nodes.map(node => node.ui.y).sort((a, b) => a - b)[0];
  const mostBottom = graph.nodes
    .map(node => node.ui.y + node.ui.height)
    .sort((a, b) => a - b)
    .reverse()[0];
  return { mostLeft, mostTop, mostRight, mostBottom };
}
