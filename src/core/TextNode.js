import Node from './Node';

class TextNode extends Node {
  type = 'text';

  value;

  constructor(value = '') {
    super();
    this.value = value;
  }

  static fromJSON(json) {
    const textNode = new TextNode();
    textNode.value = json.value;
    return Node.fromJSON(json, textNode);
  }

  async evaluate() {
    return this.value;
  }
}

export default TextNode;
