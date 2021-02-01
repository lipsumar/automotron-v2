import Node from './Node';

class StartNode extends Node {
  type = 'start';

  constructor() {
    super();
    this.flowOutlet = this.registerConnector('flow', 'out', 'flowOutlet');
  }

  async evaluate() {
    return null;
  }
}

export default StartNode;
