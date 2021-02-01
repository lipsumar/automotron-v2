import Graph from './Graph';
import StartNode from './StartNode';
import Node from './Node';
import Edge from './Edge';
import TextNode from './TextNode';

// start <--> A <--> B
function createGraphWith3Nodes() {
  const graph = new Graph();
  const nodeA = new TextNode('A');
  const nodeB = new TextNode('B');

  graph.addNode(nodeA);
  graph.createEdge(graph.startNode.flowOutlet, nodeA.flowInlet);
  graph.addNode(nodeB);
  graph.createEdge(nodeA.flowOutlet, nodeB.flowInlet);
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
      const node = new TextNode();
      graph.addNode(node);
      const edge = graph.createEdge(graph.startNode.flowOutlet, node.flowInlet);
      expect(edge).toBeInstanceOf(Edge);
      expect(edge.type).toBe('flow');
    });

    it('creates an edge between 2 node connectors', () => {
      const graph = new Graph();
      const node = new TextNode();
      graph.addNode(node);
      const edge = graph.createEdge(graph.startNode.flowOutlet, node.flowInlet);
      expect(edge.from).toEqual(graph.startNode.flowOutlet);
      expect(edge.to).toEqual(node.flowInlet);
    });

    it.todo('accepts an edge id');
    it.todo('increases nextEdgeId when passed edge id is > nextEdgeId');

    it('infers edge type', () => {
      const graph = new Graph();
      const node = new TextNode();
      graph.addNode(node);
      const generator = new TextNode();
      graph.addNode(generator);
      const edge = graph.createEdge(
        generator.generatorOutlet,
        node.generatorInlet,
      );
      expect(edge.from.node).toEqual(generator);
      expect(edge.to.node).toEqual(node);
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
      const node = new TextNode();
      graph.addNode(node);
      const edge = graph.createEdge(graph.startNode.flowOutlet, node.flowInlet);

      expect(graph.nodes).toHaveLength(2);
      expect(graph.edges).toHaveLength(1);

      graph.removeEdge(edge);

      expect(graph.nodes).toHaveLength(2);
      expect(graph.edges).toHaveLength(0);
    });
  });

  describe('getEdgesOf', () => {
    it('returns all edges a node is connected to', () => {
      const { graph, nodeA } = createGraphWith3Nodes();
      expect(graph.getEdgesOf(nodeA)).toHaveLength(2);
    });
    it.todo('allows to specify edge type');
  });

  describe('getEdgesFrom', () => {
    it('returns all edges connected from a node', () => {
      const { graph, nodeA, nodeB } = createGraphWith3Nodes();
      const generator = new TextNode();
      graph.addNode(generator);
      graph.createEdge(generator.generatorOutlet, nodeA.generatorInlet);
      const edgesFromA = graph.getEdgesFrom(nodeA);
      expect(edgesFromA).toHaveLength(1);
      expect(edgesFromA[0].from.node).toEqual(nodeA);
      expect(edgesFromA[0].to.node).toEqual(nodeB);

      const edgesFromGenerator = graph.getEdgesFrom(generator);
      expect(edgesFromGenerator).toHaveLength(1);
      expect(edgesFromGenerator[0].from.node).toEqual(generator);
      expect(edgesFromGenerator[0].to.node).toEqual(nodeA);
    });
    it('returns edges of a given type connected to a node', () => {
      const { graph, nodeA } = createGraphWith3Nodes();
      const generator = new TextNode();
      graph.addNode(generator);
      graph.createEdge(generator.generatorOutlet, nodeA.generatorInlet);
      const text = new TextNode();
      graph.addNode(text);
      graph.createEdge(generator.flowOutlet, text.flowInlet);
      const edgesFromGenerator = graph.getEdgesFrom(generator);
      expect(edgesFromGenerator).toHaveLength(2);
      expect(edgesFromGenerator[0].from.node).toEqual(generator);
      expect(edgesFromGenerator[0].to.node).toEqual(nodeA);
      expect(edgesFromGenerator[0].type).toEqual('generator');
      expect(edgesFromGenerator[1].from.node).toEqual(generator);
      expect(edgesFromGenerator[1].to.node).toEqual(text);
      expect(edgesFromGenerator[1].type).toEqual('flow');
      const generatorEdgesFromGenerator = graph.getEdgesFrom(
        generator,
        'generator',
      );
      expect(generatorEdgesFromGenerator).toHaveLength(1);
      expect(generatorEdgesFromGenerator[0].from.node).toEqual(generator);
      expect(generatorEdgesFromGenerator[0].to.node).toEqual(nodeA);
      expect(generatorEdgesFromGenerator[0].type).toEqual('generator');
    });
  });

  describe('getEdgesTo', () => {
    it('returns all edges connected to a node', () => {
      const { graph, nodeA } = createGraphWith3Nodes();
      const generator = new TextNode();
      graph.addNode(generator);
      graph.createEdge(generator.generatorOutlet, nodeA.generatorInlet);
      const edgesToA = graph.getEdgesTo(nodeA);
      expect(edgesToA).toHaveLength(2);
      expect(edgesToA[0].from.node).toEqual(graph.startNode);
      expect(edgesToA[0].to.node).toEqual(nodeA);
      expect(edgesToA[1].from.node).toEqual(generator);
      expect(edgesToA[1].to.node).toEqual(nodeA);

      expect(graph.getEdgesTo(generator)).toHaveLength(0);
    });
  });

  describe('getGeneratorOf', () => {
    it('returns nodes that are generators of given node', () => {
      const { graph, nodeA } = createGraphWith3Nodes();
      const generator = new TextNode();
      graph.addNode(generator);
      graph.createEdge(generator.generatorOutlet, nodeA.generatorInlet);
      expect(graph.getGeneratorOf(nodeA)).toEqual(generator);
    });
  });

  describe('JSON', () => {
    const graphWith3NodesJSON = {
      version: 2,
      edges: [
        {
          from: {
            direction: 'out',
            key: 'flowOutlet',
            nodeId: 1,
            type: 'flow',
          },
          id: 1,
          space: true,
          to: { direction: 'in', key: 'flowInlet', nodeId: 2, type: 'flow' },
          type: 'flow',
        },
        {
          from: {
            direction: 'out',
            key: 'flowOutlet',
            nodeId: 2,
            type: 'flow',
          },
          id: 2,
          space: true,
          to: { direction: 'in', key: 'flowInlet', nodeId: 3, type: 'flow' },
          type: 'flow',
        },
      ],
      nodes: [
        { id: 1, type: 'start', ui: null },
        {
          frozen: false,
          id: 2,
          title: null,
          type: 'text',
          ui: null,
          value: [{ text: 'A' }],
        },
        {
          frozen: false,
          id: 3,
          title: null,
          type: 'text',
          ui: null,
          value: [{ text: 'B' }],
        },
      ],
    };
    describe('toJSON', () => {
      it('returns a JSON representation', () => {
        const { graph } = createGraphWith3Nodes();
        const json = graph.toJSON();
        expect(json).toEqual(graphWith3NodesJSON);
      });
    });

    describe('fromJSON', () => {
      it('creates a graph from JSON', () => {
        const graphFromJSON = Graph.fromJSON(graphWith3NodesJSON);
        const { graph } = createGraphWith3Nodes();
        expect(graphFromJSON).toEqual(graph);
      });
      it('supports deprecated connector-less structure', () => {
        const graphFromJSON = Graph.fromJSON({
          nodes: [
            {
              id: 1,
              ui: {
                x: -50,
                y: -50,
                generatorValue: null,
                width: 100,
                height: 75,
              },
              type: 'start',
              evaluatedResult: null,
            },
            {
              id: 2,
              ui: null,
              type: 'text',
              frozen: false,
              value: [
                {
                  text: 'le',
                  agreement: { gender: 'm', number: 's' },
                  rawText: 'le(m,s)',
                },
                {
                  text: 'la',
                  agreement: { gender: 'f', number: 's' },
                  rawText: 'la(f,s)',
                },
              ],
              evaluatedResult: {
                text: 'le',
                agreement: { gender: 'm', number: 's' },
                rawText: 'le(m,s)',
              },
            },
            {
              id: 3,
              ui: null,
              type: 'text',
              frozen: false,
              value: [{ text: 'stupide', rawText: 'stupide' }],
              evaluatedResult: { text: 'stupide', rawText: 'stupide' },
            },
            {
              id: 5,
              ui: null,
              type: 'text',
              frozen: false,
              value: [
                {
                  text: 'pot',
                  agreement: { gender: 'm', number: 's' },
                  rawText: 'pot(m,s)',
                },
                {
                  text: 'dalle',
                  agreement: { gender: 'f', number: 's' },
                  rawText: 'dalle(f,s)',
                },
              ],
              evaluatedResult: {
                text: 'pot',
                agreement: { gender: 'm', number: 's' },
                rawText: 'pot(m,s)',
              },
            },
            {
              id: 6,
              ui: null,
              type: 'text',
              frozen: false,
              value: [
                {
                  text: 'generator',
                  rawText: 'generator',
                },
              ],
              evaluatedResult: {
                text: 'generator',
                rawText: 'generator',
              },
            },
          ],
          edges: [
            { from: { id: 1 }, to: { id: 2 }, type: 'default' },
            { from: { id: 2 }, to: { id: 3 }, type: 'default' },
            { from: { id: 3 }, to: { id: 5 }, type: 'default' },
            { from: { id: 5 }, to: { id: 3 }, type: 'agreement' },
            { from: { id: 3 }, to: { id: 2 }, type: 'agreement' },
            { from: { id: 3 }, to: { id: 6 }, type: 'generator' },
          ],
        });
        const graph = new Graph();
        graph.startNode.setUi({
          x: -50,
          y: -50,
          generatorValue: null,
          width: 100,
          height: 75,
        });
        const node2 = graph.addNode(
          new TextNode([
            {
              text: 'le',
              agreement: { gender: 'm', number: 's' },
              rawText: 'le(m,s)',
            },
            {
              text: 'la',
              agreement: { gender: 'f', number: 's' },
              rawText: 'la(f,s)',
            },
          ]),
          2,
        );
        const node3 = graph.addNode(
          new TextNode([{ text: 'stupide', rawText: 'stupide' }]),
          3,
        );
        const node5 = graph.addNode(
          new TextNode([
            {
              text: 'pot',
              agreement: { gender: 'm', number: 's' },
              rawText: 'pot(m,s)',
            },
            {
              text: 'dalle',
              agreement: { gender: 'f', number: 's' },
              rawText: 'dalle(f,s)',
            },
          ]),
          5,
        );
        const node6 = graph.addNode(
          new TextNode([
            {
              text: 'generator',
              rawText: 'generator',
            },
          ]),
          6,
        );
        graph.createEdge(graph.startNode.flowOutlet, node2.flowInlet);
        graph.createEdge(node2.flowOutlet, node3.flowInlet);
        graph.createEdge(node3.flowOutlet, node5.flowInlet);
        graph.createEdge(node3.agreementConnector, node5.agreementConnector);
        graph.createEdge(node2.agreementConnector, node3.agreementConnector);
        graph.createEdge(node6.generatorOutlet, node3.generatorInlet);
        expect(graphFromJSON).toEqual(graph);
      });
    });
  });
});
