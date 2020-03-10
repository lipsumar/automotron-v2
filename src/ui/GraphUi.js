import { Stage, Layer } from 'konva';
import throttle from 'lodash.throttle';
import { EventEmitter } from 'events';
import MouseNode from './MouseNode';
import Grid from './Grid';
import StartNodeUi from './StartNodeUi';
import TextNodeUi from './TextNodeUi';
import EdgeUi from './EdgeUi';
import TextNode from '../core/TextNode';

const uiNodeTypes = {
  start: StartNodeUi,
  text: TextNodeUi,
};

class GraphUi extends EventEmitter {
  stage = null;

  gridLayer = null;

  graphLayer = null;

  nodes = [];

  constructor(stageEl, graph, opts = {}) {
    super();
    this.opts = opts;
    this.graph = graph;
    this.stage = new Stage({
      width: stageEl.offsetWidth,
      height: stageEl.offsetHeight,
      container: stageEl,
      draggable: true,
    });
    this.width = this.stage.width();
    this.height = this.stage.height();

    this.gridLayer = new Layer();
    this.stage.add(this.gridLayer);
    this.grid = new Grid(this.stage, this.gridLayer);

    this.linkLayer = new Layer();
    this.stage.add(this.linkLayer);

    this.graphLayer = new Layer();
    this.stage.add(this.graphLayer);

    this.setupStageScaling();

    this.setupNodes();

    this.setupEdges();

    this.grid.centerOrigin();

    this.stage.draw();
  }

  setupNodes() {
    this.graph.nodes.forEach(node => {
      this.createNode(node);
    });
    this.mouseNode = new MouseNode(this.stage);
  }

  setupEdges() {
    this.graph.edges.forEach(edge => {
      this.createEdge(edge);
    });
  }

  createNode(node) {
    const uiNode = new uiNodeTypes[node.type](node, {
      editable: this.opts.editable,
    });
    this.graphLayer.add(uiNode.group);
    this.nodes.push(uiNode);
    uiNode.on('draw', () => this.stage.batchDraw());
    let edgeToMouse = null;
    uiNode.on('newEdgeToMouse:start', fromUiNode => {
      const uiEdge = new EdgeUi(fromUiNode, this.mouseNode);
      this.setupEdge(uiEdge);
      edgeToMouse = uiEdge;
    });
    uiNode.on('newEdgeToMouse:finish', () => {
      // obv. to move to a command
      const textNode = new TextNode('oooh!');
      textNode.ui = {
        x: this.mouseNode.inletX(), // vite fait
        y: this.mouseNode.inletY() - 20,
      };
      this.graph.addNode(textNode);
      this.graph.createEdge(edgeToMouse.from.node, textNode);
      this.createNode(textNode);
      edgeToMouse.setTo(this.getNode(textNode.id));
    });
    let editStarted = false;
    uiNode.on('edit:start', () => {
      this.emit('edit:start', uiNode);
      editStarted = true;
    });
    this.stage.on('click', () => {
      if (editStarted) {
        this.emit('edit:finish');
        editStarted = false;
      }
    });
    uiNode.snapToGrid();
  }

  createEdge(edge) {
    const uiEdge = new EdgeUi(
      this.getNode(edge.from.id),
      this.getNode(edge.to.id),
    );
    this.setupEdge(uiEdge);
  }

  setupEdge(uiEdge) {
    this.linkLayer.add(uiEdge.line);
    uiEdge.on('draw', () => this.stage.batchDraw());
  }

  getNode(id) {
    return this.nodes.find(uiNode => uiNode.node.id === id);
  }

  getNodeBoundingBox(uiNode) {
    return {
      ...uiNode.group.absolutePosition(),
      width: uiNode.width * this.stage.scaleX(),
      height: uiNode.height * this.stage.scaleY(),
    };
  }

  setupStageScaling() {
    const scaleBy = 1.03;
    const { stage } = this;
    function reScale(e) {
      e.evt.preventDefault();
      const oldScale = stage.scaleX();

      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      const newScale =
        e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x:
          -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
          newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    }

    const debouncedReScale = throttle(reScale, 16);

    stage.on('wheel', debouncedReScale);
  }
}

export default GraphUi;
