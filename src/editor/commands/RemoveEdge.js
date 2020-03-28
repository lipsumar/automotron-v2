import Command from './Command';

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

    const edge = graph.createEdge(
      graph.getNode(this.edge.from.id),
      graph.getNode(this.edge.to.id),
      this.edge.id,
    );
    ui.createEdge(edge);
  }
}

export default RemoveEdgeCommand;
