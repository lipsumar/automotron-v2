import Command from './Command';
import TextNode from '../../core/TextNode';

class CreateNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    const node = new TextNode(options.value);
    node.ui = { ...options.ui };
    graph.addNode(node, this.previousId);
    this.previousId = node.id;
    ui.createNode(node);

    if (options.fromNodeId) {
      const edge = graph.createEdge(graph.getNode(options.fromNodeId), node);
      ui.createEdge(edge);
    }

    this.node = node;
  }

  undo() {
    const { graph, ui } = this;
    graph.removeNode(this.node);
    ui.removeNode(this.node.id);
  }
}

export default CreateNodeCommand;
