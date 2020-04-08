import Command from './Command';

const methods = {
  default: 'createEdge',
  generator: 'createGeneratorEdge',
  agreement: 'createAgreementEdge',
};

class LinkNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;

    const edge = graph[methods[options.type || 'default']](
      graph.getNode(options.fromNodeId),
      graph.getNode(options.toNodeId),
      this.previousId,
    );
    this.previousId = edge.id;
    ui.createEdge(edge);
    this.edge = edge;
    ui.refreshNode(ui.getNode(options.fromNodeId));
  }

  undo() {
    const { graph, ui, options } = this;
    ui.removeEdge(this.edge);
    graph.removeEdge(this.edge);
    ui.refreshNode(ui.getNode(options.fromNodeId));
  }
}

export default LinkNodeCommand;
