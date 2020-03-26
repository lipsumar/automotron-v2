import Command from './Command';

class LinkNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;

    const edge = graph.createEdge(
      graph.getNode(options.fromNodeId),
      graph.getNode(options.toNodeId),
      this.previousId,
    );
    this.previousId = edge.id;
    ui.createEdge(edge);
    this.edge = edge;
  }

  undo() {
    const { graph, ui } = this;
    ui.removeEdge(this.edge);
    graph.removeEdge(this.edge);
  }
}

export default LinkNodeCommand;
