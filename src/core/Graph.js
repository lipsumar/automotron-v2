import StartNode from './StartNode';
import Edge from './Edge';
import TextNode from './TextNode';

const nodeTypes = {
  text: TextNode,
};

class Graph {
  nodes = [];

  edges = [];

  startNode = null;

  nextNodeId = 1;

  nextEdgeId = 1;

  constructor() {
    this.startNode = this.addNode(new StartNode());
  }

  static fromJSON(json) {
    const graph = new Graph();
    graph.startNode.setUi(json.nodes.find(node => node.id === 1).ui);
    json.nodes
      .filter(node => node.id > 1)
      .forEach(node =>
        graph.addNode(nodeTypes[node.type].fromJSON(node), node.id),
      );
    json.edges.forEach(edge => {
      if (edge.type === 'generator') {
        graph.createGeneratorEdge(edge.from, edge.to);
      } else {
        graph.createEdge(edge.from, edge.to);
      }
    });
    return graph;
  }

  addNode(node, id = null) {
    if (id && id >= this.nextNodeId) {
      this.nextNodeId = id + 1;
    }
    node.setId(id || this.getNextNodeId());
    this.nodes.push(node);
    return node;
  }

  removeNode(node) {
    const removedEdges = [];
    this.edges = this.edges.filter(edge => {
      const keep = edge.from.id !== node.id && edge.to.id !== node.id;
      if (!keep) {
        removedEdges.push(edge);
      }
      return keep;
    });
    this.nodes = this.nodes.filter(n => n.id !== node.id);
    return removedEdges;
  }

  getNode(id) {
    return this.nodes.find(n => n.id === id);
  }

  getNodes(ids) {
    return this.nodes.filter(n => ids.includes(n.id));
  }

  getEdge(id) {
    return this.edges.find(edge => edge.id === id);
  }

  createEdge(from, to, id) {
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
    if (id && id >= this.nextEdgeId) {
      this.nextEdgeId = id + 1;
    }
    edge.setId(id || this.getNextEdgeId());
    this.edges.push(edge);
    return edge;
  }

  createGeneratorEdge(from, to, id) {
    const edge = this.createEdge(from, to, id);
    edge.type = 'generator';
    return edge;
  }

  removeEdge(edge) {
    this.edges = this.edges.filter(e => e.id !== edge.id);
  }

  getNextNodeId() {
    const nextId = this.nextNodeId;
    this.nextNodeId += 1;
    return nextId;
  }

  getNextEdgeId() {
    const nextId = this.nextEdgeId;
    this.nextEdgeId += 1;
    return nextId;
  }

  getEdgesFrom(node, type = null) {
    return this.edges.filter(
      edge => edge.from.id === node.id && (type ? edge.type === type : true),
    );
  }

  getEdgesTo(node, type = null) {
    return this.edges.filter(
      edge => edge.to.id === node.id && (type ? edge.type === type : true),
    );
  }

  getGeneratorFrom(node) {
    const generatorEdge = this.getEdgesFrom(node, 'generator')[0];
    if (!generatorEdge) {
      return null;
    }
    return generatorEdge.to;
  }

  isNodeGenerated(node) {
    return this.getEdgesFrom(node, 'generator').length > 0;
  }

  getNodesGeneratedBy(generator) {
    return this.getEdgesTo(generator, 'generator').map(edge => edge.from);
  }
}

export default Graph;
