export default {
  exportGenerator(generator) {
    return {
      ...generator,
      graph: this.exportGraph(generator.graph),
    };
  },

  exportGraph(graph) {
    return {
      nodes: graph.nodes,
      edges: graph.edges.map(edge => {
        return {
          from: { id: edge.from.id },
          to: { id: edge.to.id },
          type: edge.type,
          space: edge.space,
        };
      }),
    };
  },
};
