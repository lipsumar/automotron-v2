class Command {
  constructor(graph, ui, options) {
    this.graph = graph;
    this.ui = ui;
    this.options = options;
  }

  redo() {
    this.execute();
  }
}

export default Command;
