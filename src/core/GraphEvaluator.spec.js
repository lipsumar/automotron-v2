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
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
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

    it('forwards agreement to generator', async () => {
      // random has no play here, the choice is forced by the agreement
      seedRandom(`seed_GraphEvaluator_agreement_${Math.random()}`);
      const graph = new Graph();
      const textNodeA = new TextNode([
        { text: 'le', agreement: { gender: 'm' } },
      ]);
      const textNodeB = new TextNode([{ text: 'poi' }]);
      graph.addNode(textNodeA);
      graph.addNode(textNodeB);
      graph.createEdge(graph.startNode, textNodeA);
      graph.createEdge(textNodeA, textNodeB);
      const generator = new TextNode([
        { text: 'poisson', agreement: { gender: 'm' } },
        { text: 'fleur', agreement: { gender: 'f' } },
        { text: 'fleur', agreement: { gender: 'f' } },
        { text: 'fleur', agreement: { gender: 'f' } },
        { text: 'fleur', agreement: { gender: 'f' } },
      ]);
      graph.addNode(generator);
      graph.createGeneratorEdge(textNodeB, generator);
      graph.createAgreementEdge(textNodeA, textNodeB);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();
      expect(result).toHaveLength(5);
      expect(result[0]).toEqual({ nodeId: 1, result: null });
      expect(result[1]).toEqual({ edge: true, result: ' ' });
      expect(result[4].result[0].result.text).toBe('poisson');
    });

    it('uses the most restrictive agreement as evaluated agreement', async () => {
      seedRandom(`seed_GraphEvaluator_agreement1`);
      // [le, la] <---> stupide <---> [pot, dalle]
      //      \____________/\_____________/
      const graph = Graph.fromJSON(
        JSON.parse(
          '{"nodes":[{"id":1,"ui":{"x":-50,"y":-50,"generatorValue":null,"width":100,"height":75},"type":"start","evaluatedResult":null},{"id":2,"ui":{"x":300,"y":-50,"generatorValue":null,"width":52,"height":88},"type":"text","frozen":false,"value":[{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"},{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}],"evaluatedResult":{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"}},{"id":3,"ui":{"x":399,"y":-51,"width":97.66796875,"height":52,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"stupide","rawText":"stupide"}],"evaluatedResult":{"text":"stupide","rawText":"stupide"}},{"id":5,"ui":{"x":574,"y":-51,"width":72.716796875,"height":88,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"pot","agreement":{"gender":"m","number":"s"},"rawText":"pot(m,s)"},{"text":"dalle","agreement":{"gender":"f","number":"s"},"rawText":"dalle(f,s)"}],"evaluatedResult":{"text":"pot","agreement":{"gender":"m","number":"s"},"rawText":"pot(m,s)"}}],"edges":[{"from":{"id":1},"to":{"id":2},"type":"default"},{"from":{"id":2},"to":{"id":3},"type":"default"},{"from":{"id":3},"to":{"id":5},"type":"default"},{"from":{"id":5},"to":{"id":3},"type":"agreement"},{"from":{"id":3},"to":{"id":2},"type":"agreement"}]}',
        ),
      );

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();
      expect(result).toHaveLength(7);
      expect(result[2].result.text).toBe('la');
      expect(result[4].result.text).toBe('stupide');
      expect(result[6].result.text).toBe('dalle'); // seeded random would choose "pot" if not forced
    });

    it('handles multiple agreement links on one generated node', async () => {
      // random has no play here, the choice is forced by the agreement
      seedRandom(`seed_GraphEvaluator_agreement_${Math.random()}`);
      const graph = new Graph();
      const textNodeA = new TextNode([
        { text: 'le', agreement: { gender: 'm' } },
      ]);
      const textNodeB = new TextNode();
      const textNodeBGenerator = new TextNode([
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'balle', agreement: { gender: 'f' } },
        { text: 'ballon', agreement: { gender: 'm', foo: true } },
      ]);
      const textNodeC = new TextNode([
        { text: 'foo', agreement: { gender: 'm', foo: true } },
        { text: 'bar', agreement: { gender: 'm', foo: false } },
        { text: 'bar', agreement: { gender: 'm', foo: false } },
        { text: 'bar', agreement: { gender: 'm', foo: false } },
        { text: 'bar', agreement: { gender: 'm', foo: false } },
        { text: 'bar', agreement: { gender: 'm', foo: false } },
      ]);
      graph.addNode(textNodeA);
      graph.addNode(textNodeB);
      graph.addNode(textNodeC);
      graph.addNode(textNodeBGenerator);
      graph.createEdge(graph.startNode, textNodeA);
      graph.createEdge(textNodeA, textNodeB);
      graph.createEdge(textNodeB, textNodeC);
      graph.createAgreementEdge(textNodeA, textNodeB);
      graph.createAgreementEdge(textNodeB, textNodeC);
      graph.createGeneratorEdge(textNodeB, textNodeBGenerator);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result).toHaveLength(7);
      expect(result[2].result.text).toBe('le');
      expect(result[4].result[0].result.text).toBe('ballon');
      expect(result[6].result.text).toBe('foo');
    });

    it.todo('reset evaluated values when re-evaluating a node');

    it.todo(
      'handles agreement to generated non-evaluated node (aka. look-ahead agreement)',
    );
  });
});
