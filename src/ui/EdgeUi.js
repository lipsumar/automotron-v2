import { Line } from 'konva';
import { EventEmitter } from 'events';

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

class EdgeUi extends EventEmitter {
  constructor(from, to) {
    super();
    this.boundPosition = this.position.bind(this);
    this.from = from;
    this.setTo(to);

    this.line = new Line({
      points: this.getPoints(),
      stroke: '#7791F9',
      strokeWidth: 8,
      lineJoin: 'round',
    });

    from.on('moved', this.boundPosition);
  }

  setTo(to) {
    if (this.to) {
      this.to.off('moved', this.boundPosition);
    }
    this.to = to;
    to.on('moved', this.boundPosition);
  }

  position() {
    this.line.points(this.getPoints());
    this.emit('draw');
  }

  getPoints() {
    const { from, to } = this;
    const fromX = from.outletX();
    const fromY = from.outletY();
    const toX = to.inletX();
    const toY = to.inletY();
    const points = [fromX, fromY];

    const half = Math.abs(fromY - toY) / 2;
    const centerX = (toX - fromX) / 2;
    const dist = distance(fromX, fromY, toX, toY);

    if (half < centerX) {
      points.push(...[fromX + centerX - half, fromY]);
      points.push(...[fromX + centerX + half, toY]);
    } else if (fromY < toY) {
      if (centerX < 25 && dist > 100) {
        points.push(...[fromX + 25, fromY + 25]);
        points.push(...[fromX + 25, fromY + 25 + 25]);

        points.push(...[toX - 25, toY - 25 - 25]);
        points.push(...[toX - 25, toY - 25]);
      } else {
        points.push(...[fromX + centerX, fromY + centerX]);
        points.push(...[fromX + centerX, toY - centerX]);
      }
    } else if (centerX < 25 && dist > 100) {
      points.push(...[fromX + 25, fromY - 25]);
      points.push(...[fromX + 25, fromY - 25 - 25]);

      points.push(...[toX - 25, toY + 25 + 25]);
      points.push(...[toX - 25, toY + 25]);
    } else {
      points.push(...[fromX + centerX, fromY - centerX]);
      points.push(...[fromX + centerX, toY + centerX]);
    }

    points.push(...[toX, toY]);
    return points;
  }

  destroy() {
    this.line.destroy();
  }
}

export default EdgeUi;
