import Node from './Node';

class ParagraphNode extends Node {
  constructor(value, opts = {}) {
    super(value, opts);
    this.flowInlet = this.registerConnector('flow', 'in', 'flowInlet');
    this.flowOutlets = [this.registerConnector('flow', 'out', 'flowOutlet_0')];
    this.nextOutletIndex = 1;
    this.currentOutletIndex = 0;
  }

  addOutlet() {
    this.flowOutlets.push(
      this.registerConnector(
        'flow',
        'out',
        `flowOutlet_${this.nextOutletIndex}`,
      ),
    );
    this.nextOutletIndex += 1;
  }

  returnTo() {
    return this.currentOutletIndex < this.flowOutlets.length;
  }

  reset() {
    this.currentOutletIndex = 0;
  }

  getOutConnector() {
    return this.flowOutlets[
      this.currentOutletIndex === 0 ? 0 : this.currentOutletIndex - 1
    ];
  }

  async evaluate() {
    this.currentOutletIndex += 1;
    if (this.currentOutletIndex > this.flowOutlets.length) {
      this.currentOutletIndex = 1;
    }
    return null;
  }
}

export default ParagraphNode;
