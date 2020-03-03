import { Stage, Layer } from 'konva';
import throttle from 'lodash.throttle';
import Grid from './Grid';
import StartNodeUi from './StartNodeUi';
import TextNodeUi from './TextNodeUi';
import EdgeUi from './EdgeUi';

const uiNodeTypes = {
  start: StartNodeUi,
  text: TextNodeUi,
};

class GraphUi {
  stage = null;

  gridLayer = null;

  graphLayer = null;

  nodes = [];

  constructor(stageEl, graph) {
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
    const edge = new EdgeUi(this.nodes[0], this.nodes[1]);
    this.linkLayer.add(edge.line);
    const edge2 = new EdgeUi(this.nodes[0], this.nodes[2]);
    this.linkLayer.add(edge2.line);
    edge.on('draw', () => this.stage.batchDraw());
    edge2.on('draw', () => this.stage.batchDraw());
  }

  createNode(node) {
    const uiNode = new uiNodeTypes[node.type]({
      pos: { x: node.ui.x, y: node.ui.y },
    });
    this.graphLayer.add(uiNode.group);
    this.nodes.push(uiNode);
    uiNode.on('draw', () => this.stage.batchDraw());
    uiNode.snapToGrid();
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
