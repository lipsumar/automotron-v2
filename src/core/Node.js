import Connector from './Connector';

class Node {
  id = null;

  ui = null;

  type = null;

  connectors = [];

  constructor(value, opts = {}) {
    this.value = typeof value === 'string' ? [{ text: value }] : value;
    this.title = opts.title || null;
  }

  static fromJSON(json, node = new Node()) {
    node.setId(json.id);
    node.setUi(json.ui);
    return node;
  }

  toJSON() {
    return { type: this.type, id: this.id, ui: this.ui };
  }

  registerConnector(type, direction, key) {
    const connector = new Connector(type, direction, this, key);
    if (this.getConnector(key)) {
      throw new Error('connector key must be unique');
    }
    this.connectors.push(connector);
    return connector;
  }

  getConnector(key) {
    return this.connectors.find(connector => connector.key === key);
  }

  returnTo() {
    return false;
  }

  reset() {}

  setId(id) {
    this.id = id;
  }

  setUi(ui) {
    this.ui = ui;
  }

  patchUi(partialUi) {
    this.ui = { ...this.ui, ...partialUi };
  }
}

export default Node;
