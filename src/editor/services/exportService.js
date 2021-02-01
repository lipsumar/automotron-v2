export default {
  exportGenerator(generator) {
    return {
      ...generator,
      graph: this.exportGraph(generator.graph),
    };
  },

  exportGraph(graph) {
    console.log('exportGraph is deprecated, use graph.toJSON() instead');
    return graph.toJSON();
  },
};
