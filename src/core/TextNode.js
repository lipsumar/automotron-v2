import Node from './Node';
import { pickRandom } from './utils';

class TextNode extends Node {
  type = 'text';

  value;

  title;

  constructor(value = [], opts = {}) {
    super();
    this.value = typeof value === 'string' ? [value] : value;
    this.title = opts.title;
  }

  static fromJSON(json) {
    const textNode = new TextNode(json.value, { title: json.title });
    return Node.fromJSON(json, textNode);
  }

  async evaluate() {
    return pickRandom(this.value);
  }
}

export default TextNode;
