import Graph from './Graph';
import TextNode from './TextNode';
import GraphEvaluator from './GraphEvaluator';
import { seedRandom } from './utils';

describe('GraphEvaluator', () => {
  describe('evaluate()', () => {
    it('runs the simplest graph', async () => {
      const graph = new Graph();
      const textNode = new TextNode([{ text: 'hello' }]);
      graph.addNode(textNode);
      graph.createEdge(graph.startNode, textNode);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ nodeId: 1, result: null });
      expect(result[1]).toEqual({ edge: true, result: ' ' });
      expect(result[2]).toEqual({ nodeId: 2, result: { text: 'hello' } });
    });

    it('randomly chooses nodes when multiple edges from', async () => {
      seedRandom('seed_GraphEvaluator_');
      const graph = new Graph();
      const hello = new TextNode([{ text: 'hello' }]);
      const you = new TextNode([{ text: 'you' }]);
      const there = new TextNode([{ text: 'there' }]);
      graph.addNode(hello);
      graph.addNode(you);
      graph.addNode(there);
      graph.createEdge(graph.startNode, hello);
      graph.createEdge(hello, you);
      graph.createEdge(hello, there);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result).toHaveLength(5);
      expect(result[2].result).toEqual({ text: 'hello' });
      expect(result[3].result).toBe(' ');
      expect(result[4].result).toEqual({ text: 'you' });
    });

    it('uses generators', async () => {
      const graph = new Graph();
      const textNode = new TextNode([{ text: 'hello' }]);
      graph.addNode(textNode);
      graph.createEdge(graph.startNode, textNode);
      const generator = new TextNode([{ text: 'generator speaking' }]);
      graph.addNode(generator);
      graph.createGeneratorEdge(textNode, generator);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ nodeId: 1, result: null });
      expect(result[1]).toEqual({ edge: true, result: ' ' });
      expect(result[2]).toEqual({
        nodeId: 2,
        result: [
          {
            nodeId: 3,
            result: { text: 'generator speaking' },
          },
        ],
        fromGenerator: true,
      });
    });

    it('respects agreements', async () => {
      // random has no play here, the choice is forced by the agreement
      seedRandom(`seed_GraphEvaluator_agreement_${Math.random()}`);
      const graph = new Graph();
      const textNodeA = new TextNode([
        { text: 'le', agreement: { gender: 'm' } },
      ]);
      const textNodeB = new TextNode([
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'ballon', agreement: { gender: 'm' } },
      ]);
      graph.addNode(textNodeA);
      graph.addNode(textNodeB);
      graph.createEdge(graph.startNode, textNodeA);
      graph.createEdge(textNodeA, textNodeB);
      graph.createAgreementEdge(textNodeA, textNodeB);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result).toHaveLength(5);
      expect(result[2].result.text).toBe('le');
      expect(result[4].result.text).toBe('ballon');
    });

    it('handles multiple agreement links on one node', async () => {
      // random has no play here, the choice is forced by the agreement
      seedRandom(`seed_GraphEvaluator_agreement_${Math.random()}`);
      const graph = new Graph();
      const textNodeA = new TextNode([
        { text: 'le', agreement: { gender: 'm' } },
      ]);
      const textNodeB = new TextNode([
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'ballon', agreement: { gender: 'm', foo: true } },
      ]);
      const textNodeC = new TextNode([
        { text: 'foo', agreement: { gender: 'm', foo: true } },
        { text: 'bar', agreement: { gender: 'm', foo: false } },
      ]);
      graph.addNode(textNodeA);
      graph.addNode(textNodeB);
      graph.addNode(textNodeC);
      graph.createEdge(graph.startNode, textNodeA);
      graph.createEdge(textNodeA, textNodeB);
      graph.createEdge(textNodeB, textNodeC);
      graph.createAgreementEdge(textNodeA, textNodeB);
      graph.createAgreementEdge(textNodeB, textNodeC);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result).toHaveLength(7);
      expect(result[2].result.text).toBe('le');
      expect(result[4].result.text).toBe('ballon');
      expect(result[6].result.text).toBe('foo');
    });
  });
});
