import { Line } from 'konva';
import { EventEmitter } from 'events';

class EdgeUi extends EventEmitter {
  constructor(from, to) {
    super();
    this.from = from;
    this.to = to;
    this.line = new Line({
      points: this.getPoints(),
      stroke: '#7791F9',
      strokeWidth: 8,
      lineJoin: 'round',
    });
    from.on('moved', this.position.bind(this));
    to.on('moved', this.position.bind(this));
  }

  position() {
    this.line.points(this.getPoints());
    this.emit('draw');
  }

  getPoints() {
    const { from, to } = this;
    const points = [from.outletX(), from.outletY()];

    const half = Math.abs(from.outletY() - to.inletY()) / 2;
    const centerX = (to.inletX() - from.outletX()) / 2;
    if (half < centerX) {
      points.push(...[from.outletX() + centerX - half, from.outletY()]);
      points.push(...[from.outletX() + centerX + half, to.inletY()]);
    } else if (from.outletY() < to.inletY()) {
      points.push(...[from.outletX() + centerX, from.outletY() + centerX]);
      points.push(...[from.outletX() + centerX, to.inletY() - centerX]);
    } else {
      points.push(...[from.outletX() + centerX, from.outletY() - centerX]);
      points.push(...[from.outletX() + centerX, to.inletY() + centerX]);
    }

    points.push(...[to.inletX(), to.inletY()]);
    return points;
  }
}

export default EdgeUi;
