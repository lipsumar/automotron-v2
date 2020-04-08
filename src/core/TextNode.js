import Node from './Node';
import { pickRandom } from './utils';
import filterAgreement from './filterAgreement';

class TextNode extends Node {
  type = 'text';

  value;

  title;

  frozen = false;

  constructor(value = [], opts = {}) {
    super();
    this.value = value;
    this.title = opts.title;
  }

  static fromJSON(json) {
    let { value } = json;
    if (typeof value[0] === 'string') {
      value = value.map(text => ({ text }));
    }
    const textNode = new TextNode(value, { title: json.title });
    if (json.frozen) {
      textNode.frozen = true;
    }

    return Node.fromJSON(json, textNode);
  }

  async evaluate(agreement = null) {
    const possibleValues = filterAgreement(this.value, agreement);
    return pickRandom(possibleValues);
  }
}

export default TextNode;
