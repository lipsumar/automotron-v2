import StartNode from './StartNode';
import Edge from './Edge';

class Graph {
  nodes = [];

  edges = [];

  startNode = null;

  nextNodeId = 1;

  constructor() {
    this.startNode = this.addNode(new StartNode());
  }

  addNode(node) {
    node.setId(this.getNextNodeId());
    this.nodes.push(node);
    return node;
  }

  getNode(id) {
    return this.nodes.find(n => n.id === id);
  }

  createEdge(from, to) {
    if (!from.id) {
      throw new Error('addEdge expects `from` to have an id');
    }
    if (!this.getNode(from.id)) {
      throw new Error('addEdge expects `from` to be part of graph');
    }
    if (!to.id) {
      throw new Error('addEdge expects `to` to have an id');
    }
    if (!this.getNode(to.id)) {
      throw new Error('addEdge expects `to` to be part of graph');
    }
    const edge = new Edge(from, to);
    this.edges.push(edge);
    return edge;
  }

  getNextNodeId() {
    const nextId = this.nextNodeId;
    this.nextNodeId += 1;
    return nextId;
  }
}

export default Graph;
