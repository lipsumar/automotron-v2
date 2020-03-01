import { Stage, Layer, Rect } from 'konva';
import throttle from 'lodash.throttle';
import Grid from './Grid';

class GraphUi {
  stage = null;

  gridLayer = null;

  graphLayer = null;

  constructor(stageEl) {
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

    this.graphLayer = new Layer();
    this.stage.add(this.graphLayer);

    this.graphLayer.add(
      new Rect({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: 'red',
      }),
    );

    this.setupStageScaling();

    this.stage.draw();
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
