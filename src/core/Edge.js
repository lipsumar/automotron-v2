class Edge {
  from = null;

  to = null;

  type = null;

  id;

  space = true;

  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  /**
   * Returns true if node is connected from OR to this edge
   * @param {Node} node
   */
  isConnectedToNode(node) {
    return this.from.node.id === node.id || this.to.node.id === node.id;
  }

  isFromNode(node) {
    return this.from.node.id === node.id;
  }

  isToNode(node) {
    return this.to.node.id === node.id;
  }

  setId(id) {
    this.id = id;
  }

  toggleSpace() {
    this.space = !this.space;
  }

  evaluate() {
    return this.space ? ' ' : '';
  }

  toJSON() {
    return {
      from: this.from.toJSON(),
      to: this.to.toJSON(),
      type: this.type,
      space: this.space,
      id: this.id,
    };
  }
}

export default Edge;
