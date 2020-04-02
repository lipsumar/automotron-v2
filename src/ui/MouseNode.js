import { EventEmitter } from 'events';

class MouseNode extends EventEmitter {
  constructor(stage) {
    super();
    this.stage = stage;
    stage.on('dragmove mousemove', this.setPoint.bind(this));
  }

  setPoint() {
    const transform = this.stage.getAbsoluteTransform().copy();
    transform.invert();
    const point = transform.point(this.stage.getPointerPosition());
    this.point = point;
    this.emit('moved');
  }

  inletX() {
    return this.point.x;
  }

  inletY() {
    return this.point.y;
  }

  centerX() {
    return this.inletX();
  }

  centerY() {
    return this.inletY();
  }
}

export default MouseNode;
