import { pickRandom } from './utils';

class GraphEvaluator {
  constructor(graph) {
    this.graph = graph;
  }

  async play() {
    this.resetNodesEvaluatedResult();
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
    const agreementNode = this.graph
      .getAgreementNodesOf(node)
      .find(agNode => !!agNode.evaluatedResult);

    const agreement =
      agreementNode && agreementNode.evaluatedResult
        ? agreementNode.evaluatedResult.agreement
        : null;

    const element = {
      nodeId: node.id,
    };

    if (generatorNode) {
      element.fromGenerator = true;
      element.result = await this.run(generatorNode);
    } else {
      element.result = await node.evaluate(agreement);
      node.evaluatedResult = element.result;
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

  resetNodesEvaluatedResult() {
    this.graph.nodes.forEach(node => {
      node.evaluatedResult = null;
    });
  }
}

export default GraphEvaluator;
