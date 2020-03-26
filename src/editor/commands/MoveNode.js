import Command from './Command';

class MoveNodeCommand extends Command {
  execute() {
    const { graph, ui } = this;
    const node = graph.getNode(this.options.nodeId);
    this.previousPos = {
      x: node.ui.x,
      y: node.ui.y,
    };

    node.patchUi({
      x: this.options.x,
      y: this.options.y,
    });
    ui.getNode(this.options.nodeId).refresh();
  }

  undo() {
    const { graph, ui } = this;
    const node = graph.getNode(this.options.nodeId);
    node.patchUi(this.previousPos);
    ui.getNode(this.options.nodeId).refresh();
  }
}

export default MoveNodeCommand;
