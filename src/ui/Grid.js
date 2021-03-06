import { Line } from 'konva';
import { colors, GRID_SIZE } from './constants';
import { clampValue } from './utils';

class Grid {
  stage = null;

  layer = null;

  verticalGridLines = [];

  horizontalGridLines = [];

  constructor(stage, layer) {
    this.width = stage.width();
    this.height = stage.height();
    this.layer = layer;
    this.stage = stage;
    this.space = GRID_SIZE;
    this.setup();
    stage.on('dragmove', this.reposition.bind(this));
    stage.on('wheel', this.reposition.bind(this));
    this.oldScale = 1;
  }

  setup() {
    this.verticalGridLines.forEach(({ line }) => {
      line.destroy();
    });
    this.verticalGridLines = [];
    this.horizontalGridLines.forEach(({ line }) => {
      line.destroy();
    });
    this.horizontalGridLines = [];

    const { x: x_, y: y_, width, height } = this.getNormalizedGeo();
    for (let x = clampValue(x_, GRID_SIZE); x < x_ + width; x += this.space) {
      this.addVerticalGridLine(x);
    }
    for (let y = clampValue(y_, GRID_SIZE); y < y_ + height; y += this.space) {
      this.addHorizontalGridLine(y);
    }
  }

  getNormalizedGeo() {
    const scale = 1 / this.stage.scaleX();
    const x = this.stage.x() * -1 * scale;
    const y = this.stage.y() * -1 * scale;
    const width = this.width * scale;
    const height = this.height * scale;
    return { scale, x, y, width, height };
  }

  reposition() {
    this.width = this.stage.width();
    this.height = this.stage.height();
    const { scale, x, y, width, height } = this.getNormalizedGeo();

    if (this.oldScale < 5 && scale > 5) {
      // reset
      this.space *= 3;
      this.setup();
    }
    if (this.oldScale > 5 && scale < 5) {
      this.space = GRID_SIZE;
      this.setup();
    }
    this.oldScale = scale;

    // remove lines out of viewport
    this.verticalGridLines = this.verticalGridLines.filter(
      ({ x: lineX, line }) => {
        if (lineX < x || lineX > x + width) {
          line.destroy();
          return false;
        }
        return true;
      },
    );
    this.horizontalGridLines = this.horizontalGridLines.filter(
      ({ y: lineY, line }) => {
        if (lineY < y || lineY > y + height) {
          line.destroy();
          return false;
        }
        return true;
      },
    );

    if (
      this.verticalGridLines.length === 0 ||
      this.horizontalGridLines.length === 0
    ) {
      this.setup();
      return;
    }

    // add missing lines (left)
    if (this.verticalGridLines[0].x > x + this.space) {
      for (
        let newLineX = this.verticalGridLines[0].x;
        newLineX > x;
        newLineX -= this.space
      ) {
        this.addVerticalGridLine(newLineX, 'unshift');
      }
    }
    // add missing lines (top)
    if (this.horizontalGridLines[0].y > y + this.space) {
      for (
        let newLineY = this.horizontalGridLines[0].y;
        newLineY > y;
        newLineY -= this.space
      ) {
        this.addHorizontalGridLine(newLineY, 'unshift');
      }
    }
    // add missing lines (right)
    const lastVGridLine = this.verticalGridLines[
      this.verticalGridLines.length - 1
    ];
    if (lastVGridLine.x < x + width - this.space) {
      for (
        let newLineX = lastVGridLine.x;
        newLineX < x + width;
        newLineX += this.space
      ) {
        this.addVerticalGridLine(newLineX);
      }
    }
    // add missing lines (bottom)
    const lastHGridLine = this.horizontalGridLines[
      this.horizontalGridLines.length - 1
    ];
    if (lastHGridLine.y < y + height - this.space) {
      for (
        let newLineY = lastHGridLine.y;
        newLineY < y + height;
        newLineY += this.space
      ) {
        this.addHorizontalGridLine(newLineY);
      }
    }

    // resize them all
    this.verticalGridLines.forEach(({ x: lineX, line }) => {
      line.points([lineX, y, lineX, y + height]);
    });
    this.horizontalGridLines.forEach(({ y: lineY, line }) => {
      line.points([x, lineY, x + width, lineY]);
    });
  }

  addVerticalGridLine(x, method = 'push') {
    const { y, height } = this.getNormalizedGeo();
    const points = [x, y, x, height];
    const line = new Line({
      points,
      stroke: colors.gridLine,
      strokeWidth: 1, // x % (this.space * 4) === 0 ? 2 : 1,
    });
    this.verticalGridLines[method]({ x, line });
    this.layer.add(line);
  }

  addHorizontalGridLine(y, method = 'push') {
    const { x, width } = this.getNormalizedGeo();
    const points = [x, y, width, y];
    const line = new Line({
      points,
      stroke: colors.gridLine,
      strokeWidth: 1, // y % (this.space * 4) === 0 ? 2 : 1,
    });
    this.horizontalGridLines[method]({ y, line });
    this.layer.add(line);
  }

  /**
   * Brings 0,0 at the center
   */
  centerOrigin() {
    this.stage.x(this.width / 2);
    this.stage.y(this.height / 2);
    this.reposition();
  }
}

export default Grid;
