import Node from './Node';

class TextNode extends Node {
  type = 'text';

  value = '';

  static fromJSON(json) {
    const textNode = new TextNode();
    return Node.fromJSON(json, textNode);
  }
}

export default TextNode;
