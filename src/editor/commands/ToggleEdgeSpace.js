import Command from './Command';

class ToggleEdgeSpaceCommand extends Command {
  execute() {
    const { ui, options } = this;
    const uiEdge = ui.getEdge(options.edgeId);
    uiEdge.edge.toggleSpace();
    uiEdge.refresh();
    ui.draw();
  }

  undo() {
    this.execute();
  }
}

export default ToggleEdgeSpaceCommand;
