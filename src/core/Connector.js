class Connector {
  constructor(type, direction, node, key, input = null) {
    this.type = type;
    this.direction = direction;
    this.node = node;
    this.key = key;
    this.input = input;
  }

  toJSON() {
    return {
      type: this.type,
      direction: this.direction,
      nodeId: this.node.id,
      key: this.key,
    };
  }
}

export default Connector;
