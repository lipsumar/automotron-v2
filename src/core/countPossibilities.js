class PossibilityExplorer {
  constructor(graph) {
    this.graph = graph;
  }

  count() {
    this.evaluated = {};
    const total = this.explore(this.graph.startNode);
    return total;
  }

  explore(node) {
    if (node.type === 'start') {
      return this.graph
        .getEdgesFrom(node, 'default')
        .reduce((acc, edge) => acc + this.explore(edge.to), 0);
    }
    let total = node.value.length;

    if (node.frozen && this.evaluated[node.id]) {
      return 1;
    }
    this.evaluated[node.id] = true;

    const nextEdges = this.graph.getEdgesFrom(node, 'default');
    if (nextEdges.length === 0) {
      return total;
    }

    const nexts = [];
    nextEdges.forEach(edge => {
      const nextNode = edge.to;
      const generator = this.graph.getGeneratorFrom(nextNode);
      if (generator) {
        total = this.explore(generator);
      }
      const totalNext = this.explore(nextNode);
      nexts.push(total * totalNext);
    });
    return nexts.reduce((acc, n) => acc + n, 0);
  }
}

export default function countPossibilities(graph) {
  const explorer = new PossibilityExplorer(graph);
  return explorer.count();
}
