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

  /**
   *
   * @param {Node} currentPointer
   * @param {Array} result
   * @param {agreement} agreement
   * @returns {results: []}
   */
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
    return { results: result };
  }

  /**
   *
   * @param {Node} node
   * @param {agreement} inheritedAgreement
   * @returns {
   *  {
   *    nodeId: Number,
   *    result: {
   *      text?: string,
   *      results?: string,
   *      agreement: agreement
   *    }
   *  }
   * }
   */
  async evaluateNode(node, inheritedAgreement) {
    const element = {
      nodeId: node.id,
    };

    if (node.frozen && node.evaluatedResult) {
      element.result = cloneDeep(node.evaluatedResult);
      return element;
    }

    if (node.evaluatedResult) {
      // evaluating node for a second time
      this.resetNodesEvaluatedResultAfter(node);
    }

    const generatorNode = this.graph.getGeneratorFrom(node);
    let agreementNode = this.graph
      .getAgreementNodesOf(node)
      .find(agNode => !!agNode.evaluatedResult);

    if (!agreementNode) {
      // retry with generator of non-evaluated agreement node
      const nonEvaluatedGeneratedAgreementNode = this.graph
        .getAgreementNodesOf(node)
        .find(
          agNode =>
            this.graph.isNodeGenerated(agNode) && !agNode.evaluatedResult,
        );
      if (nonEvaluatedGeneratedAgreementNode) {
        const nonEvaluatedGeneratedAgreementNodeGenerator = this.graph.getGeneratorFrom(
          nonEvaluatedGeneratedAgreementNode,
        );
        if (
          nonEvaluatedGeneratedAgreementNodeGenerator.evaluatedResult &&
          nonEvaluatedGeneratedAgreementNodeGenerator.frozen
        ) {
          agreementNode = nonEvaluatedGeneratedAgreementNodeGenerator;
        }
      }
    }

    const agreement =
      agreementNode && agreementNode.evaluatedResult
        ? agreementNode.evaluatedResult.agreement
        : inheritedAgreement;

    if (generatorNode) {
      element.result = await this.run(generatorNode, [], agreement);
      // copy the first agreement of results as agreement of the result
      element.result.agreement = element.result.results[0].result.agreement;
      node.evaluatedResult = {
        ...element.result,
        agreement: combineAgreements(
          element.result.results[0].result.agreement,
          agreement,
        ),
      };
    } else {
      element.result = await node.evaluate(agreement);
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
    });
  }

  resetNodesEvaluatedResultAfter(startAtNode) {
    startAtNode.evaluatedResult = null;
    const nextEdges = this.graph.getEdgesFrom(startAtNode, 'default');
    if (nextEdges.length > 0) {
      nextEdges.forEach(edge => this.resetNodesEvaluatedResultAfter(edge.to));
    }
  }
}

export default GraphEvaluator;
