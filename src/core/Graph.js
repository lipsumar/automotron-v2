import StartNode from './StartNode';
import Edge from './Edge';
import TextNode from './TextNode';
import TextListNode from './TextListNode';

const nodeTypes = {
  text: TextNode,
  'text-list': TextListNode,
};

class Graph {
  nodes = [];

  edges = [];

  startNode = null;

  nextNodeId = 1;

  constructor() {
    this.startNode = this.addNode(new StartNode());
  }

  static fromJSON(json) {
    const graph = new Graph();
    graph.startNode.setUi(json.nodes.find(node => node.id === 1).ui);
    json.nodes
      .filter(node => node.id > 1)
      .forEach(node => graph.addNode(nodeTypes[node.type].fromJSON(node)));
    json.edges.forEach(edge => graph.createEdge(edge.from, edge.to));
    return graph;
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
    const edge = new Edge(this.getNode(from.id), this.getNode(to.id));
    this.edges.push(edge);
    return edge;
  }

  getNextNodeId() {
    const nextId = this.nextNodeId;
    this.nextNodeId += 1;
    return nextId;
  }

  getEdgesFrom(node) {
    return this.edges.filter(edge => edge.from.id === node.id);
  }
}

export default Graph;
