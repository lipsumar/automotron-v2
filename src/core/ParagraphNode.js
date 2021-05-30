import Node from './Node';

class ParagraphNode extends Node {
  type = 'paragraph';

  constructor(value, opts = {}) {
    super(value, opts);
    this.flowInlet = this.registerConnector('flow', 'in', 'flowInlet');
    this.flowOutlets = [
      this.registerConnector('flow', 'out', 'flowOutlet_0'),
      this.registerConnector('flow', 'out', 'flowOutlet_1'),
      this.registerConnector('flow', 'out', 'flowOutlet_2'),
    ];
    this.nextOutletIndex = 3;
    this.currentOutletIndex = 0;
  }

  static fromJSON(json) {
    const paragraphNode = new ParagraphNode(null);
    json.outletKeys.forEach(key => {
      if (!paragraphNode.getConnector(key)) {
        paragraphNode.addOutlet();
      }
    });
    return Node.fromJSON(json, paragraphNode);
  }

  toJSON() {
    const json = Node.prototype.toJSON.call(this);
    return {
      ...json,
      outletKeys: this.flowOutlets.map(outlet => outlet.key),
    };
  }

  addOutlet() {
    const newOutlet = this.registerConnector(
      'flow',
      'out',
      `flowOutlet_${this.nextOutletIndex}`,
    );
    this.flowOutlets.push(newOutlet);
    this.nextOutletIndex += 1;
    return newOutlet;
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
