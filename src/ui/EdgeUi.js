import { Line } from 'konva';
import { EventEmitter } from 'events';
import { colors } from './constants';

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

class EdgeUi extends EventEmitter {
  constructor(from, to, edge, opts = {}) {
    super();
    this.edge = edge;
    this.boundPosition = this.position.bind(this);
    this.from = from;
    this.fromOutlet = opts.fromOutlet || 'default';
    this.setTo(to);

    this.line = new Line({
      points: this.getPoints(),
      strokeWidth: 8,
      lineJoin: 'round',
      bezier: true,
    });

    if (opts.editable) {
      this.line.on('mousedown', e => {
        if (e.evt.button === 2) {
          this.emit('contextmenu');
        }
      });
    }

    this.refresh();

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
    this.line.clearCache();
    this.line.points(this.getPoints());
    this.emit('draw');
    this.line.cache();
  }

  refresh() {
    this.line.clearCache();
    if (!this.edge) {
      this.line.stroke(colors.edge);
      return;
    }
    this.line.stroke(this.edge.space ? colors.edge : colors.edgeNoSpace);
    this.line.cache();
  }

  getPoints() {
    const { from, to } = this;
    const fromX = from.outletX();
    const fromY = from.outletY(true, this.fromOutlet);
    const toX = to.inletX();
    const toY = to.inletY();
    const points = [fromX, fromY];

    points.push(...[fromX + (toX - fromX) / 2, fromY]);
    points.push(...[fromX + (toX - fromX) / 2, toY]);

    points.push(...[toX, toY]);
    return points;
  }

  getPointsMetro() {
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
    if (this.to) {
      this.to.off('moved', this.boundPosition);
    }
    if (this.from) {
      this.from.off('moved', this.boundPosition);
    }
    this.line.destroy();
  }

  isNode() {
    return false;
  }
}

export default EdgeUi;
