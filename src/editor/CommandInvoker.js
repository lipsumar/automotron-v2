import CreateNodeCommand from './commands/CreateNode';
import MoveNodeCommand from './commands/MoveNode';
import SetNodeValueCommand from './commands/SetNodeValue';
import LinkNodeCommand from './commands/LinkNode';

const commands = {
  createNode: CreateNodeCommand,
  moveNode: MoveNodeCommand,
  setNodeValue: SetNodeValueCommand,
  linkNode: LinkNodeCommand,
};

class CommandInvoker {
  graph;

  ui;

  constructor(graph, ui) {
    this.graph = graph;
    this.ui = ui;
  }

  execute(commandKey, options) {
    if (!commands[commandKey]) {
      throw new Error(`unsupported command "${commandKey}"`);
    }
    console.log(`[COMMAND] ${commandKey}`, options);
    const command = new commands[commandKey](this.graph, this.ui, options);
    command.execute();
  }
}

export default CommandInvoker;
