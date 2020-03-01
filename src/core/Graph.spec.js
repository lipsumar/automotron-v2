import Graph from './Graph';
import StartNode from './StartNode';
import Node from './Node';
import Edge from './Edge';

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
});
