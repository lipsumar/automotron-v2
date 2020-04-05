import Command from './Command';

class SetNodeTitleCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    const node = graph.getNode(options.nodeId);
    this.previousTitle = node.title;
    node.title = options.title;

    ui.getNode(options.nodeId).refresh();
    const nodesGeneratedByNode = graph.getNodesGeneratedBy(node);
    this.prevGeneratedBy = [];
    if (nodesGeneratedByNode.length > 0) {
      this.prevGeneratedBy = nodesGeneratedByNode;
      nodesGeneratedByNode.forEach(n => {
        ui.refreshNode(ui.getNode(n.id));
      });
    }
  }

  undo() {
    const { graph, ui, options } = this;
    const node = graph.getNode(options.nodeId);
    node.title = this.previousTitle;
    ui.getNode(options.nodeId).refresh();
    if (this.prevGeneratedBy.length > 0) {
      this.prevGeneratedBy.forEach(n => {
        ui.refreshNode(ui.getNode(n.id));
      });
    }
  }
}

export default SetNodeTitleCommand;
