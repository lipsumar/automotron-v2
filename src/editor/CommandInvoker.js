import CreateNodeCommand from './commands/CreateNode';
import MoveNodeCommand from './commands/MoveNode';
import SetNodeValueCommand from './commands/SetNodeValue';
import LinkNodeCommand from './commands/LinkNode';
import RemoveNodeCommand from './commands/RemoveNode';
import RemoveEdgeCommand from './commands/RemoveEdge';
import InsertNodeCommand from './commands/InsertNode';
import SetNodeTitleCommand from './commands/SetNodeTitle';
import FreezeNodeCommand from './commands/FreezeNode';

const commands = {
  createNode: CreateNodeCommand,
  moveNode: MoveNodeCommand,
  setNodeValue: SetNodeValueCommand,
  linkNode: LinkNodeCommand,
  removeNode: RemoveNodeCommand,
  removeEdge: RemoveEdgeCommand,
  insertNode: InsertNodeCommand,
  setNodeTitle: SetNodeTitleCommand,
  freezeNode: FreezeNodeCommand,
};

class CommandInvoker {
  graph;

  ui;

  constructor(graph, ui) {
    this.graph = graph;
    this.ui = ui;
    this.undoStack = [];
    this.redoStack = [];
  }

  execute(commandKey, options) {
    if (!commands[commandKey]) {
      throw new Error(`unsupported command "${commandKey}"`);
    }
    console.log(`[COMMAND] ${commandKey}`, options);
    const command = new commands[commandKey](this.graph, this.ui, options);
    command.execute();
    this.ui.draw();
    this.redoStack = [];
    this.undoStack.push(command);
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const command = this.undoStack.pop();
    console.log(`[UNDO COMMAND] `, command.options);
    command.undo();
    this.ui.draw();
    this.redoStack.push(command);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const command = this.redoStack.pop();
    command.redo();
    this.ui.draw();
    this.undoStack.push(command);
  }
}

export default CommandInvoker;
