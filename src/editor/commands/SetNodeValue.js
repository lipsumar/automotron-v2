import Command from './Command';

class SetNodeValueCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    this.previousValue = graph.getNode(options.nodeId).value;
    graph.getNode(options.nodeId).value = options.value;
    ui.getNode(options.nodeId).refresh();
  }

  undo() {
    const { graph, ui, options } = this;
    graph.getNode(options.nodeId).value = this.previousValue;
    ui.getNode(options.nodeId).refresh();
  }
}

export default SetNodeValueCommand;
