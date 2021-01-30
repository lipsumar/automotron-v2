import Command from './Command';
import TextNode from '../../core/TextNode';
import LoopNode from '../../core/LoopNode';

class CreateNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    let node;
    if (options.type === 'text') {
      node = new TextNode([{ text: options.text }]);
    } else if (options.type === 'loop') {
      node = new LoopNode();
    }
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
      const edge = graph.createEdge(
        {
          node: graph.getNode(options.fromNodeId),
          outlet: options.fromOutlet || 'default',
        },
        node,
      );
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
