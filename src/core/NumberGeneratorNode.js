import { randomInt } from './utils';

const { default: Node } = require('./Node');

class NumberGeneratorNode extends Node {
  type = 'number';

  constructor(value, opts = {}) {
    super(value, opts);
    this.min = opts.min || 1;
    this.max = opts.max || 10;
    this.isRandom = opts.isRandom;
    this.current = this.min;

    this.flowInlet = this.registerConnector('flow', 'in', 'flowInlet');
    this.flowOutlet = this.registerConnector('flow', 'out', 'flowOutlet');
    this.generatorOutlet = this.registerConnector(
      'generator',
      'out',
      'generatorOutlet',
    );
    this.minInlet = this.registerConnector(
      'generator',
      'in',
      'minInlet',
      'min',
    );
    this.maxInlet = this.registerConnector(
      'generator',
      'in',
      'maxInlet',
      'max',
    );
  }

  static fromJSON(json) {
    const { min, max, isRandom } = json;
    const textNode = new NumberGeneratorNode(null, { min, max, isRandom });
    return Node.fromJSON(json, textNode);
  }

  toJSON() {
    const json = Node.prototype.toJSON.call(this);
    return {
      ...json,
      min: this.min,
      max: this.max,
      isRandom: this.isRandom,
    };
  }

  getOutConnector() {
    return this.flowOutlet;
  }

  reset() {
    this.current = this.min;
  }

  setOption(key, value) {
    switch (key) {
      case 'min':
        this.min = parseInt(value, 10);
        break;
      case 'max':
        this.max = parseInt(value, 10);
        break;
      default:
        throw new Error('unknown option');
    }
  }

  async evaluate() {
    if (this.isRandom) {
      return { text: randomInt(this.min, this.max).toString() };
    }
    const value = this.current;
    this.current += 1;
    if (this.current > this.max) {
      this.current = this.min;
    }
    return { text: value.toString() };
  }
}

export default NumberGeneratorNode;
