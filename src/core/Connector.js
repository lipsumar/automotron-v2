class Connector {
  constructor(type, direction, node, key) {
    this.type = type;
    this.direction = direction;
    this.node = node;
    this.key = key;
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
