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
    ui.refreshNode(ui.getNode(from.node.id));

    this.edge = edge;
  }

  undo() {
    const { graph, ui } = this;

    const edge = graph.createEdge(
      graph.getNode(this.edge.from.node.id).getConnector(this.edge.from.key),
      graph.getNode(this.edge.to.node.id).getConnector(this.edge.to.key),
      this.edge.id,
    );
    ui.createEdge(edge);
    ui.refreshNode(ui.getNode(this.edge.from.node.id));
  }
}

export default RemoveEdgeCommand;
