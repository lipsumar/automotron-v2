import Command from './Command';

class SetNodeOptionCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    const { nodeId, field, value } = options;
    const node = graph.getNode(nodeId);
    this.previousValue = node[field];
    node[field] = value;

    ui.getNode(nodeId).refresh();
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
    const { nodeId, field } = options;
    const node = graph.getNode(nodeId);
    node[field] = this.previousValue;
    ui.getNode(nodeId).refresh();
    if (this.prevGeneratedBy.length > 0) {
      this.prevGeneratedBy.forEach(n => {
        ui.refreshNode(ui.getNode(n.id));
      });
    }
  }
}

export default SetNodeOptionCommand;
