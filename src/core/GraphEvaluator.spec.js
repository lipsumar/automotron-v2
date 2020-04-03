import Graph from './Graph';
import TextNode from './TextNode';
import Node from './Node';
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
      const result = await evaluator.play();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ nodeId: 1, result: null });
      expect(result[1]).toEqual({ edge: true, result: ' ' });
      expect(result[2]).toEqual({ nodeId: 2, result: 'hello' });
    });

    it('randomly chooses nodes when multiple edges from', async () => {
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
      const result = await evaluator.play();

      expect(result).toHaveLength(5);
      expect(result[2].result).toBe('hello');
      expect(result[3].result).toBe(' ');
      expect(result[4].result).toBe('you');
    });

    it('uses generators', async () => {
      const graph = new Graph();
      const textNode = new TextNode('hello');
      graph.addNode(textNode);
      graph.createEdge(graph.startNode, textNode);
      const generator = new TextNode('generator speaking');
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
            result: 'generator speaking',
          },
        ],
        fromGenerator: true,
      });
    });
  });
});
