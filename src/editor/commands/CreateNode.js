import Command from './Command';
import TextNode from '../../core/TextNode';

class CreateNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    const node = new TextNode([{ text: options.text }]);
    node.ui = { ...options.ui };
    graph.addNode(node, this.previousId);
    this.previousId = node.id;
    const uiNode = ui.createNode(node);
    // re-patch ui after uiNode is snapped to grid
    node.patchUi({
      x: uiNode.group.x(),
      y: uiNode.group.y(),
    });

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
