import Command from './Command';
import TextNode from '../../core/TextNode';
import LoopNode from '../../core/LoopNode';
import NumberGeneratorNode from '../../core/NumberGeneratorNode';
import ParagraphNode from '../../core/ParagraphNode';

const NodeByType = {
  text: TextNode,
  loop: LoopNode,
  number: NumberGeneratorNode,
  paragraph: ParagraphNode,
};

class CreateNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    const node = new NodeByType[options.type]([{ text: options.text }]);
    node.ui = { ...options.ui };
    graph.addNode(node, this.previousId);
    this.previousId = node.id;
    const uiNode = ui.createNode(node);
    // re-patch ui after uiNode is snapped to grid
    node.patchUi({
      x: uiNode.group.x(),
      y: uiNode.group.y(),
    });

    if (options.from) {
      const edge = graph.createEdge(
        graph.getNode(options.from.nodeId).getConnector(options.from.key),
        node.flowInlet,
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
