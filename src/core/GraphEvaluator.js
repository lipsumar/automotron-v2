import cloneDeep from 'lodash.clonedeep';
import { pickRandom } from './utils';
import combineAgreements from './combineAgreements';

class GraphEvaluator {
  constructor(graph) {
    this.graph = graph;
  }

  async play() {
    this.resetNodesEvaluatedResult();
    const result = await this.run(this.graph.startNode);
    return result;
  }

  async run(currentPointer, result = [], agreement = null) {
    if (currentPointer) {
      const element = await this.evaluateNode(currentPointer, agreement);
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

  async evaluateNode(node, inheritedAgreement) {
    const element = {
      nodeId: node.id,
    };

    if (node.frozen && node.evaluatedResult) {
      element.result = cloneDeep(node.evaluatedResult);
      return element;
    }

    const generatorNode = this.graph.getGeneratorFrom(node);
    const agreementNode = this.graph
      .getAgreementNodesOf(node)
      .find(agNode => !!agNode.evaluatedResult);

    let agreement = inheritedAgreement;
    if (agreementNode && agreementNode.evaluatedResult) {
      if (agreementNode.evaluatedResult instanceof Array) {
        agreement = agreementNode.evaluatedResultAgreement;
      } else {
        agreement = agreementNode.evaluatedResult.agreement;
      }
    }

    if (generatorNode) {
      element.result = await this.run(generatorNode, [], agreement);
      node.evaluatedResult = element.result;
      node.evaluatedResultAgreement = combineAgreements(
        element.result[0].result.agreement,
        agreement,
      );
    } else {
      element.result = await node.evaluate(agreement);
      // console.log(agreement);
      node.evaluatedResult = {
        ...element.result,
        agreement: combineAgreements(
          element.result ? element.result.agreement : null,
          agreement,
        ),
      };
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
      node.evaluatedResultAgreement = null;
    });
  }
}

export default GraphEvaluator;
