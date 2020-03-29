import Command from './Command';
import TextNode from '../../core/TextNode';

class InsertNodeCommand extends Command {
  execute() {
    const { graph, ui, options } = this;

    // create new node
    const node = new TextNode(options.value);
    node.ui = { ...options.ui };
    graph.addNode(node, this.previousId);
    this.previousId = node.id;
    ui.createNode(node);

    // replace current edge "to" to new node
    const edge = graph.getEdge(options.edgeId);
    const oldTo = graph.getNode(edge.to.id);
    this.oldFrom = edge.from;
    this.oldTo = oldTo;
    this.oldEdgeId = edge.id;
    edge.to = node;
    ui.getEdge(options.edgeId).setTo(ui.getNode(node.id));
    ui.getEdge(options.edgeId).position();

    // create new edge
    const newEdge = graph.createEdge(node, oldTo);
    ui.createEdge(newEdge);

    this.node = node;
  }

  undo() {
    const { graph, ui } = this;
    graph.removeNode(this.node);
    ui.removeNode(this.node.id);

    // re-create old edge
    const edge = graph.createEdge(this.oldFrom, this.oldTo, this.oldEdgeId);
    ui.createEdge(edge);
  }
}

export default InsertNodeCommand;
