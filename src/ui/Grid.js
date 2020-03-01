import { Line } from 'konva';

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
    this.space = 50;
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
    for (let x = 0; x < this.width; x += this.space) {
      this.addVerticalGridLine(x);
    }
    for (let y = 0; y < this.height; y += this.space) {
      this.addHorizontalGridLine(y);
    }
  }

  reposition() {
    const scale = 1 / this.stage.scaleX();
    const x = this.stage.x() * -1 * scale;
    const y = this.stage.y() * -1 * scale;
    const width = this.width * scale;
    const height = this.height * scale;

    if (this.oldScale < 5 && scale > 5) {
      // reset
      this.space = 150;
      this.setup();
    }
    if (this.oldScale > 5 && scale < 5) {
      this.space = 50;
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
    const points = [x, 0, x, this.height];
    const line = new Line({
      points,
      stroke: '#9cbbc5',
      strokeWidth: x % (this.space * 3) === 0 ? 2 : 1,
    });
    this.verticalGridLines[method]({ x, line });
    this.layer.add(line);
  }

  addHorizontalGridLine(y, method = 'push') {
    const points = [0, y, this.width, y];
    const line = new Line({
      points,
      stroke: '#9cbbc5',
      strokeWidth: y % (this.space * 3) === 0 ? 2 : 1,
    });
    this.horizontalGridLines[method]({ y, line });
    this.layer.add(line);
  }
}

export default Grid;
