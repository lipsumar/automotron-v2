class Node {
  id = null;

  ui = null;

  type = null;

  static fromJSON(json, node = new Node()) {
    node.setId(json.id);
    node.setUi(json.ui);
    return node;
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
