import { Group } from 'konva';

class NodeUi {
  group = null;

  constructor(opts) {
    this.group = new Group({
      x: opts.pos.x,
      y: opts.pos.y,
      draggable: true,
    });
  }
}

export default NodeUi;
