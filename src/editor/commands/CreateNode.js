import Command from './Command';
import TextNode from '../../core/TextNode';

class CreateNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;
    const node = new TextNode(options.value);
    node.ui = { ...options.ui };
    graph.addNode(node);
    ui.createNode(node);

    if (options.fromUiEdge) {
      const edge = options.fromUiEdge;
      graph.createEdge(edge.from.node, node);
      edge.setTo(ui.getNode(node.id));
    }

    this.node = node;
  }
}

export default CreateNodeCommand;
