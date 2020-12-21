import Command from './Command';

class SetNodeValueCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    this.previousValue = graph.getNode(options.nodeId).value;
    graph.getNode(options.nodeId).value = options.value;
    ui.refreshNode(ui.getNode(options.nodeId));
  }

  undo() {
    const { graph, ui, options } = this;
    graph.getNode(options.nodeId).value = this.previousValue;
    ui.refreshNode(ui.getNode(options.nodeId));
  }
}

export default SetNodeValueCommand;
