import Command from './Command';

class MoveNodeCommand extends Command {
  execute() {
    const { graph } = this;
    const node = graph.getNode(this.options.nodeId);
    node.ui.x = this.options.x;
    node.ui.y = this.options.y;
  }
}

export default MoveNodeCommand;
