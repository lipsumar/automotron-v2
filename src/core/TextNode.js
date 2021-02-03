import cloneDeep from 'lodash.clonedeep';
import Node from './Node';
import { pickRandom } from './utils';
import filterAgreement from './filterAgreement';

class TextNode extends Node {
  type = 'text';

  value;

  title;

  frozen = false;

  flowInlet;

  flowOutlet;

  generatorInlet;

  generatorOutlet;

  agreementConnector;

  constructor(value = [], opts = {}) {
    super(value, opts);

    this.flowInlet = this.registerConnector('flow', 'in', 'flowInlet');
    this.flowOutlet = this.registerConnector('flow', 'out', 'flowOutlet');

    this.generatorInlet = this.registerConnector(
      'generator',
      'in',
      'generatorInlet',
    );
    this.generatorOutlet = this.registerConnector(
      'generator',
      'out',
      'generatorOutlet',
    );

    this.agreementConnector = this.registerConnector(
      'agreement',
      'in-out',
      'agreementConnector',
    );
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

  toJSON() {
    const json = Node.prototype.toJSON.call(this);
    return {
      ...json,
      value: cloneDeep(this.value),
      title: this.title,
      frozen: this.frozen,
    };
  }

  getOutConnector() {
    return this.flowOutlet;
  }

  async evaluate(agreement = null) {
    const possibleValues = filterAgreement(this.value, agreement);
    if (possibleValues.length === 0) {
      console.log('given', agreement);
      throw new Error('impossible agreement');
    }
    return pickRandom(possibleValues);
  }
}

export default TextNode;
