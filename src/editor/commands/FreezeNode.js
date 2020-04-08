import Command from './Command';

class FreezeNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    this.frozenBefore = graph.getNode(options.nodeId).frozen;
    graph.getNode(options.nodeId).frozen = true;
    ui.getNode(options.nodeId).refresh();
  }

  undo() {
    const { graph, ui, options } = this;
    graph.getNode(options.nodeId).frozen = this.frozenBefore;
    ui.getNode(options.nodeId).refresh();
  }
}

export default FreezeNodeCommand;
