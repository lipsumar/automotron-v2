import { Stage, Layer } from 'konva';
import throttle from 'lodash.throttle';
import { EventEmitter } from 'events';
import Grid from './Grid';
import StartNodeUi from './StartNodeUi';
import TextNodeUi from './TextNodeUi';
import EdgeUi from './EdgeUi';

const uiNodeTypes = {
  start: StartNodeUi,
  text: TextNodeUi,
};

class GraphUi extends EventEmitter {
  stage = null;

  gridLayer = null;

  graphLayer = null;

  nodes = [];

  edges = [];

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
  }

  setupEdges() {
    this.graph.edges.forEach(edge => {
      this.createEdge(edge);
    });
  }

  createNode(node) {
    if (this.getNode(node.id)) {
      throw new Error('nodeUi already created for node');
    }
    const uiNode = new uiNodeTypes[node.type](node, {
      editable: this.opts.editable,
    });
    this.graphLayer.add(uiNode.group);
    this.nodes.push(uiNode);
    uiNode.on('draw', () => this.stage.batchDraw());
    uiNode.snapToGrid();
    this.emit('node:created', uiNode);
  }

  removeNode(nodeId) {
    const edges = this.getEdgesConnectedTo(nodeId);
    edges.forEach(uiEdge => this.removeEdge(uiEdge.edge));
    // edges.forEach(edge => edge.destroy());
    // this.edges = this.edges.filter(uiEdge => {
    //   return uiEdge.from.node.id !== nodeId && uiEdge.to.node.id !== nodeId;
    // });
    this.getNode(nodeId).destroy();
    this.nodes = this.nodes.filter(uiNode => uiNode.node.id !== nodeId);
    this.draw();
  }

  createEdge(edge) {
    const uiEdge = new EdgeUi(
      this.getNode(edge.from.id),
      this.getNode(edge.to.id),
    );
    uiEdge.edge = edge;
    this.edges.push(uiEdge);
    this.setupEdge(uiEdge);
  }

  removeEdge(edge) {
    this.getEdge(edge.id).destroy();
    this.edges = this.edges.filter(uiEdge => {
      return uiEdge.edge.id !== edge.id;
    });
  }

  setupEdge(uiEdge) {
    this.linkLayer.add(uiEdge.line);
    uiEdge.on('draw', () => this.stage.batchDraw());
  }

  getNode(id) {
    return this.nodes.find(uiNode => uiNode.node.id === id);
  }

  getEdge(id) {
    return this.edges.find(uiEdge => uiEdge.edge.id === id);
  }

  getEdgesConnectedTo(nodeId) {
    return this.edges.filter(uiEdge => {
      return uiEdge.from.node.id === nodeId || uiEdge.to.node.id === nodeId;
    });
  }

  getNodeBoundingBox(uiNode) {
    return {
      ...uiNode.group.absolutePosition(),
      width: uiNode.width * this.stage.scaleX(),
      height: uiNode.height * this.stage.scaleY(),
    };
  }

  draw() {
    this.stage.batchDraw();
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
