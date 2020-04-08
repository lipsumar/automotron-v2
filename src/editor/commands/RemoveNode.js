import Command from './Command';
import TextNode from '../../core/TextNode';

const createEdgeMethods = {
  default: 'createEdge',
  generator: 'createGeneratorEdge',
  agreement: 'createAgreementEdge',
};

class RemoveNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;

    this.removedNode = graph.getNode(options.nodeId);
    this.removedEdges = graph.removeNode(this.removedNode);
    ui.removeNode(options.nodeId);
  }

  undo() {
    const { graph, ui } = this;

    const node = new TextNode(this.removedNode.value, {
      title: this.removedNode.title,
    });
    node.setUi(this.removedNode.ui);
    graph.addNode(node, this.removedNode.id);
    ui.createNode(node);

    this.removedEdges.forEach(edge => {
      const createdEdge = graph[createEdgeMethods[edge.type]](
        edge.from,
        edge.to,
        edge.id,
      );
      ui.createEdge(createdEdge);
      ui.refreshNode(ui.getNode(edge.from.id));
    });
  }
}

export default RemoveNodeCommand;
