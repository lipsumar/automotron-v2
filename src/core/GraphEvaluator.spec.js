import Graph from './Graph';
import TextNode from './TextNode';
import GraphEvaluator from './GraphEvaluator';
import { seedRandom } from './utils';

describe('GraphEvaluator', () => {
  describe('evaluate()', () => {
    it('runs the simplest graph', async () => {
      const graph = new Graph();
      const textNode = new TextNode('hello');
      graph.addNode(textNode);
      graph.createEdge(graph.startNode, textNode);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.run();

      expect(result.elements).toBeInstanceOf(Array);
      expect(result.elements).toHaveLength(3);
      expect(result.elements[0]).toEqual({ nodeId: 1, result: null });
      expect(result.elements[1]).toEqual({ edge: true, result: ' ' });
      expect(result.elements[2]).toEqual({ nodeId: 2, result: 'hello' });
    });

    it('can choose nodes when multiple edges from', async () => {
      seedRandom('seed_GraphEvaluator_');
      const graph = new Graph();
      const hello = new TextNode('hello');
      const you = new TextNode('you');
      const there = new TextNode('there');
      graph.addNode(hello);
      graph.addNode(you);
      graph.addNode(there);
      graph.createEdge(graph.startNode, hello);
      graph.createEdge(hello, you);
      graph.createEdge(hello, there);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.run();

      expect(result.elements).toHaveLength(5);
      expect(result.elements[2].result).toBe('hello');
      expect(result.elements[3].result).toBe(' ');
      expect(result.elements[4].result).toBe('you');
    });
  });
});
