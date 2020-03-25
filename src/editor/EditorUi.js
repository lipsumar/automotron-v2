import CommandInvoker from './CommandInvoker';
import GraphUi from '../ui/GraphUi';
import EdgeUi from '../ui/EdgeUi';

class EditorUi {
  constructor(graphUiEl, graph, actions) {
    const commandInvoker = new CommandInvoker();
    const graphUi = new GraphUi(graphUiEl, graph, {
      editable: true,
      executeCommand: (command, options) => {
        commandInvoker.execute(command, options);
      },
    });

    this.graphUi = graphUi;
    this.actions = actions;
    this.commandInvoker = commandInvoker;
    commandInvoker.graph = graph;
    commandInvoker.ui = graphUi;

    this.activeNodeEditId = null;

    graphUi.nodes.forEach(this.setupNode.bind(this));
    graphUi.on('node:created', this.setupNode.bind(this));
  }

  setupNode(uiNode) {
    let edgeToMouse = null;
    uiNode.on('newEdgeToMouse:start', fromUiNode => {
      const uiEdge = new EdgeUi(fromUiNode, this.mouseNode);
      this.setupEdge(uiEdge);
      edgeToMouse = uiEdge;
    });
    uiNode.on('newEdgeToMouse:finish', () => {
      this.executeCommand('createNode', {
        value: 'aaah!',
        ui: {
          x: this.mouseNode.inletX(), // vite fait
          y: this.mouseNode.inletY() - 20,
        },
        fromUiEdge: edgeToMouse,
      });
    });
    uiNode.on('drag:finish', () => {
      this.executeCommand('moveNode', {
        nodeId: uiNode.node.id,
        x: uiNode.group.x(),
        y: uiNode.group.y(),
      });
    });

    uiNode.on('edit:start', () => {
      this.activeNodeEditId = uiNode.node.id;
      this.actions.openNodeEditor(
        this.graphUi.getNodeBoundingBox(uiNode),
        uiNode.node.value,
      );
    });
    this.graphUi.stage.on('click', () => {
      if (this.activeNodeEditId) {
        const newValue = this.actions.getNodeEditorValue();
        this.commandInvoker.execute('setNodeValue', {
          nodeId: this.activeNodeEditId,
          value: newValue,
        });
        this.actions.closeNodeEditor();
        this.activeNodeEditId = null;
      }
    });

    uiNode.node.patchUi({
      width: uiNode.width,
      height: uiNode.height,
    });

    uiNode.on('resized', () => {
      uiNode.node.patchUi({
        width: uiNode.width,
        height: uiNode.height,
      });
    });
  }
}

export default EditorUi;
