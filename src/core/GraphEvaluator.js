import { pickRandom } from './utils';

class GraphEvaluator {
  constructor(graph) {
    this.graph = graph;
  }

  async play() {
    const result = await this.run(this.graph.startNode);
    return result;
  }

  async run(currentPointer, result = []) {
    if (currentPointer) {
      const element = await this.evaluateNode(currentPointer);
      result.push(element);
      const nextEdge = this.findNextEdge(currentPointer);
      if (nextEdge) {
        result.push({
          edge: true,
          result: ' ',
        });
        return this.run(nextEdge.to, result);
      }
    }
    return result;
  }

  async evaluateNode(node) {
    const generatorNode = this.graph.getGeneratorFrom(node);
    const element = {
      nodeId: node.id,
    };

    if (generatorNode) {
      element.fromGenerator = true;
      element.result = await this.run(generatorNode);
    } else {
      element.result = await node.evaluate();
    }

    return element;
  }

  findNextEdge(currentPointer) {
    const edges = this.graph.getEdgesFrom(currentPointer, 'default');
    if (edges.length === 0) {
      return null;
    }
    const edge = pickRandom(edges);

    return edge;
  }
}

export default GraphEvaluator;
