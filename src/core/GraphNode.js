import Node from './Node';

class GraphNode extends Node {
  type = 'graph';

  static fromJSON(json) {
    const { value } = json;
    const graphNode = new GraphNode(value, { title: json.title });
    if (json.frozen) {
      graphNode.frozen = true;
    }

    return Node.fromJSON(json, graphNode);
  }
}

export default GraphNode;
