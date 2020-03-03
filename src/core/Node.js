class Node {
  id = null;

  ui = null;

  type = null;

  static fromJSON(json, node = new Node()) {
    node.setId(json.id);
    node.setUi(json.ui);
    return node;
  }

  setId(id) {
    this.id = id;
  }

  setUi(ui) {
    this.ui = ui;
  }
}

export default Node;
