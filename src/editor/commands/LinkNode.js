import Command from './Command';

class LinkNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;

    graph.createEdge(
      graph.getNode(options.fromNodeId),
      graph.getNode(options.toNodeId),
    );
    options.uiEdge.setTo(ui.getNode(options.toNodeId));
  }
}

export default LinkNodeCommand;
