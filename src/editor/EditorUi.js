import { EventEmitter } from 'events';
import { Rect } from 'konva';
import CommandInvoker from './CommandInvoker';
import GraphUi from '../ui/GraphUi';
import EdgeUi from '../ui/EdgeUi';
import { hasIntersection, distance } from '../ui/utils';
import MouseNode from '../ui/MouseNode';
import GeneratorEdgeUi from '../ui/GeneratorEdgeUi';

class EditorUi extends EventEmitter {
  constructor(graphUiEl, graph, actions) {
    super();
    const graphUi = new GraphUi(graphUiEl, graph, {
      editable: true,
    });
    this.mouseNode = new MouseNode(graphUi.stage);
    this.generatorEdgeToMouse = null;

    this.graphUi = graphUi;
    this.actions = actions;
    this.commandInvoker = new CommandInvoker(graph, graphUi);

    this.selection = [];

    this.activeNodeEditId = null;

    graphUi.nodes.forEach(this.setupNode.bind(this));
    graphUi.on('node:created', this.setupNode.bind(this));
    graphUi.edges.forEach(this.setupEdge.bind(this));
    graphUi.on('edge:created', this.setupEdge.bind(this));
    this.graphUi.stage.on('dblclick', () => {
      this.commandInvoker.execute('createNode', {
        value: 'oooh!',
        ui: {
          x: this.mouseNode.inletX(), // vite fait
          y: this.mouseNode.inletY() - 20,
        },
      });
    });

    let posAtMouseDown = null;
    this.graphUi.stage.on('mousedown', e => {
      if (e.evt.shiftKey) {
        this.initiateSelectZone();
      }
      posAtMouseDown = {
        x: this.mouseNode.centerX(),
        y: this.mouseNode.centerY(),
      };
    });

    this.graphUi.stage.on('click', () => {
      if (this.activeNodeEditId) {
        const uiNode = this.graphUi.getNode(this.activeNodeEditId);
        const newValue = this.actions.getNodeEditorValue();

        if (JSON.stringify(uiNode.node.value) !== JSON.stringify(newValue)) {
          this.commandInvoker.execute('setNodeValue', {
            nodeId: this.activeNodeEditId,
            value: newValue,
          });
        }

        this.actions.closeNodeEditor();
        this.activeNodeEditId = null;
        return;
      }

      if (this.generatorEdgeToMouse) {
        this.abortEdgeToGenerator();
      }
    });

    this.graphUi.stage.on('mousemove', () => {
      if (this.selectZone) {
        this.updateSelectZone();
      }
    });

    this.graphUi.stage.on('mouseup', () => {
      if (this.selectZone) {
        this.preventClick = true;
        this.finishSelectZone();
        return;
      }

      // real click is click where user doesn't move too much
      // between mousdown and mouseup
      if (
        distance(
          posAtMouseDown.x,
          posAtMouseDown.y,
          this.mouseNode.centerX(),
          this.mouseNode.centerY(),
        ) < 10
      ) {
        this.cancelSelection();
      }
    });
  }

  createNode() {
    this.commandInvoker.execute('createNode', {
      value: 'wow!',
      ui: {
        x: this.mouseNode.inletX(), // vite fait
        y: this.mouseNode.inletY() - 20,
      },
    });
  }

  removeNode(nodeId) {
    this.commandInvoker.execute('removeNode', { nodeId });
  }

  removeEdge(edgeId) {
    const fromUiNode = this.graphUi.getEdge(edgeId).from;
    this.commandInvoker.execute('removeEdge', { edgeId });
    this.graphUi.refreshNode(fromUiNode);
  }

  insertNode(edgeId) {
    this.commandInvoker.execute('insertNode', {
      edgeId,
      value: 'paf!',
      ui: {
        x: this.mouseNode.inletX(), // vite fait
        y: this.mouseNode.inletY() - 20,
      },
    });
  }

  initiateEdgeToGenerator(nodeId) {
    this.generatorEdgeToMouse = new GeneratorEdgeUi(
      this.graphUi.getNode(nodeId),
      this.mouseNode,
    );
    this.graphUi.setupEdge(this.generatorEdgeToMouse);
  }

  abortEdgeToGenerator() {
    this.generatorEdgeToMouse.destroy();
    this.generatorEdgeToMouse = null;
    this.graphUi.draw();
  }

  finishEdgeToGenerator(toNodeUi) {
    this.commandInvoker.execute('linkNode', {
      fromNodeId: this.generatorEdgeToMouse.from.node.id,
      toNodeId: toNodeUi.node.id,
      type: 'generator',
    });
  }

  initiateSelectZone() {
    const { stage } = this.graphUi;
    stage.draggable(false);
    this.selectZone = new Rect({
      x: this.mouseNode.centerX(),
      y: this.mouseNode.centerY(),
      width: 0,
      height: 0,
      fill: 'rgba(101, 168, 240, 0.21)',
    });
    this.graphUi.graphLayer.add(this.selectZone);
  }

  updateSelectZone() {
    this.selectZone.width(this.mouseNode.centerX() - this.selectZone.x());
    this.selectZone.height(this.mouseNode.centerY() - this.selectZone.y());
    this.graphUi.draw();
    const selectZoneBBox = this.selectZone.getClientRect();
    if (selectZoneBBox.width * selectZoneBBox.height < 100) {
      // prevent from unselecting everything with a tiny selection.
      // tiny selections happen by mistake when user moves a tiny bit between mousedown and mouseup
      return;
    }
    this.graphUi.nodes.forEach(uiNode => {
      if (hasIntersection(selectZoneBBox, uiNode.rect.getClientRect())) {
        this.addNodeToSelection(uiNode);
      } else {
        this.removeNodeFromSelection(uiNode);
      }
    });
  }

  finishSelectZone() {
    this.graphUi.stage.draggable(true);
    this.selectZone.destroy();
    this.selectZone = null;
    this.graphUi.draw();
  }

  setNodeTitle(nodeId, title) {
    this.commandInvoker.execute('setNodeTitle', {
      nodeId,
      title,
    });
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
      edgeToMouse.destroy();
      const onUiNode = this.mouseOnInlet();
      if (onUiNode) {
        this.commandInvoker.execute('linkNode', {
          fromNodeId: uiNode.node.id,
          toNodeId: onUiNode.node.id,
        });
        return;
      }
      this.commandInvoker.execute('createNode', {
        value: 'aaah!',
        ui: {
          x: this.mouseNode.inletX(), // vite fait
          y: this.mouseNode.inletY() - 20,
        },
        fromNodeId: uiNode.node.id,
      });
    });

    uiNode.on('drag:move', () => {
      const moveDelta = {
        x: uiNode.x() - uiNode.dragStartedAt.x,
        y: uiNode.y() - uiNode.dragStartedAt.y,
      };
      const otherNodes = this.selection.filter(
        item => item.isNode() && item.node.id !== uiNode.node.id,
      );
      if (otherNodes.length > 0) {
        otherNodes.forEach(otherUiNode => {
          if (!otherUiNode.posBeforeDrag) {
            // eslint-disable-next-line no-param-reassign
            otherUiNode.posBeforeDrag = {
              x: otherUiNode.x(),
              y: otherUiNode.y(),
            };
          }
          otherUiNode.move({
            x: otherUiNode.posBeforeDrag.x + moveDelta.x,
            y: otherUiNode.posBeforeDrag.y + moveDelta.y,
          });
        });
      }
    });

    uiNode.on('drag:finish', () => {
      const otherNodes = this.selection.filter(
        item => item.isNode() && item.node.id !== uiNode.node.id,
      );
      if (otherNodes) {
        otherNodes.forEach(otherUiNode => {
          otherUiNode.snapToGrid();
          // eslint-disable-next-line no-param-reassign
          otherUiNode.posBeforeDrag = null;
        });
      }
      this.commandInvoker.execute('moveNode', {
        nodeIds: [uiNode.node.id, ...otherNodes.map(uin => uin.node.id)],
        delta: {
          x: uiNode.x() - uiNode.dragStartedAt.x,
          y: uiNode.y() - uiNode.dragStartedAt.y,
        },
      });
    });

    uiNode.on('edit:start', () => {
      this.activeNodeEditId = uiNode.node.id;
      this.actions.openNodeEditor(
        this.graphUi.getNodeBoundingBox(uiNode),
        uiNode.node.value,
      );
    });

    uiNode.on('contextmenu', () => {
      this.emit('node:contextmenu', uiNode);
    });

    uiNode.on('click', e => {
      if (this.generatorEdgeToMouse) {
        this.finishEdgeToGenerator(uiNode);
        return;
      }

      if (e.evt.shiftKey) {
        if (!uiNode.selected) {
          this.addNodeToSelection(uiNode);
        } else {
          this.removeNodeFromSelection(uiNode);
        }
      } else {
        this.selectNode(uiNode);
      }

      e.cancelBubble = true;
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

  setupEdge(uiEdge) {
    uiEdge.on('contextmenu', () => {
      this.emit('edge:contextmenu', uiEdge);
    });
  }

  undo() {
    this.commandInvoker.undo();
  }

  redo() {
    this.commandInvoker.redo();
  }

  selectNode(uiNode) {
    this.cancelSelection();
    this.addNodeToSelection(uiNode);
  }

  addNodeToSelection(uiNode) {
    const nodeInSelection = this.selection.find(
      item => item.isNode() && item.node.id === uiNode.node.id,
    );

    if (!nodeInSelection) {
      uiNode.setSelected(true);
      this.selection.push(uiNode);
    }
  }

  removeNodeFromSelection(uiNode) {
    const newSelection = [];
    this.selection.forEach(item => {
      if (item.isNode() && item.node.id === uiNode.node.id) {
        uiNode.setSelected(false);
        return;
      }
      newSelection.push(item);
    });
    this.selection = newSelection;
  }

  cancelSelection() {
    this.selection.forEach(item => {
      item.setSelected(false);
    });
    this.selection = [];
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
        x: uiNode.inletX() - 15,
        y: uiNode.inletY() - 10,
        width: 20,
        height: 20,
      };

      return hasIntersection(mouseRect, inletRect);
    });
  }
}

export default EditorUi;
