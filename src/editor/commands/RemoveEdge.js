import Command from './Command';

const methods = {
  default: 'createEdge',
  generator: 'createGeneratorEdge',
  agreement: 'createAgreementEdge',
};

class RemoveEdgeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;

    const edge = graph.getEdge(options.edgeId);
    const { from } = edge;

    ui.removeEdge(edge);
    graph.removeEdge(edge);
    ui.refreshNode(ui.getNode(from.id));

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
    ui.refreshNode(ui.getNode(this.edge.from.id));
  }
}

export default RemoveEdgeCommand;
