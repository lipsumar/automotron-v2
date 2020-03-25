import CommandInvoker from './CommandInvoker';
import GraphUi from '../ui/GraphUi';
import EdgeUi from '../ui/EdgeUi';
import { hasIntersection } from '../ui/utils';
import MouseNode from '../ui/MouseNode';

class EditorUi {
  constructor(graphUiEl, graph, actions) {
    const graphUi = new GraphUi(graphUiEl, graph, {
      editable: true,
    });
    this.mouseNode = new MouseNode(graphUi.stage);

    this.graphUi = graphUi;
    this.actions = actions;
    this.commandInvoker = new CommandInvoker(graph, graphUi);

    this.activeNodeEditId = null;

    graphUi.nodes.forEach(this.setupNode.bind(this));
    graphUi.on('node:created', this.setupNode.bind(this));
  }

  setupNode(uiNode) {
    let edgeToMouse = null;
    uiNode.on('newEdgeToMouse:start', fromUiNode => {
      const uiEdge = new EdgeUi(fromUiNode, this.mouseNode);
      this.graphUi.setupEdge(uiEdge);
      edgeToMouse = uiEdge;
    });
    uiNode.on('newEdgeToMouse:move', () => {
      const onUiNode = this.mouseOnInlet();
      if (onUiNode) {
        edgeToMouse.setTo(onUiNode);
      } else {
        edgeToMouse.setTo(this.mouseNode);
      }
      this.graphUi.draw();
    });
    uiNode.on('newEdgeToMouse:finish', () => {
      const onUiNode = this.mouseOnInlet();
      if (onUiNode) {
        this.commandInvoker.execute('linkNode', {
          fromNodeId: uiNode.node.id,
          toNodeId: onUiNode.node.id,
          uiEdge: edgeToMouse,
        });
        console.log('connect', onUiNode.node);
        return;
      }
      this.commandInvoker.execute('createNode', {
        value: 'aaah!',
        ui: {
          x: this.mouseNode.inletX(), // vite fait
          y: this.mouseNode.inletY() - 20,
        },
        fromUiEdge: edgeToMouse,
      });
    });
    uiNode.on('drag:finish', () => {
      this.commandInvoker.execute('moveNode', {
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

  mouseOnInlet() {
    const mouseRect = {
      x: this.mouseNode.inletX() - 2,
      y: this.mouseNode.inletY() - 2,
      width: 4,
      height: 4,
    };
    return this.graphUi.nodes.find(uiNode => {
      if (!uiNode.inletX) return false;

      const inletRect = {
        x: uiNode.inletX() - 20,
        y: uiNode.inletY() - 10,
        width: 20,
        height: 20,
      };

      return hasIntersection(mouseRect, inletRect);
    });
  }
}

export default EditorUi;
