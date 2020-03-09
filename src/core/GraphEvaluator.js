import random from 'random';

function pickRandom(arr) {
  return arr[random.int(0, arr.length - 1)];
}

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
    const element = {
      nodeId: node.id,
      result: await node.evaluate(),
    };
    return element;
  }

  findNextNode() {
    const edges = this.graph.getEdgesFrom(this.currentPointer);
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
