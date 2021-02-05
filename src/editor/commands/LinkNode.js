import Command from './Command';

class LinkNodeCommand extends Command {
  previousId = null;

  execute() {
    const { graph, ui, options } = this;
    const { from, to } = options;

    const fromNode = graph.getNode(from.nodeId);
    const toNode = graph.getNode(to.nodeId);
    const edge = graph.createEdge(
      fromNode.getConnector(from.key),
      toNode.getConnector(to.key),
      this.previousId,
    );
    this.previousId = edge.id;
    ui.createEdge(edge);
    this.edge = edge;
    ui.refreshNode(ui.getNode(fromNode.id));
    console.log(this.graph);
  }

  undo() {
    const { graph, ui, options } = this;
    ui.removeEdge(this.edge);
    graph.removeEdge(this.edge);
    ui.refreshNode(ui.getNode(options.from.nodeId));
  }
}

export default LinkNodeCommand;
