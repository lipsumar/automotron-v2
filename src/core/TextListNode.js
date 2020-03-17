import Node from './Node';
import { pickRandom } from './utils';

class TextListNode extends Node {
  type = 'text-list';

  values;

  title;

  constructor(values = [''], opts = {}) {
    super();
    this.values = values;
    this.title = opts.title;
  }

  static fromJSON(json) {
    const textNode = new TextListNode();
    textNode.values = json.values;
    textNode.title = json.title;
    return Node.fromJSON(json, textNode);
  }

  async evaluate() {
    return pickRandom(this.values);
  }
}

export default TextListNode;
