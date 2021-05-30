import StartNode from './StartNode';
import Edge from './Edge';
import TextNode from './TextNode';
import GraphNode from './GraphNode';
import LoopNode from './LoopNode';
import NumberGeneratorNode from './NumberGeneratorNode';
import ParagraphNode from './ParagraphNode';

const NodeByType = {
  text: TextNode,
  graph: GraphNode,
  loop: LoopNode,
  number: NumberGeneratorNode,
  paragraph: ParagraphNode,
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

  toJSON() {
    return {
      version: 2,
      nodes: this.nodes.map(node => node.toJSON()),
      edges: this.edges.map(edge => edge.toJSON()),
    };
  }

  static fromJSON(json) {
    if (!json.version) {
      return Graph.fromJSONv1(json);
    }
    const graph = new Graph();
    graph.startNode.setUi(json.nodes.find(node => node.id === 1).ui);
    json.nodes
      .filter(node => node.id > 1)
      .forEach(node =>
        graph.addNode(NodeByType[node.type].fromJSON(node), node.id),
      );
    json.edges.forEach(edge => {
      try {
        const createdEdge = graph.createEdge(
          graph.getNode(edge.from.nodeId).getConnector(edge.from.key),
          graph.getNode(edge.to.nodeId).getConnector(edge.to.key),
          edge.id,
        );
        createdEdge.space = edge.space;
      } catch (err) {
        console.warn('Could not create edge', edge);
      }
    });
    return graph;
  }

  static fromJSONv1(json) {
    const graph = new Graph();
    graph.startNode.setUi(json.nodes.find(node => node.id === 1).ui);
    json.nodes
      .filter(node => node.id > 1)
      .forEach(node =>
        graph.addNode(NodeByType[node.type].fromJSON(node), node.id),
      );
    json.edges.forEach(edge => {
      const edgeType = edge.type === 'default' ? 'flow' : edge.type;
      if (edgeType === 'generator') {
        graph.createEdge(
          graph.getNode(edge.to.id).getConnector(`${edgeType}Outlet`),
          graph.getNode(edge.from.id).getConnector(`${edgeType}Inlet`),
          edge.id,
        );
      } else if (edgeType === 'agreement') {
        graph.createEdge(
          graph.getNode(edge.to.id).getConnector(`agreementConnector`),
          graph.getNode(edge.from.id).getConnector(`agreementConnector`),
          edge.id,
        );
      } else {
        const createdEdge = graph.createEdge(
          graph.getNode(edge.from.id).getConnector(`${edgeType}Outlet`),
          graph.getNode(edge.to.id).getConnector(`${edgeType}Inlet`),
          edge.id,
        );
        createdEdge.space = edge.space;
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
    const edgesToRemove = this.getEdgesOf(node);
    const edgesIdsToRemove = edgesToRemove.map(edge => edge.id);
    this.nodes = this.nodes.filter(n => n.id !== node.id);
    this.edges = this.edges.filter(e => !edgesIdsToRemove.includes(e.id));
    return edgesToRemove;
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

  /**
   *
   * @param {Connector} fromConnector
   * @param {Connector} toConnector
   * @param {number | undefined} id
   */
  createEdge(fromConnector, toConnector, id) {
    // console.log(fromConnector, toConnector);
    const fromNode = fromConnector.node;
    const toNode = toConnector.node;
    if (!['out', 'in-out'].includes(fromConnector.direction)) {
      throw new Error(
        'addEdge expects `from` connector to have "out" direction',
      );
    }
    if (!['in', 'in-out'].includes(toConnector.direction)) {
      throw new Error('addEdge expects `to` connector to have "in" direction');
    }
    if (fromConnector.type !== toConnector.type) {
      throw new Error(
        'addEdge expects `from` and `to` connectors to have the same type',
      );
    }
    if (!fromNode.id) {
      throw new Error('addEdge expects `from` node to have an id');
    }
    if (!this.getNode(fromNode.id)) {
      throw new Error('addEdge expects `from` node to be part of graph');
    }
    if (!toNode.id) {
      throw new Error('addEdge expects `to` node to have an id');
    }
    if (!this.getNode(toNode.id)) {
      throw new Error('addEdge expects `to` node to be part of graph');
    }
    const edge = new Edge(fromConnector, toConnector);
    edge.type = fromConnector.type;
    if (id && id >= this.nextEdgeId) {
      this.nextEdgeId = id + 1;
    }
    edge.setId(id || this.getNextEdgeId());
    this.edges.push(edge);
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
      edge => edge.isFromNode(node) && (type ? edge.type === type : true),
    );
  }

  getEdgesFromConnector(connector) {
    return this.edges.filter(edge => edge.isFromConnector(connector));
  }

  getEdgesToConnector(connector) {
    return this.edges.filter(edge => edge.isToConnector(connector));
  }

  getNodesToConnector(connector) {
    return this.edges
      .filter(edge => edge.isToConnector(connector))
      .map(edge => edge.from.node);
  }

  getEdgesTo(node, type = null) {
    return this.edges.filter(
      edge => edge.isToNode(node) && (type ? edge.type === type : true),
    );
  }

  getEdgesOf(node, type = null) {
    return this.edges.filter(
      edge =>
        edge.isConnectedToNode(node) && (type ? edge.type === type : true),
    );
  }

  getGeneratorOf(node) {
    if (!node.generatorInlet) return null;
    const generatorEdge = this.getEdgesToConnector(
      node.generatorInlet,
      'generator',
    )[0];
    return generatorEdge ? generatorEdge.from.node : null;
  }

  getAgreementNodesOf(node) {
    const agreementEdges = this.getEdgesOf(node, 'agreement');
    if (agreementEdges.length === 0) {
      return [];
    }
    return agreementEdges.map(edge => {
      return edge.from.node.id === node.id ? edge.to.node : edge.from.node;
    });
  }

  isNodeGenerated(node) {
    return this.getEdgesTo(node, 'generator').length > 0;
  }

  isNodeGenerator(node) {
    return this.getEdgesFrom(node, 'generator').length > 0;
  }

  getNodesGeneratedBy(generator) {
    return this.getEdgesFrom(generator, 'generator').map(edge => edge.to.node);
  }
}

export default Graph;
