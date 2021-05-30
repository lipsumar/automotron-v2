import Command from './Command';

class ResizeParagraph extends Command {
  execute() {
    const { graph, ui, options } = this;
    const { nodeId, append } = options;
    const node = graph.getNode(nodeId);

    if (append) {
      const newOutlet = node.addOutlet();
      ui.getNode(node.id).addOutlet(newOutlet);
      ui.getNode(node.id).refresh();
    }
  }

  undo() {
    const { graph, ui } = this;
    // @todo
  }
}

export default ResizeParagraph;
