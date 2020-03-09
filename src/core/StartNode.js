import Node from './Node';

class StartNode extends Node {
  type = 'start';

  async evaluate() {
    return null;
  }
}

export default StartNode;
