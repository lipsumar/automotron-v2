import Node from './Node';

class LoopNode extends Node {
  type = 'loop';

  constructor(value = [], options = {}) {
    super();
    this.count = 0;
    if (value.length === 0) {
      value = [{ text: '3' }];
    }
    this.value = value;
    // this.maxCount = parseInt(value[0].text, 10);
  }

  static fromJSON(json) {
    const { value } = json;
    const loopNode = new LoopNode(value);
    return Node.fromJSON(json, loopNode);
  }

  reset() {
    this.count = 0;
  }

  loop() {
    this.count += 1;
  }

  endReached(maxCount = null) {
    return this.count === (maxCount || this.maxCount()) + 1;
  }

  maxCount() {
    return parseInt(this.value[0].text, 10);
  }

  evaluate() {
    return null;
  }
}

export default LoopNode;
