import cloneDeep from 'lodash.clonedeep';
import { pickRandom } from './utils';
import combineAgreements from './combineAgreements';

class GraphEvaluator {
  constructor(graph) {
    this.graph = graph;
    this.loopStack = [];
  }

  async play() {
    this.resetNodesEvaluatedResult();
    this.loopStack = [];

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
      let element;
      try {
        element = await this.evaluateNode(currentPointer, agreement);
      } catch (err) {
        err.nodeId = err.nodeId || currentPointer.id;
        console.log('error ===>', err.nodeId, err);
        throw err;
      }

      result.push(element);

      const nextEdge =
        currentPointer.type === 'loop'
          ? this.findNextEdge(
              currentPointer,
              currentPointer.endReached() ? 'exit' : 'default',
            )
          : this.findNextEdge(currentPointer);

      if (nextEdge) {
        result.push({
          edge: true,
          result: nextEdge.evaluate(),
        });
        return this.run(nextEdge.to, result);
      }
      const returnTo = this.loopStack.pop();
      return this.run(returnTo, result);
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

    if (generatorNode && node.type === 'text') {
      element.result = await this.run(generatorNode, [], agreement);
      // copy the first agreement of results as agreement of the result
      element.result.agreement = element.result.results[0].result.agreement;
      // node.evaluatedResult = {
      //   ...element.result,
      //   agreement: combineAgreements(
      //     element.result.results[0].result.agreement,
      //     agreement,
      //   ),
      // };
    } else if (node.type === 'loop') {
      if (generatorNode && !node.evaluatedResult) {
        node.evaluatedResult = await this.run(generatorNode, []);
      }
      let maxCount = node.maxCount();
      if (node.evaluatedResult) {
        maxCount = parseInt(node.evaluatedResult.results[0].result.text, 10);
      }

      node.loop();
      if (!node.endReached(maxCount)) {
        this.loopStack.push(node);
      }
    } else {
      element.result = await node.evaluate(agreement);
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

  findNextEdge(currentPointer, fromOutlet = 'default') {
    const edges = this.graph.getEdgesFrom(
      currentPointer,
      'default',
      fromOutlet,
    );
    if (edges.length === 0) {
      return null;
    }
    const edge = pickRandom(edges);

    return edge;
  }

  resetNodesEvaluatedResult() {
    this.graph.nodes.forEach(node => {
      node.evaluatedResult = null;
      node.evaluatedCount = 0;
      node.reset();
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
