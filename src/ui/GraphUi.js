import { Stage, Layer } from 'konva';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import { EventEmitter } from 'events';
import Grid from './Grid';
import StartNodeUi from './StartNodeUi';
import TextNodeUi from './TextNodeUi';
import EdgeUi from './EdgeUi';
import GeneratorEdgeUi from './GeneratorEdgeUi';
import AgreementEdgeUi from './AgreementEdgeUi';
import findBoundaries from '../utils/findBoundaries';
import GraphNodeUi from './GraphNodeUi';

const uiNodeTypes = {
  start: StartNodeUi,
  text: TextNodeUi,
  graph: GraphNodeUi,
};

const uiEdgeTypes = {
  default: EdgeUi,
  generator: GeneratorEdgeUi,
  agreement: AgreementEdgeUi,
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

    window.addEventListener(
      'resize',
      debounce(this.onWindowResize.bind(this), 100),
    );

    this.gridLayer = new Layer();
    this.stage.add(this.gridLayer);

    this.linkLayer = new Layer();
    this.stage.add(this.linkLayer);

    this.graphLayer = new Layer();
    this.stage.add(this.graphLayer);

    this.setupStageScaling();

    this.setupNodes();
    this.setupEdges();
    this.postSetup();

    // this.grid.centerOrigin();

    this.centerGraph();
    this.grid = new Grid(this.stage, this.gridLayer);
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

  postSetup() {
    this.nodes.forEach(uiNode => {
      this.refreshNode(uiNode);
    });
  }

  refreshNode(uiNode) {
    const generator = this.graph.getGeneratorFrom(uiNode.node);
    let generatorValue = null;
    if (generator) {
      generatorValue = generator.value[0] || { text: ' ' };
      if (generator.title) {
        generatorValue = { text: generator.title };
      }
    }

    const isGenerator = this.graph.isNodeGenerator(uiNode.node);
    if (isGenerator) {
      const generated = this.graph.getNodesGeneratedBy(uiNode.node);
      generated.forEach(gen => this.refreshNode(this.getNode(gen.id)));
    }

    uiNode.node.patchUi({ generatorValue });
    uiNode.refresh();
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
    return uiNode;
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
    const AbstractUiEdge = uiEdgeTypes[edge.type];
    const uiEdge = new AbstractUiEdge(
      this.getNode(edge.from.id),
      this.getNode(edge.to.id),
      edge,
      { editable: this.opts.editable },
    );
    uiEdge.edge = edge;
    this.edges.push(uiEdge);
    this.setupEdge(uiEdge);
    this.emit('edge:created', uiEdge);
  }

  removeEdge(edge) {
    this.getEdge(edge.id).destroy();
    this.refreshNode(this.getNode(edge.from.id));
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

  setNodeError(nodeId, error) {
    const uiNode = this.getNode(nodeId);
    uiNode.setError(error);
  }

  resetNodeErrors() {
    this.nodes.forEach(uiNode => uiNode.setError(null));
  }

  zoomIn() {
    const oldScale = this.stage.scaleX();
    const scaleBy = 1.2;
    this.stage.scale({ x: oldScale * scaleBy, y: oldScale * scaleBy });
    this.stage.batchDraw();
    if (this.grid) {
      this.grid.reposition();
    }
  }

  zoomOut() {
    const oldScale = this.stage.scaleX();
    const scaleBy = 1.2;
    this.stage.scale({ x: oldScale / scaleBy, y: oldScale / scaleBy });
    this.stage.batchDraw();
    if (this.grid) {
      this.grid.reposition();
    }
  }

  draw() {
    this.stage.batchDraw();
  }

  centerGraph() {
    this.stage.scale({ x: 1, y: 1 });
    const { mostLeft, mostTop, mostRight, mostBottom } = findBoundaries(
      this.graph,
    );
    const width = mostRight - mostLeft;
    const height = mostBottom - mostTop;
    const maxWidth = this.stage.width();
    const maxHeight = this.stage.height();
    let scale = maxWidth / width;
    if (height * scale > maxHeight) {
      scale = maxHeight / height;
    }
    if (scale > 1) scale = 1;

    this.stage.scale({ x: scale, y: scale });

    let mostTopStage = -mostTop;
    if (height * scale < maxHeight) {
      mostTopStage += maxHeight / scale / 2 - height / 2;
    }
    this.stage.y(mostTopStage * scale);

    let mostLeftStage = -mostLeft;
    if (width * scale < maxWidth) {
      mostLeftStage += maxWidth / scale / 2 - width / 2;
    }
    this.stage.x(mostLeftStage * scale);

    if (this.grid) {
      this.grid.reposition();
    }
  }

  onWindowResize() {
    const newWidth = document.body.offsetWidth - 400;
    const newHeight = this.stage.attrs.container.offsetHeight;
    this.stage.width(newWidth);
    this.stage.height(newHeight);
    this.width = this.stage.width();
    this.height = this.stage.height();
    if (this.grid) {
      this.grid.reposition();
      this.stage.batchDraw();
    }
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
