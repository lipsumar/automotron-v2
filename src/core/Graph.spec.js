import Graph from './Graph';
import StartNode from './StartNode';
import Node from './Node';
import Edge from './Edge';

function createGraphWith3Nodes() {
  const graph = new Graph();
  const nodeA = new Node();
  const nodeB = new Node();

  graph.addNode(nodeA);
  graph.createEdge(graph.startNode, nodeA);
  graph.addNode(nodeB);
  graph.createEdge(nodeA, nodeB);
  return { graph, nodeA, nodeB };
}

describe('Graph', () => {
  it('is a class', () => {
    const graph = new Graph();
    expect(graph).toBeInstanceOf(Graph);
  });

  it('contains nodes', () => {
    const graph = new Graph();
    expect(graph.nodes).toBeInstanceOf(Array);
  });

  it('contains edges', () => {
    const graph = new Graph();
    expect(graph.edges).toBeInstanceOf(Array);
  });

  it('contains a StartNode by default', () => {
    const graph = new Graph();
    expect(graph.startNode).toBeInstanceOf(StartNode);
    expect(graph.nodes).toHaveLength(1);
    expect(graph.startNode.id).toBe(1);
  });

  describe('addNode()', () => {
    it('adds a node to the nodes list', () => {
      const graph = new Graph();
      expect(graph.nodes).toHaveLength(1);
      graph.addNode(new Node());
      expect(graph.nodes).toHaveLength(2);
    });

    it('returns the node', () => {
      const graph = new Graph();
      const node = new Node();
      expect(graph.addNode(node)).toEqual(node);
    });
  });

  describe('getNode()', () => {
    it('returns a node by id', () => {
      const graph = new Graph();
      const node = graph.addNode(new Node());
      expect(graph.getNode(node.id)).toEqual(node);
    });
  });

  describe('createEdge()', () => {
    it('creates and returns an edge', () => {
      const graph = new Graph();
      const node = new Node();
      graph.addNode(node);
      const edge = graph.createEdge(graph.startNode, node);
      expect(edge).toBeInstanceOf(Edge);
    });

    it('creates an edge between 2 nodes', () => {
      const graph = new Graph();
      const node = new Node();
      graph.addNode(node);
      const edge = graph.createEdge(graph.startNode, node);
      expect(edge.from).toEqual(graph.startNode);
      expect(edge.to).toEqual(node);
    });
  });

  describe('createGeneratorEdge', () => {
    it('creates an edge between a node and a generator', () => {
      const graph = new Graph();
      const node = new Node();
      graph.addNode(node);
      const generator = new Node();
      graph.addNode(generator);
      const edge = graph.createGeneratorEdge(node, generator);
      expect(edge.from).toEqual(node);
      expect(edge.to).toEqual(generator);
      expect(edge.type).toBe('generator');
    });
  });

  describe('removeNode', () => {
    it('removes a node and the edges its connected to', () => {
      const { graph, nodeA } = createGraphWith3Nodes();

      expect(graph.nodes).toHaveLength(3);
      expect(graph.edges).toHaveLength(2);
      graph.removeNode(nodeA);
      expect(graph.nodes).toHaveLength(2);
      expect(graph.edges).toHaveLength(0);
    });
  });

  describe('removeEdge', () => {
    it('removes the edge', () => {
      const graph = new Graph();
      const node = new Node();
      graph.addNode(node);
      const edge = graph.createEdge(graph.startNode, node);

      expect(graph.nodes).toHaveLength(2);
      expect(graph.edges).toHaveLength(1);

      graph.removeEdge(edge);

      expect(graph.nodes).toHaveLength(2);
      expect(graph.edges).toHaveLength(0);
    });
  });

  describe('getEdgesFrom', () => {
    it('returns all edges connected to a node', () => {
      const { graph, nodeA } = createGraphWith3Nodes();
      const generator = new Node();
      graph.addNode(generator);
      graph.createGeneratorEdge(nodeA, generator);
      const linksFromA = graph.getEdgesFrom(nodeA);
      expect(linksFromA).toHaveLength(2);
    });
    it('returns edges of a given type connected to a node', () => {
      const { graph, nodeA } = createGraphWith3Nodes();
      const generator = new Node();
      graph.addNode(generator);
      graph.createGeneratorEdge(nodeA, generator);
      expect(graph.getEdgesFrom(nodeA, 'default')).toHaveLength(1);
      expect(graph.getEdgesFrom(nodeA, 'generator')).toHaveLength(1);
    });
  });
});
