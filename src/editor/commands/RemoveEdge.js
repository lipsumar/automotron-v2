import Command from './Command';

const methods = {
  default: 'createEdge',
  generator: 'createGeneratorEdge',
};

class RemoveEdgeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;

    const edge = graph.getEdge(options.edgeId);

    ui.removeEdge(edge);
    graph.removeEdge(edge);

    this.edge = edge;
  }

  undo() {
    const { graph, ui } = this;

    const edge = graph[methods[this.edge.type || 'default']](
      graph.getNode(this.edge.from.id),
      graph.getNode(this.edge.to.id),
      this.edge.id,
    );
    ui.createEdge(edge);
    ui.refreshNode(this.edge.from);
  }
}

export default RemoveEdgeCommand;
