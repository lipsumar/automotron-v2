import { EventEmitter } from 'events';

class MouseNode extends EventEmitter {
  constructor(stage) {
    super();
    this.stage = stage;
    stage.on('dragmove', this.setPoint.bind(this));

    // initialize pointer position, so this.point is set without
    // need to dragmove the stage
    const self = this;
    function onMouseMove(e) {
      stage.setPointersPositions(e);
      self.setPoint();
      window.removeEventListener('mousemove', onMouseMove);
    }
    window.addEventListener('mousemove', onMouseMove);
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
}

export default MouseNode;
