import Node from './Node';
import { pickRandom } from './utils';

class LoopNode extends Node {
  type = 'loop';

  constructor(value, opts = {}) {
    super(value, opts);
    this.loopOutlet = this.registerConnector('flow', 'out', 'loopOutlet');
    this.exitOutlet = this.registerConnector('flow', 'out', 'exitOutlet');
    this.flowInlet = this.registerConnector('flow', 'in', 'flowInlet');
    this.currentCount = 0;
    this.maxCount = null;
  }

  getOutConnector() {
    return this.currentCount <= this.maxCount
      ? this.loopOutlet
      : this.exitOutlet;
  }

  chooseMaxCount() {
    this.maxCount = parseInt(pickRandom(this.value).text, 10);
  }

  returnTo() {
    return this.currentCount <= this.maxCount;
  }

  reset() {
    this.maxCount = null;
    this.currentCount = 0;
  }

  async evaluate() {
    if (!this.maxCount) {
      this.chooseMaxCount();
    }
    if (this.currentCount > this.maxCount) {
      this.currentCount = 0;
    }
    this.currentCount += 1;

    return null;
  }
}

export default LoopNode;
