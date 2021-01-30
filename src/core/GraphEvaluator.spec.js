import Graph from './Graph';
import TextNode from './TextNode';
import GraphEvaluator from './GraphEvaluator';
import { seedRandom } from './utils';
import LoopNode from './LoopNode';

describe('GraphEvaluator', () => {
  describe('evaluate()', () => {
    it('runs the simplest graph', async () => {
      const graph = new Graph();
      const textNode = new TextNode([{ text: 'hello' }]);
      graph.addNode(textNode);
      graph.createEdge(graph.startNode, textNode);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result.results).toBeInstanceOf(Array);
      expect(result.results).toHaveLength(3);
      expect(result.results[0]).toEqual({ nodeId: 1, result: null });
      expect(result.results[1]).toEqual({ edge: true, result: ' ' });
      expect(result.results[2]).toEqual({
        nodeId: 2,
        result: { text: 'hello' },
      });
    });

    it('supports no-space edges', async () => {
      const graph = new Graph();
      const textNode = new TextNode([{ text: 'hell' }]);
      const textNode2 = new TextNode([{ text: 'o' }]);
      graph.addNode(textNode);
      graph.addNode(textNode2);
      graph.createEdge(graph.startNode, textNode);
      const edge = graph.createEdge(textNode, textNode2);
      edge.space = false;

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result.results).toBeInstanceOf(Array);
      expect(result.results).toHaveLength(5);
      expect(result.results[0]).toEqual({ nodeId: 1, result: null });
      expect(result.results[1]).toEqual({ edge: true, result: ' ' });
      expect(result.results[2]).toEqual({
        nodeId: 2,
        result: { text: 'hell' },
      });
      expect(result.results[3]).toEqual({ edge: true, result: '' });
      expect(result.results[4]).toEqual({
        nodeId: 3,
        result: { text: 'o' },
      });
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

      expect(result.results).toHaveLength(5);
      expect(result.results[2].result).toEqual({ text: 'hello' });
      expect(result.results[3].result).toBe(' ');
      expect(result.results[4].result).toEqual({ text: 'you' });
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
      expect(result.results).toHaveLength(3);
      expect(result.results[0]).toEqual({ nodeId: 1, result: null });
      expect(result.results[1]).toEqual({ edge: true, result: ' ' });
      expect(result.results[2]).toEqual({
        nodeId: 2,
        result: {
          results: [
            {
              nodeId: 3,
              result: { text: 'generator speaking' },
            },
          ],
        },
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

      expect(result.results).toHaveLength(5);
      expect(result.results[2].result.text).toBe('le');
      expect(result.results[4].result.text).toBe('ballon');
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

      expect(result.results).toHaveLength(7);
      expect(result.results[2].result.text).toBe('le');
      expect(result.results[4].result.text).toBe('ballon');
      expect(result.results[6].result.text).toBe('foo');
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
      expect(result.results).toHaveLength(5);
      expect(result.results[0]).toEqual({ nodeId: 1, result: null });
      expect(result.results[1]).toEqual({ edge: true, result: ' ' });
      expect(result.results[4].result.results[0].result.text).toBe('poisson');
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
      expect(result.results).toHaveLength(7);
      expect(result.results[2].result.text).toBe('la');
      expect(result.results[4].result.text).toBe('stupide');
      expect(result.results[6].result.text).toBe('dalle'); // seeded random would choose "pot" if not forced
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

      expect(result.results).toHaveLength(7);
      expect(result.results[2].result.text).toBe('le');
      expect(result.results[4].result.results[0].result.text).toBe('ballon');
      expect(result.results[6].result.text).toBe('foo');
    });

    it('handles agreement with results', async () => {
      seedRandom(`seed_GraphEvaluator_agreement`);
      //           [le, la] <---> [ski, campagne]
      //              |  \____________/
      //              |
      //             [ ]
      //              |
      // Start <---> [ ] <--> il faut <---> [le, la] <---> sauver
      //               \______________________/
      const graph = Graph.fromJSON(
        JSON.parse(
          `{"nodes":[{"id":1,"ui":{"x":-475,"y":0,"generatorValue":null,"width":100,"height":75},"type":"start"},{"id":2,"ui":{"x":-125,"y":0,"generatorValue":{"text":"l'objet"},"width":85.158203125,"height":52},"type":"text","frozen":false,"value":[{"text":"Once upon a time"}],"title":"test"},{"id":3,"ui":{"x":24,"y":-226,"width":52,"height":88,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"},{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}]},{"id":4,"ui":{"x":124,"y":-226,"width":125.080078125,"height":88,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"campagne","agreement":{"gender":"f","number":"s"},"rawText":"campagne(f,s)"},{"text":"ski","agreement":{"gender":"m","number":"s"},"rawText":"ski(m,s)"}]},{"id":5,"ui":{"x":-76,"y":-126,"width":52,"height":52,"generatorValue":{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"}},"type":"text","frozen":true,"value":[{"text":"wow!"}],"title":"l'objet"},{"id":6,"ui":{"x":49,"y":-1,"width":95.841796875,"height":52,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":", il faut ","rawText":", il faut "}]},{"id":7,"ui":{"x":174,"y":-1,"width":52,"height":88,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"},{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}]},{"id":8,"ui":{"x":249,"y":-1,"width":89.826171875,"height":52,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"cacher","rawText":"cacher"}]}],"edges":[{"from":{"id":1},"to":{"id":2},"type":"default"},{"from":{"id":3},"to":{"id":4},"type":"default"},{"from":{"id":4},"to":{"id":3},"type":"agreement"},{"from":{"id":5},"to":{"id":3},"type":"generator"},{"from":{"id":2},"to":{"id":5},"type":"generator"},{"from":{"id":2},"to":{"id":6},"type":"default"},{"from":{"id":6},"to":{"id":7},"type":"default"},{"from":{"id":7},"to":{"id":8},"type":"default"},{"from":{"id":7},"to":{"id":2},"type":"agreement"}]}`,
        ),
      );

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(
        result.results[2].result.results[0].result.results[0].result.text,
      ).toBe('le');
      expect(
        result.results[2].result.results[0].result.results[2].result.text,
      ).toBe('ski');
      expect(result.results[6].result.text).toBe('le');
    });

    it('reset evaluated values when re-evaluating a node', async () => {
      //                      [beau, belle] <---> [mec, meuf]
      //                           ||   \___________/
      //                           ||_______________________________
      //                           |                               |
      // Start <---> le(m,s) <--> [ ] <---> , <---> la(f,s) <---> [ ]
      //                \_________/                   \____________/
      const graph = Graph.fromJSON(
        JSON.parse(
          `{"nodes":[{"id":1,"ui":{"x":-650,"y":25,"generatorValue":null,"width":100,"height":75},"type":"start","evaluatedResult":{"agreement":null}},{"id":2,"ui":{"x":-300,"y":25,"generatorValue":null,"width":52,"height":52},"type":"text","frozen":false,"value":[{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"}],"evaluatedResult":{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"}},{"id":3,"ui":{"x":-126,"y":-201,"width":74.875,"height":88,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"beau","agreement":{"gender":"m","number":"s"},"rawText":"beau(m,s)"},{"text":"belle","agreement":{"gender":"f","number":"s"},"rawText":"belle(f,s)"}],"evaluatedResult":{"text":"belle","agreement":{"gender":"f","number":"s"},"rawText":"belle(f,s)"}},{"id":4,"ui":{"x":-1,"y":-201,"width":76.876953125,"height":88,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"mec","agreement":{"gender":"m","number":"s"},"rawText":"mec(m,s)"},{"text":"meuf","agreement":{"gender":"f","number":"s"},"rawText":"meuf(f,s)"}],"evaluatedResult":{"text":"meuf","agreement":{"gender":"f","number":"s"},"rawText":"meuf(f,s)"}},{"id":5,"ui":{"x":-201,"y":24,"width":74.875,"height":52,"generatorValue":{"text":"beau","agreement":{"gender":"m","number":"s"},"rawText":"beau(m,s)"}},"type":"text","frozen":false,"value":[{"text":"oooh!"}],"evaluatedResult":{"results":[{"nodeId":3,"result":{"text":"beau","agreement":{"gender":"m","number":"s"},"rawText":"beau(m,s)"}},{"edge":true,"result":" "},{"nodeId":4,"result":{"text":"mec","agreement":{"gender":"m","number":"s"},"rawText":"mec(m,s)"}}],"agreement":{"gender":"m","number":"s"}}},{"id":6,"ui":{"x":-76,"y":24,"width":52,"height":52,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":",","rawText":","}],"evaluatedResult":{"text":",","rawText":",","agreement":null}},{"id":7,"ui":{"x":24,"y":24,"width":52,"height":52,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}],"evaluatedResult":{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}},{"id":8,"ui":{"x":149,"y":24,"width":74.875,"height":52,"generatorValue":{"text":"beau","agreement":{"gender":"m","number":"s"},"rawText":"beau(m,s)"}},"type":"text","frozen":false,"value":[{"text":"aaah!"}],"evaluatedResult":{"results":[{"nodeId":3,"result":{"text":"belle","agreement":{"gender":"f","number":"s"},"rawText":"belle(f,s)"}},{"edge":true,"result":" "},{"nodeId":4,"result":{"text":"meuf","agreement":{"gender":"f","number":"s"},"rawText":"meuf(f,s)"}}],"agreement":{"gender":"f","number":"s"}}}],"edges":[{"from":{"id":1},"to":{"id":2},"type":"default"},{"from":{"id":3},"to":{"id":4},"type":"default"},{"from":{"id":4},"to":{"id":3},"type":"agreement"},{"from":{"id":2},"to":{"id":5},"type":"default"},{"from":{"id":5},"to":{"id":3},"type":"generator"},{"from":{"id":5},"to":{"id":2},"type":"agreement"},{"from":{"id":5},"to":{"id":6},"type":"default"},{"from":{"id":6},"to":{"id":7},"type":"default"},{"from":{"id":7},"to":{"id":8},"type":"default"},{"from":{"id":8},"to":{"id":3},"type":"generator"},{"from":{"id":8},"to":{"id":7},"type":"agreement"}]}`,
        ),
      );

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result.results[2].result.text).toBe('le');
      expect(result.results[4].result.results[0].result.text).toBe('beau');
      expect(result.results[4].result.results[2].result.text).toBe('mec');
      expect(result.results[8].result.text).toBe('la');
      expect(result.results[10].result.results[0].result.text).toBe('belle');
      expect(result.results[10].result.results[2].result.text).toBe('meuf');
    });

    it('handles agreement to generated non-evaluated node (aka. look-ahead agreement)', async () => {
      seedRandom(`seed_GraphEvaluator_agreement`);
      //                                [prince, princesse]
      //                              _________||__________________________
      //                             |                                     |
      // Start <---> [le, la] <---> [ ] <---> c'est <---> [un, une] <---> [ ]
      //                 \__________/                           \_________/
      const graph = Graph.fromJSON(
        JSON.parse(
          `{"nodes":[{"id":1,"ui":{"x":-50,"y":-50,"generatorValue":null,"width":100,"height":75},"type":"start","evaluatedResult":{"agreement":null}},{"id":2,"ui":{"x":300,"y":-50,"generatorValue":null,"width":52,"height":88},"type":"text","frozen":false,"value":[{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"},{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}],"evaluatedResult":{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}},{"id":3,"ui":{"x":524,"y":-251,"width":116.798828125,"height":88},"type":"text","frozen":true,"value":[{"text":"prince","agreement":{"gender":"m","number":"s"},"rawText":"prince(m,s)"},{"text":"princesse","agreement":{"gender":"f","number":"s"},"rawText":"princesse(f,s)"}],"title":"héro","evaluatedResult":{"text":"princesse","agreement":{"gender":"f","number":"s"},"rawText":"princesse(f,s)"}},{"id":4,"ui":{"x":399,"y":-51,"width":71.740234375,"height":52,"generatorValue":{"text":"héro"}},"type":"text","frozen":false,"value":[{"text":"aaah!"}],"evaluatedResult":{"results":[{"nodeId":3,"result":{"text":"princesse","agreement":{"gender":"f","number":"s"},"rawText":"princesse(f,s)"}}],"agreement":{"gender":"f","number":"s"}}},{"id":5,"ui":{"x":549,"y":-51,"width":69.767578125,"height":52,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"c'est","rawText":"c'est"}],"evaluatedResult":{"text":"c'est","rawText":"c'est","agreement":null}},{"id":7,"ui":{"x":674,"y":-51,"width":63.771484375,"height":88},"type":"text","frozen":false,"value":[{"text":"un","agreement":{"gender":"m","number":"s"},"rawText":"un(m,s)"},{"text":"une","agreement":{"gender":"f","number":"s"},"rawText":"une(f,s)"}],"evaluatedResult":{"text":"une","agreement":{"gender":"f","number":"s"},"rawText":"une(f,s)"}},{"id":8,"ui":{"x":774,"y":-51,"width":71.740234375,"height":52,"generatorValue":{"text":"héro"}},"type":"text","frozen":false,"value":[{"text":"aaah!"}],"evaluatedResult":{"results":[{"nodeId":3,"result":{"text":"princesse","agreement":{"gender":"f","number":"s"},"rawText":"princesse(f,s)"}}],"agreement":{"gender":"f","number":"s"}}}],"edges":[{"from":{"id":1},"to":{"id":2},"type":"default"},{"from":{"id":2},"to":{"id":4},"type":"default"},{"from":{"id":4},"to":{"id":5},"type":"default"},{"from":{"id":5},"to":{"id":7},"type":"default"},{"from":{"id":7},"to":{"id":8},"type":"default"},{"from":{"id":8},"to":{"id":7},"type":"agreement"},{"from":{"id":4},"to":{"id":2},"type":"agreement"},{"from":{"id":8},"to":{"id":3},"type":"generator"},{"from":{"id":4},"to":{"id":3},"type":"generator"}]}`,
        ),
      );

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result.results[2].result.text).toBe('le');
      expect(result.results[4].result.results[0].result.text).toBe('prince');
      expect(result.results[8].result.text).toBe('un');
      expect(result.results[10].result.results[0].result.text).toBe('prince');
    });

    it('supports loopNode', async () => {
      const graph = new Graph();
      const textNode = new TextNode([{ text: 'hello' }]);
      graph.addNode(textNode);
      graph.createEdge(graph.startNode, textNode);
      const loopNode = new LoopNode();
      graph.addNode(loopNode);
      graph.createEdge(textNode, loopNode);

      const i = new TextNode([{ text: 'i' }]);
      graph.addNode(i);
      graph.createEdge(loopNode, i);
      const am = new TextNode([{ text: 'am' }]);
      graph.addNode(am);
      graph.createEdge(i, am);

      const happy = new TextNode([{ text: 'happy' }]);
      graph.addNode(happy);
      graph.createEdge({ node: loopNode, outlet: 'exit' }, happy);

      const evaluator = new GraphEvaluator(graph);
      const result = await evaluator.play();

      expect(result.results).toHaveLength(22);
      // expect(result.results[0]).toEqual({ nodeId: 1, result: null });
      // expect(result.results[1]).toEqual({ edge: true, result: ' ' });
      // expect(result.results[2]).toEqual({
      //   nodeId: 2,
      //   result: {
      //     results: [
      //       {
      //         nodeId: 3,
      //         result: { text: 'generator speaking' },
      //       },
      //     ],
      //   },
      // });
    });
  });
});
