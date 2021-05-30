import cloneDeep from 'lodash.clonedeep';
import { pickRandom } from './utils';
import combineAgreements from './combineAgreements';
import asyncForEach from '../utils/asyncForEach';

class GraphEvaluator {
  constructor(graph) {
    this.graph = graph;
    this.returnStack = [];
  }

  async play() {
    this.resetNodesEvaluatedResult();
    this.resetNodes();
    this.returnStack = [];

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
  async run(currentPointer, result = [], agreement = null, returnStack = []) {
    if (currentPointer) {
      let element;
      try {
        element = await this.evaluateNode(
          currentPointer,
          agreement,
          returnStack,
        );
      } catch (err) {
        err.nodeId = err.nodeId || currentPointer.id;
        console.log('error ===>', err.nodeId, err);
        console.log(this.graph.getNode(err.nodeId));
        throw err;
      }

      result.push(element);
      const nextEdge = this.findNextEdge(currentPointer);
      if (nextEdge) {
        result.push({
          edge: true,
          result: nextEdge.evaluate(),
        });
        return this.run(nextEdge.to.node, result, null, returnStack);
      }
      const returnTo = returnStack.pop();
      return this.run(returnTo, result, null, returnStack);
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
  async evaluateNode(node, inheritedAgreement, returnStack) {
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

    if (node.evaluatedCount === 0) {
      const inputs = node.connectors.filter(c => c.input !== null);
      await asyncForEach(inputs, async input => {
        const inputGenerators = this.graph.getNodesToConnector(input);
        if (inputGenerators.length === 0) return;
        const result = await this.run(inputGenerators[0]);
        const value = result.results[0].result.text;
        node.setOption(input.input, value);
      });
      node.reset();
    }

    const generatorNode = this.graph.getGeneratorOf(node);
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
        const nonEvaluatedGeneratedAgreementNodeGenerator = this.graph.getGeneratorOf(
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
    } else {
      element.result = await node.evaluate(agreement);
    }

    if (node.returnTo()) {
      returnStack.push(node);
    }

    node.evaluatedResult = {
      ...element.result,
      agreement: combineAgreements(
        element.result ? element.result.agreement : null,
        agreement,
      ),
    };
    node.evaluatedCount += 1;

    if (node.evaluatedCount > 9000) {
      throw new Error('infinite loop');
    }

    return element;
  }

  findNextEdge(currentPointer) {
    const outConnector = currentPointer.getOutConnector();
    const edges = this.graph.getEdgesFromConnector(outConnector);
    if (edges.length === 0) {
      return null;
    }
    const edge = pickRandom(edges);

    return edge;
  }

  resetNodes() {
    this.graph.nodes.forEach(node => {
      node.reset();
    });
  }

  resetNodesEvaluatedResult() {
    this.graph.nodes.forEach(node => {
      node.evaluatedResult = null;
      node.evaluatedCount = 0;
    });
  }

  resetNodesEvaluatedResultAfter(startAtNode) {
    startAtNode.evaluatedResult = null;
    const nextEdges = this.graph.getEdgesFrom(startAtNode, 'flow');
    if (nextEdges.length > 0) {
      nextEdges.forEach(edge =>
        this.resetNodesEvaluatedResultAfter(edge.to.node),
      );
    }
  }
}

export default GraphEvaluator;
