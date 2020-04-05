import Command from './Command';

class MoveNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    const nodes = graph.getNodes(this.options.nodeIds);

    nodes.forEach(node => {
      node.patchUi({
        x: node.ui.x + options.delta.x,
        y: node.ui.y + options.delta.y,
      });
      ui.getNode(node.id).refresh();
    });
    this.nodes = nodes;
  }

  undo() {
    const { ui, options } = this;
    this.nodes.forEach(node => {
      node.patchUi({
        x: node.ui.x - options.delta.x,
        y: node.ui.y - options.delta.y,
      });
      ui.getNode(node.id).refresh();
    });
  }
}

export default MoveNodeCommand;
