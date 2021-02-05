import { EventEmitter } from 'events';
import { Rect } from 'konva';
import CommandInvoker from './CommandInvoker';
import GraphUi from '../ui/GraphUi';
import EdgeUi from '../ui/EdgeUi';
import { hasIntersection, distance } from '../ui/utils';
import MouseNode from '../ui/MouseNode';
import GeneratorEdgeUi from '../ui/GeneratorEdgeUi';
import AgreementEdgeUi from '../ui/AgreementEdgeUi';

const EdgeByType = {
  flow: EdgeUi,
  generator: GeneratorEdgeUi,
  agreement: AgreementEdgeUi,
};

class EditorUi extends EventEmitter {
  constructor(graphUiEl, graph, actions) {
    super();
    this.editable = window.document.body.offsetWidth > 768;
    const graphUi = new GraphUi(graphUiEl, graph, {
      editable: this.editable,
    });
    this.mouseNode = new MouseNode(graphUi.stage);
    this.generatorEdgeToMouse = null;

    this.graphUi = graphUi;
    this.actions = actions;
    this.commandInvoker = new CommandInvoker(graph, graphUi);

    this.selection = [];

    this.commandInvoker.on('command', () => {
      this.emit('graph:change');
      this.actions.onChange();
    });

    graphUi.nodes.forEach(this.setupNode.bind(this));
    graphUi.on('node:created', this.setupNode.bind(this));
    graphUi.edges.forEach(this.setupEdge.bind(this));
    graphUi.on('edge:created', this.setupEdge.bind(this));

    if (this.editable) {
      this.graphUi.stage.on('dblclick', e => {
        if (e.evt.button === 2) return;
        this.commandInvoker.execute('createNode', {
          type: 'text',
          text: '',
          ui: {
            x: this.mouseNode.inletX(), // vite fait
            y: this.mouseNode.inletY() - 20,
          },
        });
      });
    }

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
      if (this.generatorEdgeToMouse) {
        this.abortEdgeToGenerator();
        return;
      }

      if (this.agreementEdgeToMouse) {
        this.abortEdgeToAgreement();
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

  createNode(options) {
    this.commandInvoker.execute('createNode', {
      type: 'text',
      text: '',
      ui: {
        x: this.mouseNode.inletX(), // vite fait
        y: this.mouseNode.inletY() - 20,
      },
      ...options,
    });
  }

  removeNode(nodeId) {
    this.removeNodeFromSelection(this.graphUi.getNode(nodeId));
    this.commandInvoker.execute('removeNode', { nodeId });
  }

  removeEdge(edgeId) {
    const fromUiNode = this.graphUi.getEdge(edgeId).from;
    this.commandInvoker.execute('removeEdge', { edgeId });
    this.graphUi.refreshNode(fromUiNode);
  }

  toggleEdgeSpace(edgeId) {
    this.commandInvoker.execute('toggleEdgeSpace', { edgeId });
  }

  insertNode(edgeId) {
    this.commandInvoker.execute('insertNode', {
      edgeId,
      text: '',
      ui: {
        x: this.mouseNode.inletX(), // vite fait
        y: this.mouseNode.inletY() - 20,
      },
    });
  }

  setNodeValue(nodeId, newValue) {
    const uiNode = this.graphUi.getNode(nodeId);
    if (!uiNode) return;

    if (JSON.stringify(uiNode.node.value) !== JSON.stringify(newValue)) {
      this.commandInvoker.execute('setNodeValue', {
        nodeId,
        value: newValue,
      });
    }
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

  initiateEdgeToAgreement(nodeId) {
    this.agreementEdgeToMouse = new AgreementEdgeUi(
      this.graphUi.getNode(nodeId),
      this.mouseNode,
    );
    this.graphUi.setupEdge(this.agreementEdgeToMouse);
  }

  abortEdgeToAgreement() {
    this.agreementEdgeToMouse.destroy();
    this.agreementEdgeToMouse = null;
    this.graphUi.draw();
  }

  finishEdgeToAgreement(toNodeUi) {
    this.commandInvoker.execute('linkNode', {
      fromNodeId: this.agreementEdgeToMouse.from.node.id,
      toNodeId: toNodeUi.node.id,
      type: 'agreement',
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

  freezeNode(nodeId) {
    this.commandInvoker.execute('freezeNode', {
      nodeId,
    });
  }

  unfreezeNode(nodeId) {
    this.commandInvoker.execute('unfreezeNode', {
      nodeId,
    });
  }

  centerGraph() {
    this.graphUi.centerGraph();
    this.graphUi.draw();
  }

  setNodeError(nodeId, error) {
    this.graphUi.setNodeError(nodeId, error);
  }

  resetNodeErrors() {
    this.graphUi.resetNodeErrors();
  }

  zoomIn() {
    this.graphUi.zoomIn();
  }

  zoomOut() {
    this.graphUi.zoomOut();
  }

  setupNode(uiNode) {
    let edgeToMouse = null;
    uiNode.on('newEdgeToMouse:start', ({ fromConnectorUi }) => {
      const uiEdge = new EdgeByType[fromConnectorUi.connector.type](
        fromConnectorUi,
        this.mouseNode.connector,
      );
      this.graphUi.setupEdge(uiEdge);
      edgeToMouse = uiEdge;
    });
    uiNode.on('newEdgeToMouse:move', ({ fromConnectorUi }) => {
      const onInletUi = this.mouseOnInlet(
        fromConnectorUi.connector.type,
        uiNode,
      );
      if (onInletUi) {
        edgeToMouse.setTo(onInletUi);
        edgeToMouse.position();
      } else {
        edgeToMouse.setTo(this.mouseNode.connector);
      }
    });
    uiNode.on('newEdgeToMouse:finish', ({ fromConnectorUi }) => {
      edgeToMouse.destroy();
      const onInletUi = this.mouseOnInlet(
        fromConnectorUi.connector.type,
        uiNode,
      );
      if (onInletUi) {
        this.commandInvoker.execute('linkNode', {
          from: {
            nodeId: fromConnectorUi.connector.node.id,
            key: fromConnectorUi.connector.key,
          },
          to: {
            nodeId: onInletUi.nodeUi.node.id,
            key: onInletUi.connector.key,
          },
        });
        return;
      }
      if (fromConnectorUi.connector.type !== 'flow') return;
      this.commandInvoker.execute('createNode', {
        type: 'text',
        text: '',
        ui: {
          x: this.mouseNode.inletX(), // vite fait
          y: this.mouseNode.inletY() - 20,
        },
        from: {
          nodeId: fromConnectorUi.connector.node.id,
          key: fromConnectorUi.connector.key,
        },
      });
    });

    uiNode.on('drag:start', () => {
      if (!this.isNodeSelected(uiNode)) {
        this.selectNode(uiNode);
      }
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
      if (uiNode.node.type === 'graph') {
        return;
      }
      this.actions.openNodeEditor(
        this.graphUi.getNodeBoundingBox(uiNode),
        uiNode.node,
      );
    });

    uiNode.on('contextmenu', () => {
      this.selectNode(uiNode);
      this.emit('node:contextmenu', uiNode);
    });

    uiNode.on('click', e => {
      if (this.generatorEdgeToMouse) {
        this.finishEdgeToGenerator(uiNode);
        return;
      }

      if (this.agreementEdgeToMouse) {
        this.finishEdgeToAgreement(uiNode);
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

  isNodeSelected(uiNode) {
    return !!this.selection.find(item => item.node.id === uiNode.node.id);
  }

  mouseOnInlet(type, exceptUiNode) {
    const mouseRect = {
      x: this.mouseNode.point.x - 2,
      y: this.mouseNode.point.y - 2,
      width: 4,
      height: 4,
    };
    const node = this.graphUi.nodes.find(uiNode => {
      if (
        uiNode.node.type === 'start' ||
        uiNode.node.id === exceptUiNode.node.id
      )
        return false;

      const inlet = uiNode.getInletOfType(type);
      if (!inlet) return false;

      const inletPos = inlet.getAbsolutePosition();
      const hitBox = inlet.hitBox();
      const inletRect = {
        x: inletPos.x - hitBox.width / 2,
        y: inletPos.y - hitBox.height / 2,
        width: hitBox.width,
        height: hitBox.height,
      };

      return hasIntersection(mouseRect, inletRect);
    });
    return node ? node.getInletOfType(type) : null;
  }
}

export default EditorUi;
