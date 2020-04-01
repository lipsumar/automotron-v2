import { pickRandom } from './utils';

class GraphEvaluator {
  currentPointer = null;

  constructor(graph) {
    this.graph = graph;
  }

  async run() {
    this.currentPointer = this.graph.startNode;
    this.result = {
      elements: [],
    };
    await this.nextStep();
    return this.result;
  }

  /**
   * Recursive function calling step() as long as it's possible,
   * filling this.result at each step
   */
  async nextStep() {
    if (this.currentPointer) {
      await this.step();
      return this.nextStep();
    }
    return this.result;
  }

  async step() {
    const element = await this.evaluateNode(this.currentPointer);
    this.result.elements.push(element);
    this.currentPointer = this.findNextNode(this.currentPointer);
    return element;
  }

  async evaluateNode(node) {
    const generatorNode = this.graph.getGeneratorFrom(node);
    const element = {
      nodeId: node.id,
    };

    if (generatorNode) {
      element.fromGenerator = true;
      element.result = {
        result: await generatorNode.evaluate(),
        nodeId: generatorNode.id,
      };
    } else {
      element.result = await node.evaluate();
    }

    return element;
  }

  findNextNode() {
    const edges = this.graph.getEdgesFrom(this.currentPointer, 'default');
    if (edges.length === 0) {
      return null;
    }
    const edge = pickRandom(edges);
    this.result.elements.push({
      edge: true,
      result: ' ',
    });
    return edge.to;
  }
}

export default GraphEvaluator;
